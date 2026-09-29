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
uniform vec2 uResolution;
uniform vec2 uPointer;
uniform float uTime;
uniform float uVelocity;
uniform float uRoute;
uniform float uWater;
uniform float uFire;
uniform float uAmber;
uniform float uGeometry;
uniform float uSystems;
uniform float uQuality;

mat2 rot(float a) { return mat2(cos(a), -sin(a), sin(a), cos(a)); }
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float torus(vec3 p, vec2 t) { return length(vec2(length(p.xy) - t.x, p.z)) - t.y; }
float octahedron(vec3 p, float s) { p = abs(p); return (p.x + p.y + p.z - s) * 0.57735027; }
float box(vec3 p, vec3 b) { vec3 q = abs(p) - b; return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0); }
float smin(float a, float b, float k) { float h = max(k - abs(a - b), 0.0) / k; return min(a, b) - h * h * k * 0.25; }

float field(vec3 p) {
  float t = uTime * 0.18;
  p.xy *= rot(-0.38 + 0.14 * sin(t));
  p.xz *= rot(0.44 + uPointer.x * 0.13 + t * 0.12);
  p.yz *= rot(-0.3 + uPointer.y * 0.12);
  p.x += sin(p.y * 2.2) * uVelocity * 0.055;
  float angle = atan(p.y, p.x);
  vec3 liquid = p;
  liquid.z += 0.15 * sin(angle * 3.0 + t * 2.0) + 0.11 * sin(liquid.x * 3.0 - t);
  float ridge = 0.045 * sin(angle * 27.0 + liquid.z * 11.0 + t * 3.0);
  float water = torus(liquid, vec2(1.02, 0.34 + ridge));
  water = smin(water, length(liquid - vec3(-0.91, -0.32, 0.13)) - 0.44, 0.4);
  vec3 f = p;
  f.x += sin(f.y * 2.4 - t * 3.8) * 0.2;
  f.z += cos(f.y * 2.2 - t * 3.1) * 0.17;
  float taper = max(0.15, 0.72 - (f.y + 0.7) * 0.24);
  float flame = length(vec3(f.x, f.y * 0.51, f.z)) - taper;
  flame += sin(f.y * 12.0 - t * 11.0 + atan(f.z, f.x) * 3.0) * 0.065;
  vec3 a = p;
  a.xz *= rot(t * 0.6);
  float crystal = smin(octahedron(a, 1.64), length(a) - 1.12, 0.09);
  crystal += sin(a.x * 15.0 + a.y * 7.0 + a.z * 9.0) * 0.015;
  vec3 g = p;
  g.yz *= rot(0.45);
  float geometry = torus(g, vec2(0.95, 0.09));
  geometry = min(geometry, torus(g.yzx, vec2(0.95, 0.09)));
  geometry = min(geometry, torus(g.zxy, vec2(0.95, 0.09)));
  geometry = smin(geometry, octahedron(g, 0.46), 0.1);
  vec3 c = p;
  c.xy *= rot(0.35);
  float systems = box(c, vec3(0.88, 0.88, 0.88));
  vec3 grid = abs(mod(c + 0.22, 0.44) - 0.22);
  systems = max(systems, -(min(min(max(grid.x, grid.y), max(grid.y, grid.z)), max(grid.z, grid.x)) - 0.045));
  float d = water * uWater + flame * uFire + crystal * uAmber + geometry * uGeometry + systems * uSystems;
  d += sin(p.y * 6.0 + p.x * 3.0 - t * 4.0) * uRoute * 0.18;
  return d;
}

vec3 normal(vec3 p) {
  vec2 e = vec2(0.0018, 0.0);
  return normalize(vec3(field(p + e.xyy) - field(p - e.xyy), field(p + e.yxy) - field(p - e.yxy), field(p + e.yyx) - field(p - e.yyx)));
}
vec3 environment(vec3 d) {
  vec3 color = vec3(0.055, 0.075, 0.09);
  float top = pow(max(0.0, dot(d, normalize(vec3(-0.3, 0.7, 0.4)))), 6.0);
  float strip = pow(max(0.0, 1.0 - abs(d.x * 0.45 + d.y - 0.4)), 34.0);
  float rim = pow(max(0.0, dot(d, normalize(vec3(1.0, -0.3, 0.4)))), 10.0);
  color += vec3(0.57, 0.82, 1.0) * top * 1.1;
  color += vec3(0.91, 0.98, 1.0) * strip * 1.2;
  color += vec3(1.0, 0.4, 0.13) * rim * 1.2;
  return color;
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution) / uResolution.y;
  float wide = smoothstep(0.8, 1.6, uResolution.x / uResolution.y);
  uv.x -= mix(0.19, 0.34, wide);
  uv.y += 0.02;
  uv += uPointer * 0.018;
  float scale = mix(0.62, 1.0, wide);
  vec3 ro = vec3(0.0, 0.0, 5.2 / scale);
  vec3 rd = normalize(vec3(uv * 2.0, -3.0));
  vec3 color = vec3(0.026, 0.035, 0.043);
  float halo = exp(-length(uv - vec2(0.05, 0.0)) * 3.4);
  vec3 tint = vec3(0.12, 0.25, 0.31) * uWater + vec3(0.4, 0.11, 0.015) * uFire + vec3(0.36, 0.19, 0.025) * uAmber + vec3(0.13, 0.19, 0.28) * uGeometry + vec3(0.13, 0.22, 0.16) * uSystems;
  color += tint * halo * 0.15;
  float distance = 0.0;
  bool hit = false;
  for (int i = 0; i < 72; i++) {
    if (float(i) > mix(43.0, 70.0, uQuality)) break;
    vec3 p = ro + rd * distance;
    float d = field(p);
    if (d < 0.0024) { hit = true; break; }
    distance += max(d * 0.68, 0.004);
    if (distance > 9.0) break;
  }
  if (hit) {
    vec3 p = ro + rd * distance;
    vec3 n = normal(p);
    vec3 view = -rd;
    float fresnel = 0.06 + 0.94 * pow(1.0 - max(dot(n, view), 0.0), 4.0);
    vec3 light = normalize(vec3(-2.0, 3.0, 4.0));
    float diffuse = max(dot(n, light), 0.0);
    vec3 reflected = environment(reflect(rd, n));
    float occlusion = clamp(field(p + n * 0.13) / 0.13, 0.3, 1.0);
    vec3 base = vec3(0.065, 0.18, 0.23) * uWater + vec3(0.46, 0.045, 0.003) * uFire + vec3(0.46, 0.19, 0.03) * uAmber + vec3(0.22, 0.27, 0.3) * uGeometry + vec3(0.12, 0.26, 0.18) * uSystems;
    color = base * (0.15 + diffuse * 0.7) * occlusion;
    color += reflected * mix(0.75, 1.05, fresnel) * (1.0 - uFire * 0.65);
    float spec = pow(max(dot(n, normalize(light + view)), 0.0), 65.0);
    color += vec3(1.0, 0.95, 0.83) * spec * 1.8;
    float internal = pow(max(dot(-n, light), 0.0), 1.4);
    color += vec3(0.9, 0.35, 0.055) * internal * uAmber * 0.85;
    float heat = 0.5 + 0.5 * sin(p.y * 9.0 - uTime * 1.7 + p.x * 5.0);
    color += vec3(1.4, 0.3 + heat * 0.45, 0.014) * (0.2 + heat * 0.8) * uFire;
    float contour = pow(0.5 + 0.5 * sin(p.y * 75.0 + p.x * 11.0 + uTime * 0.3), 12.0);
    color += vec3(0.13, 0.36, 0.44) * contour * uWater * 0.15;
    color *= mix(0.75, 1.0, occlusion);
  }
  // The spatial field survives route changes: flow bends the same world, never a cut.
  vec2 gridUV = uv * 28.0 + vec2(uTime * 0.035, -uTime * 0.03);
  float gridPoint = (1.0 - smoothstep(0.025, 0.06, length(fract(gridUV) - 0.5)));
  color += gridPoint * 0.035 * (1.0 - float(hit));
  color += (hash(gl_FragCoord.xy) - 0.5) / 255.0;
  color *= 1.0 - 0.21 * smoothstep(0.3, 1.0, length(uv));
  color = color / (1.0 + color * 0.34);
  color = pow(max(color, vec3(0.0)), vec3(0.85));
  float textProtection = (1.0 - smoothstep(0.2, 0.83, vUv.x)) * (1.0 - wide);
  color *= 1.0 - textProtection * 0.6;
  color *= 1.0 - smoothstep(0.76, 1.0, vUv.y) * 0.45;
  outColor = vec4(color, 1.0);
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
uniform float uTime;
uniform float uVelocity;
uniform float uRoute;
uniform vec2 uPointer;
void main() {
  vec2 uv = vUv;
  float envelope = sin(clamp(uv.y, 0.0, 1.0) * 3.14159265);
  uv.x += sin(uv.y * 7.0 + uTime * 0.5) * envelope * (uVelocity * 0.008 + uRoute * 0.055);
  uv.y += sin(uv.x * 5.0 + uTime * 0.4) * uRoute * 0.018;
  uv.x += uPointer.x * envelope * 0.0015;
  float alpha = texture(uText, uv).a;
  float bevel = texture(uText, uv + vec2(0.0007, -0.001)).a - alpha;
  vec3 ink = vec3(0.94, 0.95, 0.91) + bevel * vec3(0.11, 0.16, 0.18);
  outColor = vec4(ink, alpha);
}`;
