import { type CSSProperties, useEffect, useRef } from 'react';
import { useReducedMotion } from 'motion/react';

type InteractionMode = 'sensor' | 'substrate';

type GPUCanvasContextLike = {
  configure: (config: {
    device: unknown;
    format: string;
    alphaMode?: 'opaque' | 'premultiplied';
    usage?: number;
  }) => void;
  getCurrentTexture: () => GPUTexture;
  unconfigure?: () => void;
};

type GPUAdapterLike = {
  requestDevice: () => Promise<GPUDeviceLike>;
};

type GPUDeviceLike = {
  createShaderModule: (descriptor: { code: string }) => GPUShaderModule;
  createRenderPipeline: (descriptor: GPURenderPipelineDescriptor) => GPURenderPipeline;
  createBuffer: (descriptor: GPUBufferDescriptor) => GPUBuffer;
  createBindGroup: (descriptor: GPUBindGroupDescriptor) => GPUBindGroup;
  createCommandEncoder: () => GPUCommandEncoder;
  queue: GPUQueue;
  lost?: Promise<unknown>;
  destroy?: () => void;
};

const shaderCode = `
struct Uniforms {
  viewport: vec4f,
  controls: vec4f,
  interactionPrimary: vec4f,
  interactionSecondary: vec4f,
  interactionMemory: vec4f,
}

@group(0) @binding(0) var<uniform> uniforms: Uniforms;

struct VertexOutput {
  @builtin(position) position: vec4f,
  @location(0) uv: vec2f,
}

@vertex
fn vsMain(@builtin(vertex_index) index: u32) -> VertexOutput {
  var positions = array<vec2f, 3>(
    vec2f(-1.0, -3.0),
    vec2f(-1.0, 1.0),
    vec2f(3.0, 1.0)
  );

  let clip = positions[index];
  var output: VertexOutput;
  output.position = vec4f(clip, 0.0, 1.0);
  output.uv = clip * 0.5 + vec2f(0.5);
  return output;
}

fn boxSdf(p: vec2f, b: vec2f) -> f32 {
  let d = abs(p) - b;
  return length(max(d, vec2f(0.0))) + min(max(d.x, d.y), 0.0);
}

fn hash(p: vec2f) -> f32 {
  return fract(sin(dot(p, vec2f(41.0, 289.0))) * 43758.5453123);
}

fn noise2(p: vec2f) -> f32 {
  let i = floor(p);
  let f = fract(p);
  let a = hash(i);
  let b = hash(i + vec2f(1.0, 0.0));
  let c = hash(i + vec2f(0.0, 1.0));
  let d = hash(i + vec2f(1.0, 1.0));
  let u = f * f * (vec2f(3.0) - 2.0 * f);
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

fn rotate2d(p: vec2f, angle: f32) -> vec2f {
  let s = sin(angle);
  let c = cos(angle);
  return vec2f(c * p.x - s * p.y, s * p.x + c * p.y);
}

fn fbm(p: vec2f) -> f32 {
  var value = 0.0;
  var amplitude = 0.5;
  var q = p;

  for (var i = 0; i < 5; i = i + 1) {
    value = value + noise2(q) * amplitude;
    q = rotate2d(q * 2.03 + vec2f(17.3, 9.2), 0.35);
    amplitude = amplitude * 0.54;
  }

  return value;
}

fn spectrum(t: f32) -> vec3f {
  let r = smoothstep(0.05, 0.40, t) * (1.0 - smoothstep(0.58, 0.88, t));
  let g = smoothstep(0.18, 0.52, t) * (1.0 - smoothstep(0.64, 0.94, t));
  let b = smoothstep(0.34, 0.70, t) * (1.0 - smoothstep(0.82, 1.0, t));
  return vec3f(r, g, b);
}

fn lobe(p: vec2f, center: vec2f, scale: vec2f, skew: vec2f) -> f32 {
  let q = vec2f(
    (p.x - center.x) * scale.x + (p.y - center.y) * skew.x,
    (p.y - center.y) * scale.y + (p.x - center.x) * skew.y
  );
  return exp(-dot(q, q));
}

struct MediumSample {
  height: f32,
  thickness: f32,
  density: f32,
  film: f32,
  volume: f32,
}

fn interactionAspect() -> f32 {
  return uniforms.viewport.x / max(uniforms.viewport.y, 1.0);
}

fn pointerCenter() -> vec2f {
  let aspect = interactionAspect();
  return vec2f((uniforms.interactionPrimary.x - 0.5) * aspect, uniforms.interactionPrimary.y - 0.5);
}

fn memoryCenter() -> vec2f {
  let aspect = interactionAspect();
  return vec2f((uniforms.interactionMemory.x - 0.5) * aspect, uniforms.interactionMemory.y - 0.5);
}

fn radialField(delta: vec2f, radius: f32) -> f32 {
  return exp(-dot(delta, delta) / max(radius * radius, 0.0001));
}

fn samplePrismMedium(p: vec2f, t: f32) -> MediumSample {
  let presence = uniforms.interactionPrimary.z;
  let energy = uniforms.interactionPrimary.w;
  let coherence = uniforms.interactionSecondary.x;
  let memory = uniforms.interactionSecondary.y;
  let phaseBias = uniforms.interactionSecondary.z;
  let variant = uniforms.interactionSecondary.w;
  let velocity = uniforms.interactionMemory.z;
  let sensorBlend = 1.0 - variant;
  let substrateBlend = variant;
  let pointerDelta = p - pointerCenter();
  let memoryDelta = p - memoryCenter();
  let attentionRadius = mix(0.18, 0.3, variant) + coherence * mix(0.12, 0.18, variant);
  let retentionRadius = mix(0.24, 0.4, variant);
  let attention = presence * radialField(pointerDelta, attentionRadius);
  let retention = memory * radialField(memoryDelta, retentionRadius);
  let sensorCompression = 1.0 - attention * coherence * sensorBlend * 0.24;
  let sensorFocusP = pointerCenter() + pointerDelta * sensorCompression;
  let substrateWake = vec2f(-memoryDelta.y, memoryDelta.x) * retention * 0.026 +
    vec2f(-pointerDelta.y, pointerDelta.x) * energy * velocity * substrateBlend * attention * 0.012;
  let lens = exp(-dot(p * vec2f(0.88, 1.22), p * vec2f(0.88, 1.22)) * 2.6);
  let drift = vec2f(t * 0.055, -t * 0.04) +
    vec2f(phaseBias * 0.02, -phaseBias * 0.018) +
    substrateWake;
  let mediumSeedP = mix(p, sensorFocusP, sensorBlend * attention * 0.34) + substrateWake;
  let warpA = fbm(rotate2d(mediumSeedP * 2.1 + drift, 0.42));
  let warpB = fbm(rotate2d(mediumSeedP * 2.8 - drift.yx, -0.58));
  let warpC = fbm(mediumSeedP * 4.2 + vec2f(-t * 0.09, t * 0.07));
  let warp = vec2f(warpA - 0.5, warpB - 0.5) * 0.34;
  let q = mediumSeedP +
    warp * (1.0 - attention * sensorBlend * 0.22 + retention * substrateBlend * 0.08) +
    vec2f((warpC - 0.5) * (0.08 - attention * sensorBlend * 0.02 + retention * substrateBlend * 0.02));

  let broad = fbm(q * 2.3 + vec2f(t * 0.028, -t * 0.018));
  let fine = fbm(rotate2d(q * 6.4 - vec2f(t * 0.11, t * 0.07), 0.18));
  let veins = abs(fbm(q * 7.8 + vec2f(-t * 0.08, t * 0.05)) * 2.0 - 1.0);
  let swirl = sin((q.x * 5.8 - q.y * 4.1) + broad * 5.2 + t * 0.34) * 0.5 + 0.5;
  let oilBand = smoothstep(0.24, 0.88, mix(fine, 1.0 - veins, 0.58));
  let focusedBands = smoothstep(0.22, 0.88, broad * 0.52 + fine * 0.28 + oilBand * 0.34);

  let height = lens * 0.76 + broad * 0.24 + swirl * 0.10 + oilBand * 0.08 +
    attention * sensorBlend * (0.05 + coherence * 0.12) +
    retention * substrateBlend * 0.06;
  let thickness = 0.24 + lens * 0.92 + broad * 0.34 + oilBand * 0.28 +
    attention * sensorBlend * (0.12 + coherence * 0.16) +
    retention * substrateBlend * (0.12 + velocity * 0.08);
  let density = smoothstep(
    0.34 - attention * sensorBlend * 0.05,
    0.96,
    broad * 0.66 + fine * 0.24 + oilBand * 0.26 + focusedBands * attention * sensorBlend * 0.18 + retention * substrateBlend * 0.12
  ) * (0.34 + lens * 0.66 + attention * sensorBlend * 0.08);
  let film = mix(swirl, 1.0 - veins, 0.62 - attention * sensorBlend * 0.08) + retention * substrateBlend * 0.08;
  let volume = smoothstep(
    0.32 - retention * substrateBlend * 0.04,
    0.94,
    fine * 0.44 + broad * 0.34 + lens * 0.36 + retention * substrateBlend * 0.18 + attention * sensorBlend * 0.08
  ) * (0.4 + oilBand * 0.6 + retention * substrateBlend * 0.14);

  return MediumSample(height, thickness, density, film, volume);
}

fn thinFilmIridescence(thickness: f32, ndv: f32, film: f32) -> vec3f {
  let phase = thickness * 18.0 + film * 8.0 - ndv * 6.5;
  let r = 0.5 + 0.5 * cos(phase * 1.05 + 0.2);
  let g = 0.5 + 0.5 * cos(phase * 1.24 + 2.1);
  let b = 0.5 + 0.5 * cos(phase * 1.43 + 4.25);
  return vec3f(r, g, b);
}

fn environmentLight(uv: vec2f, t: f32) -> vec3f {
  let p = uv - vec2f(0.5);
  let topGlow = exp(-pow((uv.y - 0.16) * 12.0, 2.0)) * 0.52;
  let sideGlowA = exp(-pow((uv.x - 0.16 + sin(t * 0.08) * 0.03) * 10.5, 2.0)) * 0.42;
  let sideGlowB = exp(-pow((uv.x - 0.82 + cos(t * 0.06) * 0.02) * 14.0, 2.0)) * 0.34;
  let diagonal = exp(-pow((p.x * 0.88 + p.y * 0.55 + 0.04) * 9.0, 2.0)) * 0.32;
  let core = exp(-dot(p * vec2f(1.1, 1.6), p * vec2f(1.1, 1.6)) * 4.4) * 0.18;
  return vec3f(0.03, 0.035, 0.04) +
    vec3f(0.86, 0.9, 0.96) * topGlow +
    vec3f(0.72, 0.78, 0.92) * sideGlowA +
    vec3f(0.82, 0.88, 0.98) * sideGlowB +
    vec3f(0.44, 0.52, 0.62) * diagonal +
    vec3f(0.18, 0.2, 0.24) * core;
}

fn luminance(color: vec3f) -> f32 {
  return dot(color, vec3f(0.2126, 0.7152, 0.0722));
}

fn bayer4(pixel: vec2u) -> f32 {
  let x = pixel.x % 4u;
  let y = pixel.y % 4u;

  if (y == 0u) {
    if (x == 0u) { return 0.0 / 16.0; }
    if (x == 1u) { return 8.0 / 16.0; }
    if (x == 2u) { return 2.0 / 16.0; }
    return 10.0 / 16.0;
  }

  if (y == 1u) {
    if (x == 0u) { return 12.0 / 16.0; }
    if (x == 1u) { return 4.0 / 16.0; }
    if (x == 2u) { return 14.0 / 16.0; }
    return 6.0 / 16.0;
  }

  if (y == 2u) {
    if (x == 0u) { return 3.0 / 16.0; }
    if (x == 1u) { return 11.0 / 16.0; }
    if (x == 2u) { return 1.0 / 16.0; }
    return 9.0 / 16.0;
  }

  if (x == 0u) { return 15.0 / 16.0; }
  if (x == 1u) { return 7.0 / 16.0; }
  if (x == 2u) { return 13.0 / 16.0; }
  return 5.0 / 16.0;
}

@fragment
fn fsMain(input: VertexOutput) -> @location(0) vec4f {
  let uv = input.uv;
  let res = max(uniforms.viewport.xy, vec2f(1.0));
  let t = uniforms.viewport.z;
  let seed = uniforms.viewport.w;
  let motion = uniforms.controls.x;
  let dither = uniforms.controls.y;
  let ditherPixelSize = uniforms.controls.z;
  let comic = uniforms.controls.w;
  let presence = uniforms.interactionPrimary.z;
  let energy = uniforms.interactionPrimary.w;
  let coherence = uniforms.interactionSecondary.x;
  let memory = uniforms.interactionSecondary.y;
  let phaseBias = uniforms.interactionSecondary.z;
  let variant = uniforms.interactionSecondary.w;
  let velocity = uniforms.interactionMemory.z;
  let pointerInside = uniforms.interactionMemory.w;
  let aspect = res.x / res.y;

  let centered = uv - vec2f(0.5);
  let outer = boxSdf(centered, vec2f(0.485, 0.46));
  let panelMask = 1.0 - smoothstep(0.0, 0.022, outer);
  let innerMask = 1.0 - smoothstep(0.0, 0.03, boxSdf(centered, vec2f(0.44, 0.36)));
  let sensorBlend = 1.0 - variant;
  let substrateBlend = variant;

  var renderUv = uv;
  if (ditherPixelSize > 1.0) {
    let blockCount = max(floor(res / ditherPixelSize), vec2f(1.0));
    renderUv = (floor(uv * blockCount) + vec2f(0.5)) / blockCount;
  }

  let phaseTime = t * motion + seed * 17.0 + phaseBias * mix(0.9, 0.62, variant);
  let p = vec2f((renderUv.x - 0.5) * aspect, renderUv.y - 0.5);
  let spread = exp(-pow(p.x * 1.04, 2.0) - pow(p.y * 1.36, 2.0));
  let spreadWide = exp(-pow(p.x * 0.72, 2.0) - pow(p.y * 0.9, 2.0));
  let seedOffset = vec2f(seed * 0.37, -seed * 0.29);
  let simplifiedP = p * 0.46 + vec2f(sin(phaseTime * 0.045), cos(phaseTime * 0.038)) * 0.035;
  let pointerCenterPos = pointerCenter();
  let pointerDelta = p - pointerCenterPos;
  let pointerRadius = mix(0.14, 0.31, variant) + coherence * mix(0.08, 0.12, variant);
  let pointerFalloff = exp(-dot(pointerDelta, pointerDelta) / max(pointerRadius * pointerRadius, 0.0001));
  let memoryCenterPos = memoryCenter();
  let memoryDelta = p - memoryCenterPos;
  let memoryRadius = mix(0.16, 0.36, variant);
  let memoryFalloff = exp(-dot(memoryDelta, memoryDelta) / max(memoryRadius * memoryRadius, 0.0001));
  let localCoherence = presence * coherence * pointerFalloff;
  let mediumP = mix(p, simplifiedP, comic * 0.82) + seedOffset;
  let medium = samplePrismMedium(mediumP, phaseTime);

  let eps = 1.8 / min(res.x, res.y);
  let gradientEps = mix(eps, eps * 3.6, comic * 0.92);
  let sampleXPos = samplePrismMedium(mediumP + vec2f(gradientEps, 0.0), phaseTime);
  let sampleXNeg = samplePrismMedium(mediumP - vec2f(gradientEps, 0.0), phaseTime);
  let sampleYPos = samplePrismMedium(mediumP + vec2f(0.0, gradientEps), phaseTime);
  let sampleYNeg = samplePrismMedium(mediumP - vec2f(0.0, gradientEps), phaseTime);
  let gradX = (sampleXPos.height - sampleXNeg.height) / (2.0 * gradientEps);
  let gradY = (sampleYPos.height - sampleYNeg.height) / (2.0 * gradientEps);
  let curvature = abs(sampleXPos.height + sampleXNeg.height + sampleYPos.height + sampleYNeg.height - 4.0 * medium.height);
  let curvatureFocus = smoothstep(
    0.0012,
    0.018,
    curvature * (1.0 + medium.thickness * 0.55 + localCoherence * sensorBlend * 0.65 + memory * substrateBlend * 0.3)
  );

  let prismEdgeA = lobe(p, vec2f(-0.26 + sin(phaseTime * 0.1) * 0.03, -0.03), vec2f(2.8, 4.6), vec2f(0.46, -0.2));
  let prismEdgeB = lobe(p, vec2f(0.24 + cos(phaseTime * 0.08) * 0.04, 0.08), vec2f(2.5, 4.1), vec2f(-0.3, 0.28));
  let prismEdgeC = lobe(p, vec2f(0.02, -0.2 + sin(phaseTime * 0.06) * 0.03), vec2f(3.4, 5.2), vec2f(0.18, 0.24));
  let surfaceBands = smoothstep(0.18, 0.9, medium.film * 0.66 + medium.density * 0.4 + curvatureFocus * 0.34);
  let caustic = pow(max(surfaceBands * (0.42 + spreadWide * 0.58), 0.0), 2.8) *
    (0.72 + curvatureFocus * 0.48 + memory * substrateBlend * 0.18);

  let noise = (hash(floor(renderUv * res * 0.42) + floor(phaseTime * 6.0) + vec2f(seed * 31.0)) - 0.5) * 0.008;

  let fieldX = (gradX + prismEdgeA * 0.28 - prismEdgeB * 0.22 + prismEdgeC * 0.18) * 1.96;
  let fieldY = (gradY + prismEdgeB * 0.2 - prismEdgeA * 0.14 + prismEdgeC * 0.16) * 1.96;
  let normal = normalize(vec3f(fieldX, fieldY, 1.0));
  let lightDirA = normalize(vec3f(-0.45, -0.25, 0.86));
  let lightDirB = normalize(vec3f(0.62, 0.12, 0.78));
  let viewDir = vec3f(0.0, 0.0, 1.0);
  let incident = -viewDir;
  let halfA = normalize(lightDirA + viewDir);
  let halfB = normalize(lightDirB + viewDir);
  let ndv = max(dot(normal, viewDir), 0.0);
  let f0 = 0.04;
  let fresnel = f0 + (1.0 - f0) * pow(1.0 - ndv, 5.0);
  let specular = pow(max(dot(normal, halfA), 0.0), 92.0) * 0.34 + pow(max(dot(normal, halfB), 0.0), 144.0) * 0.2;

  let refractR = refract(incident, normal, 1.0 / 1.52);
  let refractG = refract(incident, normal, 1.0 / 1.48);
  let refractB = refract(incident, normal, 1.0 / 1.44);
  let refractionScale = (0.11 + medium.thickness * 0.05) * (0.8 + spreadWide * 0.2);
  let envR = environmentLight(clamp(renderUv + refractR.xy * refractionScale, vec2f(0.0), vec2f(1.0)), phaseTime);
  let envG = environmentLight(clamp(renderUv + refractG.xy * refractionScale, vec2f(0.0), vec2f(1.0)), phaseTime);
  let envB = environmentLight(clamp(renderUv + refractB.xy * refractionScale, vec2f(0.0), vec2f(1.0)), phaseTime);
  let refracted = vec3f(envR.x, envG.y, envB.z);

  let thinFilmBase = thinFilmIridescence(medium.thickness, ndv, medium.film);
  let thinFilmMono = vec3f(luminance(thinFilmBase));
  let thinFilm = mix(thinFilmBase, thinFilmMono, localCoherence * sensorBlend * 0.42);
  let reflectedPrism = spectrum(clamp(renderUv.x * 0.42 + renderUv.y * 0.58 + medium.film * 0.34 + curvatureFocus * 0.18, 0.0, 1.0)) * fresnel;

  var volumeColor = vec3f(0.0);
  var volumeEnergy = 0.0;
  let refractMid = refract(incident, normal, 1.0 / 1.47);
  for (var i = 0; i < 5; i = i + 1) {
    let depth = (f32(i) + 0.5) / 5.0;
    let sliceUv = clamp(
      renderUv + refractMid.xy * (depth * (0.22 + medium.thickness * 0.09)) + vec2f(depth * 0.01, -depth * 0.008) + seedOffset * 0.08,
      vec2f(0.0),
      vec2f(1.0)
    );
    let sliceP = vec2f((sliceUv.x - 0.5) * aspect, sliceUv.y - 0.5);
    let simplifiedSliceP = sliceP * 0.48 + vec2f(sin((phaseTime - depth) * 0.04), cos((phaseTime - depth) * 0.035)) * 0.03;
    let slice = samplePrismMedium(mix(sliceP, simplifiedSliceP, comic * 0.84) + seedOffset, phaseTime - depth * mix(0.28, 0.14, comic));
    let sliceIridescence = thinFilmIridescence(slice.thickness + depth * 0.24, ndv, mix(slice.film, medium.film, 0.25));
    let sliceCaustic = pow(slice.density * (0.78 + slice.volume * 0.74 + curvatureFocus * 0.32), 1.46) * (0.66 + spread * 0.34);
    volumeColor = volumeColor + mix(sliceIridescence, thinFilm, 0.22 + depth * 0.1) * sliceCaustic * (0.17 + depth * 0.1);
    volumeEnergy = volumeEnergy + sliceCaustic;
  }

  let absorption = exp(-vec3f(2.0, 1.28, 0.8) * medium.thickness * (0.2 + medium.volume * 0.08));
  let forwardScatter = pow(max(dot(refractMid, lightDirA), 0.0), 18.0) * (0.2 + medium.volume * 0.8);
  let transmitted = refracted * absorption * (0.72 + medium.volume * 0.16);
  let causticVolume = volumeColor * (0.84 + caustic * 0.44 + curvatureFocus * 0.62) + thinFilm * (caustic * 0.24 + curvatureFocus * 0.26) + reflectedPrism * 0.18;
  let beam = transmitted * 0.62 + causticVolume + vec3f(0.94, 0.97, 1.0) * specular * 1.34 + vec3f(0.78, 0.9, 1.0) * forwardScatter * 0.22;
  let rim = mix(vec3f(0.64, 0.78, 1.0), thinFilm, 0.5) * fresnel * 0.34;
  let volumeLift = thinFilm * (medium.volume * 0.16 + curvatureFocus * 0.12) + vec3f(0.88, 0.94, 1.0) * volumeEnergy * 0.022;
  let retainedBloom = spectrum(clamp(medium.film * 0.52 + phaseBias * 0.18 + seed * 0.23, 0.0, 1.0)) * memory * substrateBlend * memoryFalloff * 0.34;
  let detectionLift = vec3f(0.92, 0.96, 1.0) * localCoherence * sensorBlend * (0.04 + velocity * 0.012 + pointerInside * 0.012);
  var color = beam + rim + volumeLift + retainedBloom + detectionLift + vec3f(noise);

  var alpha = clamp(
    medium.density * 0.34 +
    medium.volume * 0.22 +
    caustic * 0.18 +
    curvatureFocus * 0.14 +
    prismEdgeA * 0.08 +
    prismEdgeB * 0.08 +
    prismEdgeC * 0.08 +
    specular * 0.28 +
    fresnel * 0.18 +
    innerMask * 0.02,
    0.0,
    0.9
  ) * panelMask * smoothstep(
    0.08,
    0.42,
    medium.density + medium.volume * 0.7 + caustic * 0.42 + curvatureFocus * 0.38 + specular * 0.36 + localCoherence * 0.18 + memory * substrateBlend * 0.22
  );

  if (dither > 0.001) {
    let pixel = vec2u(floor(renderUv * res + vec2f(seed * 13.0, seed * 29.0)));
    let threshold = (bayer4(pixel) - 0.5) * (0.18 + dither * 0.42);
    let levels = mix(18.0, 7.0, dither);
    color = floor(clamp(color + vec3f(threshold), vec3f(0.0), vec3f(4.0)) * levels) / levels;
    alpha = clamp(floor(clamp(alpha + threshold * 0.28, 0.0, 1.0) * levels) / levels, 0.0, 1.0);
  }

  if (comic > 0.001) {
    let posterLevels = mix(4.0, 2.0, comic);
    let poster = floor(clamp(color, vec3f(0.0), vec3f(4.0)) * posterLevels) / posterLevels;
    let baseLuma = luminance(poster);
    let macroUv = (uv - vec2f(0.5)) * vec2f(aspect, 1.0);
    let blendFieldA = fbm(macroUv * 1.18 + vec2f(seed * 2.7, -seed * 1.9) + vec2f(phaseTime * 0.028, -phaseTime * 0.017));
    let blendFieldB = fbm(rotate2d(macroUv * 0.94 + vec2f(-seed * 1.6, seed * 2.2), 0.74) - vec2f(phaseTime * 0.016, phaseTime * 0.022));
    let mergedZones = floor(clamp(blendFieldA * 0.62 + blendFieldB * 0.5 + baseLuma * 0.22, 0.0, 1.0) * 2.0) / 2.0;
    let paletteA = spectrum(clamp(mergedZones * 0.76 + seed * 0.18 + 0.08, 0.0, 1.0));
    let paletteB = spectrum(clamp(1.0 - mergedZones * 0.54 + seed * 0.11 + 0.22, 0.0, 1.0));
    let paletteC = spectrum(clamp(blendFieldB * 0.82 + 0.34, 0.0, 1.0));
    let chromaPalette = mix(mix(paletteA, paletteB, smoothstep(0.16, 0.84, mergedZones)), paletteC, 0.42);

    let screenScale = mix(30.0, 18.0, comic);
    let centeredUv = (renderUv - vec2f(0.5)) * res / screenScale;
    let dotR = length(fract(rotate2d(centeredUv + vec2f(seed * 3.1, seed * 1.7), 0.26)) - vec2f(0.5));
    let dotG = length(fract(rotate2d(centeredUv + vec2f(seed * 4.6, seed * 2.4), -0.41)) - vec2f(0.5));
    let dotB = length(fract(rotate2d(centeredUv + vec2f(seed * 2.8, seed * 5.2), 0.78)) - vec2f(0.5));

    let radiusBase = mix(0.52, 0.26, clamp(baseLuma, 0.0, 1.0));
    let maskR = 1.0 - smoothstep(radiusBase * 0.74, radiusBase * 1.06, dotR);
    let maskG = 1.0 - smoothstep(radiusBase * 0.70, radiusBase * 1.02, dotG);
    let maskB = 1.0 - smoothstep(radiusBase * 0.66, radiusBase * 0.98, dotB);

    let halftone = vec3f(maskR, maskG, maskB);
    let shadowBands = floor((mergedZones * 0.8 + baseLuma * 0.2) * 2.0) / 2.0;
    let flatShade = vec3f(shadowBands);
    let flatPoster = mix(flatShade, poster, 0.1);
    let edgeInk = smoothstep(0.18, 0.68, length(vec2f(gradX, gradY)) * 0.14 + curvatureFocus * 0.86 + (1.0 - ndv) * 0.34 + specular * 0.05);
    let rimInk = smoothstep(0.24, 0.72, fresnel + curvatureFocus * 0.64);
    let backdrop = mix(
      chromaPalette * (0.92 + mergedZones * 0.72),
      mix(paletteB, paletteC, 0.5) * (0.78 + blendFieldA * 0.62),
      smoothstep(0.22, 0.84, blendFieldB)
    );
    let vibrantBase = mix(backdrop, flatPoster * chromaPalette * 1.42, 0.18);
    let comicColor = mix(
      vibrantBase * (0.34 + halftone * 0.98),
      vibrantBase * (0.84 + halftone * 0.34) + chromaPalette * 0.28,
      0.38 + mergedZones * 0.12
    );
    let ink = max(edgeInk, rimInk * 0.62) * comic;
    let panelFill = mix(backdrop, mix(paletteA, paletteC, 0.5) * 0.9, 0.34 + blendFieldA * 0.18);

    color = mix(panelFill * 1.08, comicColor, 0.54 + comic * 0.14);
    color = mix(color, max(color - vec3f(ink * 0.18), vec3f(0.0)), 0.52);
    color = max(color, panelFill * 0.6);
    alpha = clamp(max(alpha, (0.88 + shadowBands * 0.04) * panelMask) + ink * 0.02, 0.0, 1.0);
  }

  return vec4f(color * alpha, alpha);
}
`;

const bufferUsage = globalThis.GPUBufferUsage;
const textureUsage = globalThis.GPUTextureUsage;

type HeroRectLayerProps = {
  className?: string;
  style?: CSSProperties;
  canvasStyle?: CSSProperties;
  ditherStrength?: number;
  ditherPixelSize?: number;
  comicStrength?: number;
  debugLabel?: string;
  onReady?: () => void;
  onProfileEvent?: (event: {
    debugLabel?: string;
    elapsedMs: number;
    stage: string;
  }) => void;
  interactionMode?: InteractionMode;
  seed?: number;
};

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));
const smoothstep = (edge0: number, edge1: number, value: number) => {
  const t = clamp01((value - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
};

const INTERACTION_PROFILE: Record<
  InteractionMode,
  {
    coherenceTau: number;
    dwellFullMs: number;
    energyTau: number;
    memoryDecayTau: number;
    memoryWriteGain: number;
    presenceTau: number;
    proximityWeight: number;
  }
> = {
  sensor: {
    coherenceTau: 0.45,
    dwellFullMs: 1600,
    energyTau: 0.12,
    memoryDecayTau: 2.8,
    memoryWriteGain: 0.1,
    presenceTau: 0.18,
    proximityWeight: 0.35,
  },
  substrate: {
    coherenceTau: 0.85,
    dwellFullMs: 1800,
    energyTau: 0.18,
    memoryDecayTau: 5.5,
    memoryWriteGain: 0.48,
    presenceTau: 0.24,
    proximityWeight: 0.25,
  },
};

export default function HeroRectLayer({
  className = '',
  style,
  canvasStyle,
  ditherStrength = 0,
  ditherPixelSize = 1,
  comicStrength = 0,
  debugLabel,
  onReady,
  onProfileEvent,
  interactionMode = 'sensor',
  seed = 0,
}: HeroRectLayerProps) {
  const prefersReducedMotion = Boolean(useReducedMotion());
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const readyNotifiedRef = useRef(false);
  const onReadyRef = useRef(onReady);
  const onProfileEventRef = useRef(onProfileEvent);
  const pointerStateRef = useRef({
    coherence: 0,
    energy: 0,
    hoverMs: 0,
    memory: 0,
    memoryUvX: 0.5,
    memoryUvY: 0.5,
    pointerInside: false,
    pointerX: -9999,
    pointerY: -9999,
    presence: 0,
    velocityNorm: 0,
  });

  useEffect(() => {
    onReadyRef.current = onReady;
  }, [onReady]);

  useEffect(() => {
    onProfileEventRef.current = onProfileEvent;
  }, [onProfileEvent]);

  useEffect(() => {
    const startTime = typeof performance !== 'undefined' ? performance.now() : 0;
    const canvas = canvasRef.current;
    const gpu = (navigator as Navigator & {
      gpu?: {
        requestAdapter: () => Promise<GPUAdapterLike | null>;
        getPreferredCanvasFormat: () => string;
      };
    }).gpu;

    const emitProfile = (stage: string) => {
      if (typeof performance === 'undefined') return;
      onProfileEventRef.current?.({
        debugLabel,
        elapsedMs: performance.now() - startTime,
        stage,
      });
    };

    const notifyReady = () => {
      if (readyNotifiedRef.current) return;
      readyNotifiedRef.current = true;
      emitProfile('ready');
      onReadyRef.current?.();
    };

    if (!canvas || !gpu || !bufferUsage || !textureUsage) {
      emitProfile('fallback');
      notifyReady();
      return;
    }

    emitProfile('mount');

    let frameId = 0;
    let disposed = false;
    let isPaused = document.hidden;
    let cleanupEvents = () => {};

    const getDpr = () => Math.min(window.devicePixelRatio || 1, 2);

    const initialize = async () => {
      const adapter = await gpu.requestAdapter();
      emitProfile(adapter ? 'adapter' : 'adapter-missing');
      if (!adapter || disposed) return;

      const device = await adapter.requestDevice();
      emitProfile('device');
      if (disposed) {
        device.destroy?.();
        return;
      }

      const context = canvas.getContext('webgpu') as GPUCanvasContextLike | null;
      if (!context) {
        emitProfile('context-missing');
        device.destroy?.();
        return;
      }
      emitProfile('context');

      const uniformBuffer = device.createBuffer({
        size: 80,
        usage: bufferUsage.UNIFORM | bufferUsage.COPY_DST,
      });
      const format = gpu.getPreferredCanvasFormat();

      const shaderModule = device.createShaderModule({ code: shaderCode });
      const pipeline = device.createRenderPipeline({
        layout: 'auto',
        vertex: {
          module: shaderModule,
          entryPoint: 'vsMain',
        },
        fragment: {
          module: shaderModule,
          entryPoint: 'fsMain',
          targets: [{ format }],
        },
        primitive: {
          topology: 'triangle-list',
        },
      });
      emitProfile('pipeline');

      const bindGroup = device.createBindGroup({
        layout: pipeline.getBindGroupLayout(0),
        entries: [{ binding: 0, resource: { buffer: uniformBuffer } }],
      });
      const interactionProfile = INTERACTION_PROFILE[interactionMode];

      const configure = () => {
        const dpr = getDpr();
        canvas.width = Math.max(1, Math.round(canvas.clientWidth * dpr));
        canvas.height = Math.max(1, Math.round(canvas.clientHeight * dpr));

        context.configure({
          device,
          format,
          alphaMode: 'premultiplied',
          usage: textureUsage.RENDER_ATTACHMENT,
        });
        emitProfile('configure');
      };

      let firstFrameSubmitted = false;
      let lastFrameTime = performance.now();

      const handlePointerMove = (event: PointerEvent) => {
        const pointerState = pointerStateRef.current;
        pointerState.pointerX = event.clientX;
        pointerState.pointerY = event.clientY;
      };

      const handlePointerLeave = () => {
        const pointerState = pointerStateRef.current;
        pointerState.pointerX = -9999;
        pointerState.pointerY = -9999;
        pointerState.pointerInside = false;
      };

      const updateInteractionState = (dt: number) => {
        const pointerState = pointerStateRef.current;
        const container = containerRef.current;
        if (!container) {
          return {
            coherence: 0,
            energy: 0,
            memory: 0,
            memoryUvX: 0.5,
            memoryUvY: 0.5,
            phaseBias: 0,
            pointerInside: 0,
            pointerUvX: 0.5,
            pointerUvY: 0.5,
            presence: 0,
            velocityNorm: 0,
          };
        }

        const rect = container.getBoundingClientRect();
        const width = Math.max(rect.width, 1);
        const height = Math.max(rect.height, 1);
        const diagonal = Math.max(Math.hypot(width, height), 1);
        const relativeX = pointerState.pointerX - rect.left;
        const relativeY = pointerState.pointerY - rect.top;
        const pointerInside =
          relativeX >= 0 &&
          relativeX <= rect.width &&
          relativeY >= 0 &&
          relativeY <= rect.height;

        const distanceX = relativeX < 0 ? -relativeX : relativeX > rect.width ? relativeX - rect.width : 0;
        const distanceY = relativeY < 0 ? -relativeY : relativeY > rect.height ? relativeY - rect.height : 0;
        const distanceToRect = Math.hypot(distanceX, distanceY);
        const proximity = 1 - smoothstep(0, 140, distanceToRect);
        const presenceTarget = pointerInside ? 1 : interactionProfile.proximityWeight * proximity;

        const previousMemoryUvX = pointerState.memoryUvX;
        const previousMemoryUvY = pointerState.memoryUvY;
        const pointerUvX = clamp01(relativeX / width);
        const pointerUvY = 1 - clamp01(relativeY / height);

        if (pointerInside) {
          const deltaMemoryX = pointerUvX - previousMemoryUvX;
          const deltaMemoryY = pointerUvY - previousMemoryUvY;
          const pointerDelta = Math.hypot(deltaMemoryX * width, deltaMemoryY * height);
          const normalizedVelocity = clamp01(pointerDelta / diagonal / Math.max(dt, 1 / 240));
          pointerState.velocityNorm = normalizedVelocity;
          pointerState.hoverMs += dt * 1000;
          pointerState.memoryUvX = pointerUvX;
          pointerState.memoryUvY = pointerUvY;
        } else {
          pointerState.hoverMs = 0;
          pointerState.velocityNorm *= Math.exp(-dt / interactionProfile.energyTau);
        }

        pointerState.pointerInside = pointerInside;
        const dwell = clamp01(pointerState.hoverMs / interactionProfile.dwellFullMs);
        const coherenceTarget = pointerInside ? dwell : 0;
        const energyTarget =
          interactionMode === 'sensor'
            ? presenceTarget * (0.08 + dwell * 0.14) * (0.55 + smoothstep(0.04, 0.28, Math.min(pointerState.velocityNorm, 1.5)) * 0.45)
            : presenceTarget * smoothstep(0.03, 0.34, Math.min(pointerState.velocityNorm, 1.5)) * 0.72;

        pointerState.presence += (presenceTarget - pointerState.presence) * (1 - Math.exp(-dt / interactionProfile.presenceTau));
        pointerState.energy += (energyTarget - pointerState.energy) * (1 - Math.exp(-dt / interactionProfile.energyTau));
        pointerState.coherence += (coherenceTarget - pointerState.coherence) * (1 - Math.exp(-dt / interactionProfile.coherenceTau));

        if (interactionMode === 'substrate' && pointerInside) {
          const write = interactionProfile.memoryWriteGain * dt * (0.25 + 0.75 * pointerState.velocityNorm);
          pointerState.memory = Math.min(1, pointerState.memory + write);
        }
        pointerState.memory *= Math.exp(-dt / interactionProfile.memoryDecayTau);

        return {
          coherence: pointerState.coherence,
          energy: pointerState.energy,
          memory: pointerState.memory,
          memoryUvX: pointerState.memoryUvX,
          memoryUvY: pointerState.memoryUvY,
          phaseBias:
            pointerState.presence * (interactionMode === 'sensor' ? 0.42 : 0.24) +
            pointerState.memory * (interactionMode === 'sensor' ? 0.08 : 0.36),
          pointerInside: pointerInside ? 1 : 0,
          pointerUvX,
          pointerUvY,
          presence: pointerState.presence,
          velocityNorm: pointerState.velocityNorm,
        };
      };

      const render = () => {
        if (disposed || isPaused) return;
        const now = performance.now();
        const dt = Math.min((now - lastFrameTime) / 1000, 0.1);
        lastFrameTime = now;
        const interaction = updateInteractionState(dt);

        const data = new Float32Array([
          canvas.width,
          canvas.height,
          now / 1000,
          seed,
          prefersReducedMotion ? 0.18 : 1,
          ditherStrength,
          ditherPixelSize,
          comicStrength,
          interaction.pointerUvX,
          interaction.pointerUvY,
          interaction.presence,
          interaction.energy,
          interaction.coherence,
          interaction.memory,
          interaction.phaseBias,
          interactionMode === 'substrate' ? 1 : 0,
          interaction.memoryUvX,
          interaction.memoryUvY,
          interaction.velocityNorm,
          interaction.pointerInside,
        ]);
        device.queue.writeBuffer(uniformBuffer, 0, data);

        const encoder = device.createCommandEncoder();
        const pass = encoder.beginRenderPass({
          colorAttachments: [
            {
              view: context.getCurrentTexture().createView(),
              clearValue: { r: 0, g: 0, b: 0, a: 0 },
              loadOp: 'clear',
              storeOp: 'store',
            },
          ],
        });

        pass.setPipeline(pipeline);
        pass.setBindGroup(0, bindGroup);
        pass.draw(3);
        pass.end();

        device.queue.submit([encoder.finish()]);
        if (!firstFrameSubmitted) {
          firstFrameSubmitted = true;
          emitProfile('first-frame');
        }
        notifyReady();
        frameId = window.requestAnimationFrame(render);
      };

      const clear = () => {
        const encoder = device.createCommandEncoder();
        const pass = encoder.beginRenderPass({
          colorAttachments: [
            {
              view: context.getCurrentTexture().createView(),
              clearValue: { r: 0, g: 0, b: 0, a: 0 },
              loadOp: 'clear',
              storeOp: 'store',
            },
          ],
        });
        pass.end();
        device.queue.submit([encoder.finish()]);
      };

      const handleResize = () => configure();
      const handleVisibilityChange = () => {
        isPaused = document.hidden;
        window.cancelAnimationFrame(frameId);

        if (isPaused) {
          clear();
          return;
        }

        frameId = window.requestAnimationFrame(render);
      };

      configure();

      if (!isPaused) {
        frameId = window.requestAnimationFrame(render);
      } else {
        clear();
        notifyReady();
      }

      window.addEventListener('resize', handleResize);
      window.addEventListener('pointermove', handlePointerMove, { passive: true });
      window.addEventListener('pointerleave', handlePointerLeave);
      document.addEventListener('visibilitychange', handleVisibilityChange);

      cleanupEvents = () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerleave', handlePointerLeave);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };

      void device.lost?.then(() => {
        emitProfile('device-lost');
        disposed = true;
        window.cancelAnimationFrame(frameId);
      });

      return () => {
        window.cancelAnimationFrame(frameId);
        cleanupEvents();
        context.unconfigure?.();
        device.destroy?.();
      };
    };

    let cleanupRenderer: (() => void) | undefined;
    void initialize().then((dispose) => {
      cleanupRenderer = dispose;
    });

    return () => {
      disposed = true;
      window.cancelAnimationFrame(frameId);
      cleanupEvents();
      cleanupRenderer?.();
    };
  }, [comicStrength, debugLabel, ditherPixelSize, ditherStrength, interactionMode, prefersReducedMotion, seed]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`pointer-events-none relative hidden h-[clamp(9.5rem,19svh,13rem)] w-[min(46rem,52vw)] min-w-[36rem] md:block lg:w-[min(50rem,48vw)] ${className}`}
      style={style}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
        style={canvasStyle}
      />
    </div>
  );
}
