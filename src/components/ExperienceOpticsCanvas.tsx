import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'motion/react';

const vertexShaderSource = `
attribute vec2 aPosition;
varying vec2 vUv;

void main() {
  vUv = aPosition * 0.5 + 0.5;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

const fragmentShaderSource = `
precision mediump float;

varying vec2 vUv;
uniform vec2 uResolution;
uniform float uTime;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;

  for (int i = 0; i < 5; i++) {
    value += noise(p) * amplitude;
    p = mat2(1.7, -1.2, 1.2, 1.7) * p;
    amplitude *= 0.55;
  }

  return value;
}

vec3 spectrum(float t) {
  vec3 a = vec3(0.29, 0.44, 0.58);
  vec3 b = vec3(0.52, 0.24, 0.28);
  vec3 c = vec3(0.82, 0.74, 0.46);
  vec3 d = vec3(0.0, 0.16, 0.28);
  return a + b * cos(6.28318 * (c * t + d));
}

float strand(vec2 p, float yOffset, float amplitude, float frequency, float phase, float thickness) {
  float wave = sin(p.x * frequency + phase) * amplitude;
  wave += sin(p.x * (frequency * 0.52) - phase * 1.3) * amplitude * 0.55;
  wave += sin(p.x * (frequency * 0.23) + phase * 0.7) * amplitude * 0.85;
  float distanceToWave = abs(p.y - yOffset - wave);
  return exp(-distanceToWave * distanceToWave / thickness);
}

float ribbonBand(float distanceToWave, float width, float softness) {
  return smoothstep(width + softness, width, abs(distanceToWave));
}

void main() {
  vec2 uv = vUv;
  vec2 p = uv - 0.5;
  p.x *= uResolution.x / max(uResolution.y, 1.0);

  float time = uTime * 0.00034;
  float leftBias = mix(1.18, 0.7, smoothstep(0.0, 1.0, uv.x));
  float verticalFade = smoothstep(0.0, 0.12, uv.y) * (1.0 - smoothstep(0.84, 0.985, uv.y));
  float horizontalFade = smoothstep(0.0, 0.02, uv.x) * (1.0 - smoothstep(0.985, 1.0, uv.x));
  float fade = verticalFade * horizontalFade;

  float waveA = sin(p.x * 1.08 + time * 1.12) * 0.082 + sin(p.x * 0.44 - time * 0.54 + 1.4) * 0.024 - 0.038;
  float waveB = sin(p.x * 0.88 + time * 0.9 + 1.2) * 0.104 + sin(p.x * 0.32 - time * 0.42 + 2.7) * 0.03 + 0.098;
  float waveC = sin(p.x * 0.7 + time * 0.66 + 2.3) * 0.14 + sin(p.x * 0.26 - time * 0.36 + 0.5) * 0.036 - 0.182;
  float filament = sin(p.x * 1.92 + time * 1.58 + 0.7) * 0.054 + sin(p.x * 0.82 - time * 0.88 + 2.2) * 0.014 + 0.176;

  float dA = p.y - waveA;
  float dB = p.y - waveB;
  float dC = p.y - waveC;
  float dD = p.y - filament;

  float haloA = ribbonBand(dA, 0.032, 0.026);
  float haloB = ribbonBand(dB, 0.04, 0.032);
  float haloC = ribbonBand(dC, 0.052, 0.038);
  float haloD = ribbonBand(dD, 0.013, 0.012);

  float edgeA = ribbonBand(dA, 0.014, 0.01);
  float edgeB = ribbonBand(dB, 0.018, 0.012);
  float edgeC = ribbonBand(dC, 0.022, 0.016);
  float edgeD = ribbonBand(dD, 0.005, 0.004);

  float coreA = ribbonBand(dA, 0.0032, 0.0022);
  float coreB = ribbonBand(dB, 0.0044, 0.0028);
  float coreC = ribbonBand(dC, 0.0068, 0.0042);
  float coreD = ribbonBand(dD, 0.0017, 0.0012);

  float pulseA = 0.7 + 0.3 * sin(p.x * 2.1 - time * 1.4 + 0.6);
  float pulseB = 0.72 + 0.28 * sin(p.x * 1.6 - time * 1.1 + 2.0);
  float pulseC = 0.74 + 0.26 * sin(p.x * 1.2 - time * 0.92 + 1.2);

  vec3 color = vec3(0.0);
  color += vec3(0.56, 0.78, 1.0) * haloA * 0.22 * pulseA;
  color += vec3(0.62, 0.86, 1.0) * haloB * 0.24 * pulseB;
  color += vec3(0.7, 0.88, 1.0) * haloC * 0.18 * pulseC;
  color += vec3(0.88, 0.96, 1.0) * haloD * 0.2;
  color += vec3(0.84, 0.94, 1.0) * edgeA * 0.4;
  color += vec3(0.9, 0.97, 1.0) * edgeB * 0.42;
  color += vec3(0.92, 0.98, 1.0) * edgeC * 0.28;
  color += vec3(1.0) * edgeD * 0.46;
  color += vec3(1.0) * coreA * 1.18;
  color += vec3(1.0) * coreB * 1.22;
  color += vec3(1.0) * coreC * 0.92;
  color += vec3(1.0) * coreD * 0.96;

  color *= leftBias * fade;
  float alpha = clamp(
    haloA * 0.05 +
    haloB * 0.06 +
    haloC * 0.05 +
    haloD * 0.04 +
    edgeA * 0.05 +
    edgeB * 0.06 +
    edgeC * 0.04 +
    edgeD * 0.05 +
    coreA * 0.1 +
    coreB * 0.11 +
    coreC * 0.08 +
    coreD * 0.09,
    0.0,
    0.24
  );
  alpha *= leftBias * fade;
  vec3 premultiplied = color * alpha;

  gl_FragColor = vec4(premultiplied, alpha);
}
`;

function createShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);

  if (!shader) {
    return null;
  }

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

function createProgram(gl: WebGLRenderingContext) {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

  if (!vertexShader || !fragmentShader) {
    return null;
  }

  const program = gl.createProgram();

  if (!program) {
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    return null;
  }

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    return null;
  }

  return program;
}

export default function ExperienceOpticsCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = Boolean(useReducedMotion());

  useEffect(() => {
    if (reducedMotion) {
      return undefined;
    }

    const canvas = canvasRef.current;

    if (!canvas) {
      return undefined;
    }

    const gl = canvas.getContext('webgl', {
      alpha: true,
      antialias: true,
      depth: false,
      stencil: false,
      premultipliedAlpha: true,
    });

    if (!gl) {
      return undefined;
    }

    const program = createProgram(gl);

    if (!program) {
      return undefined;
    }

    const positionLocation = gl.getAttribLocation(program, 'aPosition');
    const timeLocation = gl.getUniformLocation(program, 'uTime');
    const resolutionLocation = gl.getUniformLocation(program, 'uResolution');
    const buffer = gl.createBuffer();

    if (!buffer || !timeLocation || !resolutionLocation) {
      gl.deleteProgram(program);
      if (buffer) {
        gl.deleteBuffer(buffer);
      }
      return undefined;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW
    );

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    resize();

    let frameId = 0;

    const render = (time: number) => {
      gl.useProgram(program);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.enableVertexAttribArray(positionLocation);
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

      gl.uniform1f(timeLocation, time);
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);

      gl.drawArrays(gl.TRIANGLES, 0, 3);
      frameId = requestAnimationFrame(render);
    };

    frameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    };
  }, [reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="experience-optics-canvas"
    />
  );
}
