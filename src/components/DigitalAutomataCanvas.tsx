import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'motion/react';

// ─── Simulation constants ────────────────────────────────────────────────────

const NUM_SPECIES = 5;
const N_PER = 100; // particles per species
const N = NUM_SPECIES * N_PER; // 500 total
const TRAIL = 14; // trail length

// Asymmetric force matrix — forces[i][j] = how much species i is pulled toward species j
// Tuned for cyclic predator/prey dynamics → creates orbiting, spiralling, emergent clusters
const FORCES = [
  [ 0.6,  0.8, -0.4,  0.1,  0.3],
  [-0.3,  0.5,  0.9, -0.5,  0.2],
  [ 0.1, -0.4,  0.4,  0.8, -0.3],
  [ 0.3,  0.2, -0.6,  0.3,  0.9],
  [ 0.8, -0.3,  0.2, -0.5,  0.4],
];

const R_MIN = 0.024; // hard repulsion radius (fraction of min canvas dim)
const R_MAX = 0.09;  // interaction radius (fraction of min canvas dim)
const FRICTION = 0.855;
const FORCE_SCALE = 0.38;
const DT = 0.22;
const CURSOR_R = 0.13;       // cursor influence radius
const CURSOR_F = 2.2;        // cursor repulsion strength
const TRAIL_ALPHA = 0.13;    // alpha of newest trail point

// ─── WebGL shader sources ────────────────────────────────────────────────────

const VS = /* glsl */`
  attribute vec2 a_pos;
  attribute float a_alpha;
  varying float v_alpha;
  uniform float u_size;
  void main() {
    // a_pos is [0,1] normalized; flip Y for WebGL clip space
    gl_Position = vec4(a_pos.x * 2.0 - 1.0, 1.0 - a_pos.y * 2.0, 0.0, 1.0);
    gl_PointSize = u_size;
    v_alpha = a_alpha;
  }
`;

const FS = /* glsl */`
  precision mediump float;
  varying float v_alpha;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c) * 2.0;
    if (d > 1.0) discard;
    // soft gaussian-ish falloff — bright core, feathered edge
    float a = smoothstep(1.0, 0.05, d) * v_alpha;
    gl_FragColor = vec4(0.067, 0.067, 0.067, a);
  }
`;

// ─── WebGL helpers ────────────────────────────────────────────────────────────

function makeShader(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  return s;
}

function makeProgram(gl: WebGLRenderingContext) {
  const p = gl.createProgram()!;
  gl.attachShader(p, makeShader(gl, gl.VERTEX_SHADER, VS));
  gl.attachShader(p, makeShader(gl, gl.FRAGMENT_SHADER, FS));
  gl.linkProgram(p);
  return p;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function DigitalAutomataCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = Boolean(useReducedMotion());

  useEffect(() => {
    if (reducedMotion) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false, antialias: false });
    if (!gl) return;

    // ── WebGL program ──
    const prog = makeProgram(gl);
    gl.useProgram(prog);
    const aPos = gl.getAttribLocation(prog, 'a_pos');
    const aAlpha = gl.getAttribLocation(prog, 'a_alpha');
    const uSize = gl.getUniformLocation(prog, 'u_size');

    const posBuf = gl.createBuffer()!;
    const alphaBuf = gl.createBuffer()!;

    // Total draw vertices: N particles × TRAIL trail segments
    const VERTS = N * TRAIL;
    const posArr = new Float32Array(VERTS * 2);
    const alphaArr = new Float32Array(VERTS);

    // ── Particle state (normalized 0-1 coords) ──
    const px = new Float32Array(N);
    const py = new Float32Array(N);
    const vx = new Float32Array(N);
    const vy = new Float32Array(N);
    const sp = new Uint8Array(N); // species

    for (let i = 0; i < N; i++) {
      px[i] = Math.random();
      py[i] = Math.random();
      vx[i] = (Math.random() - 0.5) * 0.003;
      vy[i] = (Math.random() - 0.5) * 0.003;
      sp[i] = Math.floor(i / N_PER);
    }

    // ── Trail circular buffer ──
    // trailX[i * TRAIL + t] = x of particle i at time offset t from head
    const trailX = new Float32Array(N * TRAIL).fill(-1);
    const trailY = new Float32Array(N * TRAIL).fill(-1);
    let head = 0; // current write slot

    // ── Mouse state (normalized) ──
    let mx = -1, my = -1, mActive = false;

    const parent = canvas.parentElement ?? canvas;
    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mx = (e.clientX - r.left) / r.width;
      my = (e.clientY - r.top) / r.height;
      mActive = true;
    };
    const onLeave = () => { mActive = false; };
    parent.addEventListener('mousemove', onMove);
    parent.addEventListener('mouseleave', onLeave);

    // ── Physics ──
    let cW = 0, cH = 0;

    function simulate() {
      const w = cW, h = cH;
      const minD = Math.min(w, h);
      const rMin = R_MIN * minD;
      const rMax = R_MAX * minD;
      const rMax2 = rMax * rMax;
      const rMin2 = rMin * rMin;
      const cR = CURSOR_R * minD;
      const cR2 = cR * cR;

      // spatial grid — O(n) average
      const cs = rMax; // cell size
      const gW = Math.ceil(w / cs);
      const gH = Math.ceil(h / cs);
      const grid: number[][] = Array.from({ length: gW * gH }, () => []);

      for (let i = 0; i < N; i++) {
        const gx = Math.min(Math.floor(px[i] * w / cs), gW - 1);
        const gy = Math.min(Math.floor(py[i] * h / cs), gH - 1);
        grid[gx + gy * gW].push(i);
      }

      for (let i = 0; i < N; i++) {
        const xi = px[i] * w;
        const yi = py[i] * h;
        const gx = Math.min(Math.floor(xi / cs), gW - 1);
        const gy = Math.min(Math.floor(yi / cs), gH - 1);
        let fx = 0, fy = 0;

        for (let dx = -1; dx <= 1; dx++) {
          for (let dy = -1; dy <= 1; dy++) {
            const nx = gx + dx, ny = gy + dy;
            if (nx < 0 || nx >= gW || ny < 0 || ny >= gH) continue;
            const cell = grid[nx + ny * gW];
            for (const j of cell) {
              if (i === j) continue;
              const ddx = (px[j] - px[i]) * w;
              const ddy = (py[j] - py[i]) * h;
              const d2 = ddx * ddx + ddy * ddy;
              if (d2 === 0 || d2 > rMax2) continue;
              const d = Math.sqrt(d2);
              let force = 0;
              if (d2 < rMin2) {
                force = -(1 - d / rMin); // hard repulsion
              } else {
                const t = (d - rMin) / (rMax - rMin);
                force = t < 0.35 ? t / 0.35 : (1 - t) / 0.65;
                force *= FORCES[sp[i]][sp[j]] * FORCE_SCALE;
              }
              fx += force * (ddx / d);
              fy += force * (ddy / d);
            }
          }
        }

        // cursor repulsion
        if (mActive) {
          const cdx = (mx - px[i]) * w;
          const cdy = (my - py[i]) * h;
          const cd2 = cdx * cdx + cdy * cdy;
          if (cd2 < cR2 && cd2 > 0) {
            const cd = Math.sqrt(cd2);
            const s = CURSOR_F * (1 - cd / cR) * (1 - cd / cR);
            fx -= s * (cdx / cd);
            fy -= s * (cdy / cd);
          }
        }

        vx[i] = (vx[i] + fx * DT) * FRICTION;
        vy[i] = (vy[i] + fy * DT) * FRICTION;
      }

      // write current positions to trail head
      for (let i = 0; i < N; i++) {
        trailX[i * TRAIL + head] = px[i];
        trailY[i * TRAIL + head] = py[i];
      }
      head = (head + 1) % TRAIL;

      // integrate
      for (let i = 0; i < N; i++) {
        px[i] = ((px[i] + vx[i] / w) % 1 + 1) % 1;
        py[i] = ((py[i] + vy[i] / h) % 1 + 1) % 1;
      }
    }

    // ── Build render arrays ──
    function buildArrays() {
      let vi = 0;
      for (let i = 0; i < N; i++) {
        for (let t = 0; t < TRAIL; t++) {
          // age 0 = newest (head-1), age TRAIL-1 = oldest
          const slot = ((head - 1 - t) % TRAIL + TRAIL) % TRAIL;
          const x = trailX[i * TRAIL + slot];
          const y = trailY[i * TRAIL + slot];
          posArr[vi * 2]     = x < 0 ? -2 : x; // push off-screen if uninitialized
          posArr[vi * 2 + 1] = y < 0 ? -2 : y;
          alphaArr[vi] = TRAIL_ALPHA * Math.pow(1 - t / TRAIL, 1.6);
          vi++;
        }
      }
    }

    // ── Resize ──
    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      cW = w;
      cH = h;
      gl.viewport(0, 0, canvas.width, canvas.height);
    }

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    // ── Render loop ──
    let raf = 0;
    const pointSize = Math.min(window.devicePixelRatio || 1, 2) * 7;

    function frame() {
      simulate();
      buildArrays();

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

      gl.uniform1f(uSize, pointSize);

      gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
      gl.bufferData(gl.ARRAY_BUFFER, posArr, gl.DYNAMIC_DRAW);
      gl.enableVertexAttribArray(aPos);
      gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, alphaBuf);
      gl.bufferData(gl.ARRAY_BUFFER, alphaArr, gl.DYNAMIC_DRAW);
      gl.enableVertexAttribArray(aAlpha);
      gl.vertexAttribPointer(aAlpha, 1, gl.FLOAT, false, 0, 0);

      gl.drawArrays(gl.POINTS, 0, VERTS);

      raf = requestAnimationFrame(frame);
    }

    frame();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      parent.removeEventListener('mousemove', onMove);
      parent.removeEventListener('mouseleave', onLeave);
      gl.deleteBuffer(posBuf);
      gl.deleteBuffer(alphaBuf);
      gl.deleteProgram(prog);
    };
  }, [reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  );
}
