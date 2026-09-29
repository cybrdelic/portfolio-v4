export const fullscreenVertex = `#version 300 es
precision highp float;
out vec2 vUv;
void main() {
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  vUv = p;
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`;

export const fieldFragment = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 outColor;
uniform vec2 uResolution, uPointer;
uniform float uTime, uVelocity, uRoute;
uniform float uWater, uFire, uAmber, uGeometry, uSystems;
uniform sampler2D uOcean, uFlame;
uniform vec2 uOceanSize, uFlameSize;

vec2 cover(vec2 uv, vec2 size) {
  float screenAspect = uResolution.x / uResolution.y;
  float mediaAspect = size.x / max(size.y, 1.0);
  vec2 scale = vec2(min(1.0, screenAspect / mediaAspect), min(1.0, mediaAspect / screenAspect));
  return (uv - 0.5) * scale + 0.5;
}
float specimen(vec3 p) {
  vec3 q = p / vec3(1.0, 1.1, 0.5);
  vec3 n = normalize(q);
  float radius = 1.2 + sin(n.x * 3.0) * cos(n.y * 3.0) * sin(n.z * 3.0) * 0.15;
  radius += sin(n.x * 8.0) * cos(n.y * 7.0) * sin(n.z * 9.0) * 0.03;
  return (length(q) - radius) * 0.5;
}
mat2 rot(float a) { return mat2(cos(a), -sin(a), sin(a), cos(a)); }
void main() {
  vec2 uv = vUv;
  float travel = abs(uVelocity) * 0.004 + uRoute * 0.065;
  uv.x += sin(uv.y * 11.0 + uTime * 0.4) * travel;
  uv.y += sin(uv.x * 8.0 - uTime * 0.3) * travel * 0.3;
  vec3 base = vec3(0.018, 0.026, 0.034);
  float ocean = smoothstep(0.48, 0.99, uWater) * (1.0 - uRoute * 0.85);
  float flame = smoothstep(0.48, 0.99, uFire) * (1.0 - uRoute * 0.85);
  vec3 waterColor = texture(uOcean, cover(uv, uOceanSize)).rgb;
  vec3 fireColor = texture(uFlame, cover(uv, uFlameSize)).rgb;
  base = mix(base, waterColor * 0.83, ocean);
  base = mix(base, fireColor * 1.1, flame);
  if (uAmber > 0.01) {
    float wide = smoothstep(0.8, 1.5, uResolution.x / uResolution.y);
    vec2 p = (vUv - vec2(0.5, mix(0.75, 0.5, wide))) * vec2(uResolution.x / uResolution.y, 1.0);
    p.x -= wide * 0.17;
    p *= mix(2.5, 1.0, wide);
    vec3 ro = vec3(0.0, 0.0, 4.5);
    vec3 rd = normalize(vec3(p * 2.1, -2.7));
    float t = 0.0;
    vec3 q = vec3(0.0);
    for (int i = 0; i < 42; i++) {
      q = ro + rd * t;
      q.xz *= rot(uTime * 0.1 + uPointer.x * 0.2);
      float d = specimen(q);
      if (d < 0.003 || t > 7.0) break;
      t += max(d, 0.004);
    }
    if (t < 7.0) {
      vec2 e = vec2(0.003, 0.0);
      vec3 n = normalize(vec3(specimen(q + e.xyy) - specimen(q - e.xyy), specimen(q + e.yxy) - specimen(q - e.yxy), specimen(q + e.yyx) - specimen(q - e.yyx)));
      float facing = max(dot(n, -rd), 0.0);
      float rim = pow(1.0 - facing, 4.0);
      float depth = sqrt(max(0.0, 1.0 - pow(length(q.xy) / 1.25, 2.0)));
      vec3 transmission = exp(-vec3(0.32, 1.6, 4.1) * depth * 1.4);
      vec3 amber = transmission * (0.7 + max(n.y, 0.0) * 0.28) + vec3(0.7, 0.18, 0.012) * 0.12;
      // A dark inclusion and small air pockets break up the transmitted volume.
      vec2 body = q.xy; body *= rot(0.35);
      float insect = 1.0 - smoothstep(0.9, 1.1, length(body / vec2(0.07, 0.25)));
      vec2 wingA = body - vec2(0.11, 0.05); wingA *= rot(-0.55);
      vec2 wingB = body - vec2(-0.11, 0.05); wingB *= rot(0.55);
      insect = max(insect, (1.0 - smoothstep(0.9, 1.1, length(wingA / vec2(0.09, 0.19)))) * 0.55);
      insect = max(insect, (1.0 - smoothstep(0.9, 1.1, length(wingB / vec2(0.09, 0.19)))) * 0.55);
      amber *= 1.0 - insect * depth * 0.94;
      vec2 cell = fract(q.xy * 19.0) - 0.5;
      float pocket = 1.0 - smoothstep(0.05, 0.085, length(cell));
      amber += pocket * depth * vec3(0.1, 0.06, 0.02);
      amber += rim * vec3(0.36, 0.3, 0.2);
      float spec = pow(max(dot(n, normalize(vec3(-0.4, 0.8, 1.0))), 0.0), 50.0);
      amber += spec * 2.0;
      base = mix(base, amber, uAmber * (1.0 - uRoute * 0.8));
    }
  }
  float sideShade = (1.0 - smoothstep(0.25, 0.8, vUv.x)) * 0.7;
  float edgeShade = (1.0 - smoothstep(0.0, 0.38, vUv.y)) * 0.75;
  float topShade = smoothstep(0.83, 1.0, vUv.y) * 0.52;
  base *= 1.0 - max(max(sideShade, edgeShade), topShade);
  outColor = vec4(base, 1.0);
}`;

/** Every point retains its identity through each project and every route. */
export const particleVertex = `#version 300 es
precision highp float;
layout(location=0) in vec3 aTube;
uniform vec2 uResolution, uPointer;
uniform float uTime, uVelocity, uRoute, uWater, uFire, uAmber, uGeometry, uSystems, uFrame, uPixelRatio;
out vec4 vColor;
float hash(float v) { return fract(sin(v * 127.1 + 311.7) * 43758.5453); }
mat2 rot(float a) { return mat2(cos(a), -sin(a), sin(a), cos(a)); }
vec3 project(vec3 p) {
  float mobile = 1.0 - smoothstep(0.75, 1.1, uResolution.x / uResolution.y);
  p *= mix(1.0, 0.44, mobile);
  p.xz *= rot(uTime * 0.07 + uPointer.x * 0.22);
  p.yz *= rot(-0.12 + uPointer.y * 0.06);
  float z = 5.5 - p.z;
  float aspect = uResolution.x / uResolution.y;
  return vec3(p.x * 2.25 / z / aspect + (aspect > 1.0 ? 0.26 : 0.0), p.y * 2.25 / z + mix(0.1, 0.4, mobile), z);
}
void main() {
  float id = float(gl_VertexID);
  float r1 = hash(id), r2 = hash(id + 14.0), r3 = hash(id + 53.0);
  vec2 grid = vec2(mod(id, 256.0) / 255.0, floor(id / 256.0) / 127.0);
  vec3 water = vec3(grid * 2.0 - 1.0, 1.0);
  water.y += sin(grid.x * 21.0 + uTime * 0.7) * 0.016 * (1.0 - grid.y);
  float h = r1 * 3.8 - 1.8;
  float angle = r2 * 6.2831853 + h * 2.5 - uTime * 0.7;
  float radius = sqrt(r3) * (0.35 + pow((h + 1.8) / 3.8, 2.0) * 0.6);
  vec3 fire = project(vec3(cos(angle) * radius, h, sin(angle) * radius));
  float phi = acos(r1 * 2.0 - 1.0), theta = r2 * 6.2831853;
  vec3 amber = project(vec3(sin(phi) * cos(theta), cos(phi) * 1.1, sin(phi) * sin(theta) * 0.5) * 1.2);
  float branch = floor(r1 * 8.0);
  float a = floor(branch / 2.0) * 1.5707963 + 0.7853982;
  vec3 frame;
  if (mod(branch, 2.0) < 0.5) frame = vec3(cos(a) * r2 * 1.55, (r3 - 0.5) * 0.035, sin(a) * r2 * 1.55);
  else frame = vec3(cos(a) * 1.55 + cos(r2 * 6.2831853 + uTime * 0.8) * 0.56, 0.0, sin(a) * 1.55 + sin(r2 * 6.2831853 + uTime * 0.8) * 0.56);
  frame.yz *= rot(0.7);
  vec3 geometry = project(mix(aTube, frame, uFrame));
  vec3 system = vec3(r1 * 2.0 - 1.0, r2 * 2.0 - 1.0, r3 * 2.0 - 1.0);
  float edge = mod(id, 3.0);
  if (edge < 1.0) system.xy = sign(system.xy);
  else if (edge < 2.0) system.yz = sign(system.yz);
  else system.xz = sign(system.xz);
  system = project(system * 1.2);
  vec3 position = water * uWater + fire * uFire + amber * uAmber + geometry * uGeometry + system * uSystems;
  float spread = uRoute * 0.6 + abs(uVelocity) * 0.018;
  position.xy += vec2(sin(r1 * 22.0 + uTime), cos(r2 * 23.0 + uTime)) * spread;
  float maxWeight = max(max(max(uWater, uFire), max(uAmber, uGeometry)), uSystems);
  float transition = (1.0 - maxWeight) * 2.7 + uRoute;
  float opacity = clamp(transition, 0.0, 1.0) * (uWater + uFire + uAmber) + uGeometry * 0.72 + uSystems * 0.45;
  vec3 cold = vec3(0.4, 0.73, 0.86);
  vec3 hot = mix(vec3(1.0, 0.12, 0.005), vec3(1.0, 0.83, 0.31), r3);
  vec3 color = cold * uWater + hot * uFire + vec3(1.0, 0.56, 0.12) * uAmber + vec3(0.65, 0.9, 0.91) * uGeometry + vec3(0.55, 0.68, 0.79) * uSystems;
  vColor = vec4(color, opacity * (0.25 + r3 * 0.5));
  gl_Position = vec4(position.xy, 0.0, 1.0);
  gl_PointSize = clamp((1.25 + r2) * uPixelRatio, 1.0, 3.0);
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
