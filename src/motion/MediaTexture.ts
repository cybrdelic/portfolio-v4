import { motionState } from './state';

export class MediaTexture {
  readonly texture: WebGLTexture;
  readonly image = new Image();
  size = [16, 9];
  loaded = false;
  private lastFrame = -1;
  private posterVisible = true;
  private imageDirty = false;
  private blocked = false;
  private disposed = false;
  private video?: HTMLVideoElement;
  constructor(private gl: WebGL2RenderingContext, private poster: string, private videoSelector: string) {
    this.texture = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([6, 8, 10, 255]));
    this.image.onload = () => {
      if (this.disposed) return;
      this.size = [this.image.width, this.image.height];
      this.imageDirty = true;
      this.loaded = true;
    };
    this.image.onerror = () => { this.loaded = true; };
  }
  private upload(source: TexImageSource) {
    const gl = this.gl;
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
  }
  update(weight: number) {
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (this.video && !this.video.isConnected) {
      this.video.pause();
      this.video = undefined;
      this.lastFrame = -1;
      this.posterVisible = false;
      this.blocked = false;
    }
    if (!this.video && weight > 0.025) this.video = document.querySelector<HTMLVideoElement>(this.videoSelector) || undefined;
    if (weight > 0.01 && !this.image.src) this.image.src = this.poster;
    const play = !!this.video && weight > 0.025 && motionState.enabled && !motionState.reduced && !motionState.frozen && !document.hidden && !connection?.saveData;
    if (play && !this.blocked && this.video?.paused) this.video!.play().catch(error => { if (error?.name === 'NotAllowedError') this.blocked = true; });
    if (!play) this.video?.pause();
    if (this.imageDirty || (!play && !this.posterVisible && this.image.complete && this.image.naturalWidth)) {
      this.upload(this.image); this.imageDirty = false; this.posterVisible = true;
    }
    if (play && this.video && this.video.readyState >= 2 && this.video.currentTime !== this.lastFrame) {
      this.upload(this.video);
      this.size = [this.video.videoWidth, this.video.videoHeight];
      this.lastFrame = this.video.currentTime;
      this.posterVisible = false;
    }
  }
  dispose() {
    this.disposed = true;
    this.video?.pause();
    this.image.onload = null;
    this.image.onerror = null;
    this.gl.deleteTexture(this.texture);
  }
}
