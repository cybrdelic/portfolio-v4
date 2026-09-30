import { fieldFragment, fullscreenVertex, particleFragment, particleVertex, typeFragment, typeVertex } from './shaders';
import { motionState } from './state';
import { MediaTexture } from './MediaTexture';

type TextLayer = { element: HTMLElement; texture: WebGLTexture; width: number; height: number; signature: string };

function program(gl: WebGL2RenderingContext, vertex: string, fragment: string) {
  const shaders = [gl.VERTEX_SHADER, gl.FRAGMENT_SHADER].map((type, i) => {
    const shader = gl.createShader(type)!;
    gl.shaderSource(shader, i ? fragment : vertex);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const message = gl.getShaderInfoLog(shader);
      gl.deleteShader(shader);
      throw new Error(`GPU shader compilation failed: ${message}`);
    }
    return shader;
  });
  const value = gl.createProgram()!;
  shaders.forEach(shader => gl.attachShader(value, shader));
  gl.linkProgram(value);
  shaders.forEach(shader => gl.deleteShader(shader));
  if (!gl.getProgramParameter(value, gl.LINK_STATUS)) {
    const message = gl.getProgramInfoLog(value);
    gl.deleteProgram(value);
    throw new Error(`GPU shader linking failed: ${message}`);
  }
  return value;
}

/** One context, one full-screen surface, no route-owned GPU resources. */
export class Renderer {
  private gl: WebGL2RenderingContext;
  private field: WebGLProgram;
  private typography: WebGLProgram;
  private particles: WebGLProgram;
  private particleVao: WebGLVertexArrayObject;
  private media: MediaTexture[];
  private vao: WebGLVertexArrayObject;
  private layers: TextLayer[] = [];
  private locations = new Map<string, WebGLUniformLocation | null>();
  private width = 0;
  private height = 0;
  private fieldWidth = 0;
  private fieldHeight = 0;
  private framebuffer: WebGLFramebuffer;
  private fieldTexture: WebGLTexture;
  private mobile: boolean;
  private measureNeeded = true;
  private observer: MutationObserver;
  private resizeObserver: ResizeObserver;
  private disposed = false;
  private maxTexture: number;
  private bounds = { width: 1, height: 1 };

  constructor(private canvas: HTMLCanvasElement) {
    const gl = canvas.getContext('webgl2', {
      alpha: false, antialias: false, depth: false, stencil: false,
      powerPreference: 'low-power', preserveDrawingBuffer: false,
    });
    if (!gl) throw new Error('WebGL2 is unavailable');
    this.gl = gl;
    this.field = program(gl, fullscreenVertex, fieldFragment);
    this.typography = program(gl, typeVertex, typeFragment);
    this.particles = program(gl, particleVertex, particleFragment);
    this.vao = gl.createVertexArray()!;
    this.particleVao = gl.createVertexArray()!;
    this.media = ['water', 'fire', 'light', 'geo', 'scenes', 'forest'].map(motif => {
      const video = document.querySelector<HTMLVideoElement>(`[data-world-media=${motif}]`);
      const poster = motif === 'water' ? 'aqua' : motif === 'fire' ? 'ignia' : motif === 'scenes' ? 'scenes-sandstone' : motif;
      return new MediaTexture(gl, `/media/${poster}.webp`, video || undefined);
    });
    this.framebuffer = gl.createFramebuffer()!;
    this.fieldTexture = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, this.fieldTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    this.maxTexture = gl.getParameter(gl.MAX_TEXTURE_SIZE);
    this.mobile = matchMedia('(max-width: 760px), (pointer: coarse)').matches;
    motionState.quality = this.mobile ? 0.55 : 1;
    this.observer = new MutationObserver(() => { this.measureNeeded = true; });
    this.observer.observe(document.getElementById('root')!, { childList: true, subtree: true });
    this.resizeObserver = new ResizeObserver(() => { this.measureNeeded = true; });
    this.resizeObserver.observe(document.documentElement);
    document.fonts.ready.then(() => { if (!this.disposed) this.measureNeeded = true; });
  }

  private uniform(which: 'field' | 'type' | 'particles', name: string) {
    const key = `${which}:${name}`;
    if (!this.locations.has(key)) this.locations.set(key, this.gl.getUniformLocation(which === 'field' ? this.field : which === 'type' ? this.typography : this.particles, name));
    return this.locations.get(key)!;
  }

  private bindMedia(which: 'field' | 'particles') {
    const names = ['uOcean', 'uFlame', 'uLight', 'uGeo', 'uScenes', 'uForest'];
    this.media.forEach((media, i) => {
      this.gl.activeTexture(this.gl.TEXTURE0 + i);
      this.gl.bindTexture(this.gl.TEXTURE_2D, media.texture);
      this.gl.uniform1i(this.uniform(which, names[i]), i);
      this.gl.uniform2f(this.uniform(which, `${names[i]}Size`), media.size[0], media.size[1]);
    });
  }

  private resize() {
    const { gl, canvas } = this;
    const cssWidth = window.innerWidth, cssHeight = window.innerHeight;
    const cap = 1.35;
    const ratio = Math.min(window.devicePixelRatio || 1, cap);
    const scale = Math.min(ratio, Math.sqrt(1_700_000 / (cssWidth * cssHeight)));
    const width = Math.max(1, Math.round(cssWidth * scale));
    const height = Math.max(1, Math.round(cssHeight * scale));
    this.bounds = { width: cssWidth, height: cssHeight };
    const fieldWidth = Math.max(1, Math.round(width * Math.sqrt(motionState.quality)));
    const fieldHeight = Math.max(1, Math.round(height * Math.sqrt(motionState.quality)));
    if (width !== this.width || height !== this.height) {
      canvas.width = this.width = width;
      canvas.height = this.height = height;
      this.measureNeeded = true;
    }
    if (fieldWidth !== this.fieldWidth || fieldHeight !== this.fieldHeight) {
      this.fieldWidth = fieldWidth; this.fieldHeight = fieldHeight;
      gl.bindTexture(gl.TEXTURE_2D, this.fieldTexture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, fieldWidth, fieldHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.fieldTexture, 0);
      if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) throw new Error('Motion framebuffer is incomplete');
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }
  }

  private measureType() {
    const gl = this.gl;
    const elements = [...document.querySelectorAll<HTMLElement>('[data-gpu-type]')];
    for (const layer of this.layers) {
      if (!elements.includes(layer.element)) {
        layer.element.classList.remove('gpu-type-ready');
        gl.deleteTexture(layer.texture);
      }
    }
    this.layers = this.layers.filter(layer => elements.includes(layer.element));
    elements.forEach(element => {
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const text = element.innerText;
      const signature = `${text}|${rect.width}|${rect.height}|${style.fontSize}|${style.fontFamily}`;
      let layer = this.layers.find(item => item.element === element);
      if (layer?.signature === signature) return;
      const raster = document.createElement('canvas');
      const ratio = Math.min(2, this.maxTexture / (rect.width + 20), this.maxTexture / (rect.height + 20));
      raster.width = Math.ceil((rect.width + 20) * ratio);
      raster.height = Math.ceil((rect.height + 20) * ratio);
      const ctx = raster.getContext('2d')!;
      ctx.scale(ratio, ratio);
      ctx.fillStyle = '#f1f2e9';
      ctx.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
      ctx.textBaseline = 'alphabetic';
      // Authored line breaks keep the accessible DOM and GPU raster identical.
      const size = parseFloat(style.fontSize);
      const lineHeight = parseFloat(style.lineHeight) || size;
      const spacing = parseFloat(style.letterSpacing) || 0;
      text.split('\n').forEach((line, index) => {
        let x = 10;
        const y = 10 + size * 0.79 + index * lineHeight;
        for (const glyph of line) {
          ctx.fillText(glyph, x, y);
          x += ctx.measureText(glyph).width + spacing;
        }
      });
      const texture = layer?.texture || gl.createTexture()!;
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, raster);
      if (!layer) {
        layer = { element, texture, width: rect.width + 20, height: rect.height + 20, signature };
        this.layers.push(layer);
      } else Object.assign(layer, { width: rect.width + 20, height: rect.height + 20, signature });
      element.classList.add('gpu-type-ready');
    });
    this.measureNeeded = false;
  }

  draw() {
    const { gl } = this;
    const state = motionState;
    this.resize();
    if (this.measureNeeded) this.measureType();
    this.media.forEach((media, i) => media.update(state.weights[i]));
    gl.bindVertexArray(this.vao);
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
    gl.viewport(0, 0, this.fieldWidth, this.fieldHeight);
    gl.disable(gl.BLEND);
    gl.useProgram(this.field);
    gl.uniform2f(this.uniform('field', 'uResolution'), this.fieldWidth, this.fieldHeight);
    gl.uniform2f(this.uniform('field', 'uPointer'), state.reduced ? 0 : state.pointer[0], state.reduced ? 0 : state.pointer[1]);
    gl.uniform1f(this.uniform('field', 'uTime'), state.time);
    gl.uniform1f(this.uniform('field', 'uVelocity'), state.reduced ? 0 : state.velocity);
    gl.uniform1f(this.uniform('field', 'uRoute'), state.reduced ? 0 : state.route);
    gl.uniform1f(this.uniform('field', 'uFramed'), state.framed);
    gl.uniform1fv(this.uniform('field', 'uWeights'), state.weights);
    gl.uniform1f(this.uniform('field', 'uQuality'), state.quality);
    this.bindMedia('field');
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    gl.useProgram(this.particles);
    gl.bindVertexArray(this.particleVao);
    gl.uniform2f(this.uniform('particles', 'uResolution'), this.fieldWidth, this.fieldHeight);
    gl.uniform2f(this.uniform('particles', 'uPointer'), state.reduced ? 0 : state.pointer[0], state.reduced ? 0 : state.pointer[1]);
    gl.uniform1f(this.uniform('particles', 'uTime'), state.time);
    gl.uniform1f(this.uniform('particles', 'uVelocity'), state.reduced ? 0 : state.velocity);
    gl.uniform1f(this.uniform('particles', 'uRoute'), state.reduced ? 0 : state.route);
    gl.uniform1f(this.uniform('particles', 'uPixelRatio'), this.fieldHeight / this.bounds.height);
    gl.uniform1fv(this.uniform('particles', 'uWeights'), state.weights);
    this.bindMedia('particles');
    gl.drawArrays(gl.POINTS, 0, 32768);
    gl.bindVertexArray(this.vao);
    // Resolve imagery and particles from the cheaper field buffer. Type stays sharp.
    gl.bindFramebuffer(gl.READ_FRAMEBUFFER, this.framebuffer);
    gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, null);
    gl.blitFramebuffer(0, 0, this.fieldWidth, this.fieldHeight, 0, 0, this.width, this.height, gl.COLOR_BUFFER_BIT, gl.LINEAR);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, this.width, this.height);
    state.drawCalls = 2;
    if (!state.reduced) {
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.useProgram(this.typography);
      gl.uniform2f(this.uniform('type', 'uScreen'), this.bounds.width, this.bounds.height);
      gl.uniform1f(this.uniform('type', 'uTime'), state.time);
      gl.uniform1f(this.uniform('type', 'uVelocity'), state.velocity);
      gl.uniform1f(this.uniform('type', 'uRoute'), state.route);
      gl.uniform2f(this.uniform('type', 'uPointer'), state.pointer[0], state.pointer[1]);
      gl.uniform1i(this.uniform('type', 'uText'), 0);
      for (const layer of this.layers) {
        const rect = layer.element.getBoundingClientRect();
        if (rect.bottom < -20 || rect.top > this.bounds.height + 20) continue;
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, layer.texture);
        gl.uniform4f(this.uniform('type', 'uRect'), rect.left - 10, rect.top - 10, layer.width, layer.height);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        state.drawCalls++;
      }
    }
    state.ready = this.media.every((media, i) => state.weights[i] < 0.025 || media.loaded);
    state.frames++;
  }

  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    this.observer.disconnect();
    this.resizeObserver.disconnect();
    this.layers.forEach(layer => {
      layer.element.classList.remove('gpu-type-ready');
      this.gl.deleteTexture(layer.texture);
    });
    this.gl.deleteProgram(this.field);
    this.gl.deleteProgram(this.typography);
    this.gl.deleteProgram(this.particles);
    this.gl.deleteVertexArray(this.particleVao);
    this.media.forEach(media => media.dispose());
    this.gl.deleteVertexArray(this.vao);
    this.gl.deleteFramebuffer(this.framebuffer);
    this.gl.deleteTexture(this.fieldTexture);
    this.layers = [];
  }
}
