import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'motion/react';

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
  resolution: vec2f,
  time: f32,
  motion: f32,
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

@fragment
fn fsMain(input: VertexOutput) -> @location(0) vec4f {
  let uv = input.uv;
  let t = uniforms.time;
  let motion = uniforms.motion;
  let res = max(uniforms.resolution, vec2f(1.0));
  let aspect = res.x / res.y;

  let centered = uv - vec2f(0.5);
  let outer = boxSdf(centered, vec2f(0.485, 0.46));
  let panelMask = 1.0 - smoothstep(0.0, 0.022, outer);
  let innerMask = 1.0 - smoothstep(0.0, 0.03, boxSdf(centered, vec2f(0.44, 0.36)));

  let p = vec2f((uv.x - 0.5) * aspect, uv.y - 0.5);
  let spread = exp(-pow(p.x * 1.05, 2.0) - pow(p.y * 1.4, 2.0));
  let spreadWide = exp(-pow(p.x * 0.72, 2.0) - pow(p.y * 0.88, 2.0));

  let flow1 = p.x * 2.4 + sin((p.y + t * 0.08) * 5.2) * 0.32;
  let flow2 = p.y * 1.8 + cos((p.x - t * 0.06) * 4.4) * 0.28;
  let causticBase = sin(flow1 * 4.2 - t * 0.42) + cos(flow2 * 5.0 + t * 0.28);
  let caustic = pow(max(causticBase * 0.5 + 0.5, 0.0), 5.0) * (0.48 + spreadWide * 0.52);

  let prismEdgeA = exp(-pow((p.x + 0.28) * 5.2, 2.0) - pow((p.y + 0.04) * 6.0, 2.0));
  let prismEdgeB = exp(-pow((p.x - 0.30) * 5.4, 2.0) - pow((p.y - 0.06) * 6.4, 2.0));
  let prismEdgeC = exp(-pow((p.x + 0.02) * 6.2, 2.0) - pow((p.y - 0.22) * 5.8, 2.0));
  let verticalSweep = exp(-pow((uv.x - fract(t * 0.045 * motion + 0.16)) * 8.0, 2.0)) * (0.30 + spread * 0.70);
  let diagonalSweep = exp(-pow((p.x * 0.84 - p.y * 0.56 - sin(t * 0.18) * 0.18) * 6.0, 2.0)) * (0.24 + spreadWide * 0.76);
  let horizontalSweep = exp(-pow((uv.y - fract(t * 0.032 * motion + 0.46)) * 7.4, 2.0)) * (0.28 + spreadWide * 0.72);
  let beamTrackA = exp(-pow((p.x * 0.92 + p.y * 0.34 - sin(t * 0.21) * 0.16) * 8.8, 2.0)) * (0.22 + spreadWide * 0.78);
  let beamTrackB = exp(-pow((p.x * -0.76 + p.y * 0.48 + cos(t * 0.17) * 0.18) * 9.2, 2.0)) * (0.16 + spread * 0.84);
  let depthWarp = sin((p.x * 3.8 - p.y * 2.4) + t * 0.26) * 0.045;

  let volumeLobeA = lobe(p, vec2f(-0.34 + sin(t * 0.11) * 0.04, -0.04), vec2f(2.6, 4.2), vec2f(0.48, -0.18));
  let volumeLobeB = lobe(p, vec2f(0.18 + cos(t * 0.08) * 0.05, 0.12), vec2f(2.1, 3.4), vec2f(-0.34, 0.26));
  let volumeLobeC = lobe(p, vec2f(0.04, -0.22 + sin(t * 0.09) * 0.03), vec2f(3.0, 4.6), vec2f(0.18, 0.22));
  let volumeBands = max(volumeLobeA * 0.84, max(volumeLobeB * 0.72, volumeLobeC * 0.68));
  let volumeTexture = sin((p.x * 8.0 + p.y * 5.4 + t * 0.34) + depthWarp * 14.0) * 0.5 + 0.5;
  let beamVolume = pow(max(volumeTexture, 0.0), 2.8) * volumeBands;

  let noise = (hash(floor(uv * res * 0.42) + floor(t * 6.0)) - 0.5) * 0.008;

  let fieldX = (caustic + prismEdgeA * 0.44 - prismEdgeB * 0.32 + prismEdgeC * 0.28 + verticalSweep * 0.42 + beamTrackA * 0.28 - beamTrackB * 0.18) * 1.72;
  let fieldY = (diagonalSweep * 0.72 + horizontalSweep * 0.54 + prismEdgeB * 0.34 - prismEdgeA * 0.22 + beamTrackB * 0.22) * 1.48;
  let normal = normalize(vec3f(fieldX, fieldY, 1.0));
  let lightDirA = normalize(vec3f(-0.45, -0.25, 0.86));
  let lightDirB = normalize(vec3f(0.62, 0.10, 0.78));
  let viewDir = vec3f(0.0, 0.0, 1.0);
  let halfA = normalize(lightDirA + viewDir);
  let halfB = normalize(lightDirB + viewDir);
  let specular = pow(max(dot(normal, halfA), 0.0), 54.0) * 0.32 + pow(max(dot(normal, halfB), 0.0), 88.0) * 0.22;
  let fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 2.6) * 0.2;

  let dispersion = spectrum(clamp(uv.x + caustic * 0.22 + diagonalSweep * 0.10, 0.0, 1.0));
  let dispersionB = spectrum(clamp(1.0 - uv.y + verticalSweep * 0.14, 0.0, 1.0));
  let dispersionC = spectrum(clamp(uv.x * 0.46 + uv.y * 0.54 + beamVolume * 0.52 + beamTrackA * 0.18, 0.0, 1.0));
  let spectral = dispersion * (caustic * 0.92 + prismEdgeA * 0.34 + prismEdgeC * 0.22 + verticalSweep * 0.22) +
    dispersionB * (diagonalSweep * 0.48 + prismEdgeB * 0.32 + horizontalSweep * 0.24) +
    dispersionC * (beamVolume * 0.94 + beamTrackA * 0.24 + beamTrackB * 0.18);

  let volumeLift = vec3f(0.90, 0.95, 1.0) * beamVolume * 0.12;
  let causticVolume = spectral * 1.04 + spectrum(clamp(uv.y * 0.62 + beamVolume * 0.34, 0.0, 1.0)) * beamVolume * 0.58;
  let beam = causticVolume + vec3f(0.92, 0.97, 1.0) * specular * 1.46;
  let rim = vec3f(0.68, 0.82, 1.0) * fresnel * 0.26;
  let color = beam + rim + volumeLift + vec3f(noise);

  let alpha = clamp(
    caustic * 0.36 +
    verticalSweep * 0.12 +
    diagonalSweep * 0.14 +
    horizontalSweep * 0.12 +
    beamTrackA * 0.10 +
    beamTrackB * 0.08 +
    beamVolume * 0.22 +
    specular * 0.30 +
    fresnel * 0.10 +
    innerMask * 0.02,
    0.0,
    0.86
  ) * panelMask * smoothstep(0.07, 0.40, caustic + verticalSweep + diagonalSweep + beamVolume * 0.74 + specular * 0.6);
  return vec4f(color * alpha, alpha);
}
`;

const bufferUsage = globalThis.GPUBufferUsage;
const textureUsage = globalThis.GPUTextureUsage;

export default function HeroRectLayer() {
  const prefersReducedMotion = Boolean(useReducedMotion());
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gpu = (navigator as Navigator & {
      gpu?: {
        requestAdapter: () => Promise<GPUAdapterLike | null>;
        getPreferredCanvasFormat: () => string;
      };
    }).gpu;

    if (!canvas || !gpu || !bufferUsage || !textureUsage) return;

    let frameId = 0;
    let disposed = false;
    let isPaused = document.hidden;
    let cleanupEvents = () => {};

    const getDpr = () => Math.min(window.devicePixelRatio || 1, 2);

    const initialize = async () => {
      const adapter = await gpu.requestAdapter();
      if (!adapter || disposed) return;

      const device = await adapter.requestDevice();
      if (disposed) {
        device.destroy?.();
        return;
      }

      const context = canvas.getContext('webgpu') as GPUCanvasContextLike | null;
      if (!context) {
        device.destroy?.();
        return;
      }

      const format = gpu.getPreferredCanvasFormat();
      const uniformBuffer = device.createBuffer({
        size: 16,
        usage: bufferUsage.UNIFORM | bufferUsage.COPY_DST,
      });

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

      const bindGroup = device.createBindGroup({
        layout: pipeline.getBindGroupLayout(0),
        entries: [{ binding: 0, resource: { buffer: uniformBuffer } }],
      });

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
      };

      const render = () => {
        if (disposed || isPaused) return;

        const data = new Float32Array([
          canvas.width,
          canvas.height,
          performance.now() / 1000,
          prefersReducedMotion ? 0.18 : 1,
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
      }

      window.addEventListener('resize', handleResize);
      document.addEventListener('visibilitychange', handleVisibilityChange);

      cleanupEvents = () => {
        window.removeEventListener('resize', handleResize);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };

      void device.lost?.then(() => {
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
  }, [prefersReducedMotion]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none relative hidden h-[clamp(9.5rem,19svh,13rem)] w-[min(46rem,52vw)] min-w-[36rem] md:block lg:w-[min(50rem,48vw)]"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
      />
    </div>
  );
}
