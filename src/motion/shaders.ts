export const fullscreenVertex = `#version 300 es
precision highp float;
out vec2 vUv;
void main() {
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  vUv = p;
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`;

const mediaUniforms = `
uniform float uWeights[7];
uniform sampler2D uOcean, uFlame, uLight, uGeo, uScenes, uForest;
uniform vec2 uOceanSize, uFlameSize, uLightSize, uGeoSize, uScenesSize, uForestSize;
vec2 cover(vec2 uv, vec2 size) {
  float screenAspect = uResolution.x / uResolution.y;
  float mediaAspect = size.x / max(size.y, 1.0);
  return (uv - 0.5) * vec2(min(1.0, screenAspect / mediaAspect), min(1.0, mediaAspect / screenAspect)) + 0.5;
}
vec3 capturedColor(vec2 uv) {
  return texture(uOcean, cover(uv, uOceanSize)).rgb * uWeights[0]
    + texture(uFlame, cover(uv, uFlameSize)).rgb * uWeights[1]
    + texture(uLight, cover(uv, uLightSize)).rgb * uWeights[2]
    + texture(uGeo, cover(uv, uGeoSize)).rgb * uWeights[3]
    + texture(uScenes, cover(uv, uScenesSize)).rgb * uWeights[4]
    + texture(uForest, cover(uv, uForestSize)).rgb * uWeights[5];
}
float strongest() {
  float result = 0.0;
  for (int i = 0; i < 7; i++) result = max(result, uWeights[i]);
  return result;
}`;

export const fieldFragment = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 outColor;
uniform vec2 uResolution, uPointer;
uniform float uTime, uVelocity, uRoute, uFramed;
${mediaUniforms}
void main() {
  vec2 uv = vUv;
  float travel = abs(uVelocity) * 0.004 + uRoute * 0.065;
  uv.x += sin(uv.y * 11.0 + uTime * 0.4) * travel;
  uv.y += sin(uv.x * 8.0 - uTime * 0.3) * travel * 0.3;
  vec3 base = mix(vec3(0.018, 0.026, 0.034), capturedColor(uv), smoothstep(0.42, 0.96, strongest()) * (1.0 - uRoute * 0.8));
  float sideShade = (1.0 - smoothstep(0.15, 0.82, vUv.x)) * 0.68;
  float bottomShade = (1.0 - smoothstep(0.0, 0.62, vUv.y)) * 0.88;
  float topShade = smoothstep(0.82, 1.0, vUv.y) * 0.6;
  base *= (1.0 - max(max(sideShade, bottomShade), topShade)) * mix(1.0, 0.1, uFramed);
  outColor = vec4(base, 1.0);
}`;

/** Point identities and source pixels persist through scroll and route travel. */
export const particleVertex = `#version 300 es
precision highp float;
uniform vec2 uResolution, uPointer;
uniform float uTime, uVelocity, uRoute, uPixelRatio;
${mediaUniforms}
out vec4 vColor;
float hash(float v) { return fract(sin(v * 127.1 + 311.7) * 43758.5453); }
void main() {
  float id = float(gl_VertexID);
  float r1 = hash(id), r2 = hash(id + 14.0), r3 = hash(id + 53.0);
  vec2 uv = vec2(mod(id, 256.0) / 255.0, floor(id / 256.0) / 127.0);
  float transition = clamp((1.0 - strongest()) * 3.0 + uRoute, 0.0, 1.0);
  vec2 position = uv * 2.0 - 1.0;
  float phase = uTime * 0.4 + uWeights[1] * 2.0 + uWeights[3] * 4.0 + uWeights[4] * 6.0;
  position += vec2(sin(uv.y * 8.0 + phase), cos(uv.x * 7.0 - phase)) * transition * 0.22;
  position += vec2(sin(r1 * 22.0 + uTime), cos(r2 * 23.0 + uTime)) * (uRoute * 0.6 + abs(uVelocity) * 0.016);
  position += uPointer * transition * 0.018;
  // A small abstract lattice supports the production section; it is not a project capture.
  vec2 lattice = vec2(r1, r2) * 1.4 - 0.7;
  if (mod(id, 2.0) < 1.0) lattice.x = sign(lattice.x) * 0.7;
  else lattice.y = sign(lattice.y) * 0.7;
  position = mix(position, lattice, uWeights[6]);
  vec3 color = capturedColor(uv) + vec3(0.5, 0.65, 0.72) * uWeights[6];
  vColor = vec4(color, (transition * 0.85 + uWeights[6] * 0.3) * (0.25 + r3 * 0.5));
  gl_Position = vec4(position, 0.0, 1.0);
  gl_PointSize = clamp((1.4 + r2) * uPixelRatio, 1.0, 3.0);
}`;

export const particleFragment = `#version 300 es
precision highp float;
in vec4 vColor;
out vec4 outColor;
void main() {
  float r = length(gl_PointCoord - 0.5) * 2.0;
  outColor = vec4(vColor.rgb, vColor.a * (1.0 - smoothstep(0.3, 1.0, r)));
}`;

export const typeVertex = `#version 300 es
precision highp float;
uniform vec4 uRect;
uniform vec2 uScreen;
out vec2 vUv;
void main() {
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  vUv = p;
  vec2 pixel = uRect.xy + p * uRect.zw;
  gl_Position = vec4(pixel.x / uScreen.x * 2.0 - 1.0, 1.0 - pixel.y / uScreen.y * 2.0, 0.0, 1.0);
}`;

export const typeFragment = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 outColor;
uniform sampler2D uText;
uniform float uTime, uVelocity, uRoute;
uniform vec2 uPointer;
void main() {
  vec2 uv = vUv;
  float envelope = sin(clamp(uv.y, 0.0, 1.0) * 3.14159265);
  uv.x += sin(uv.y * 7.0 + uTime * 0.5) * envelope * (uVelocity * 0.003 + uRoute * 0.085);
  uv.y += sin(uv.x * 5.0 + uTime * 0.4) * uRoute * 0.025;
  uv.x += uPointer.x * envelope * 0.0008;
  outColor = texture(uText, uv);
}`;
