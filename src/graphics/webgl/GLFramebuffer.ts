import { GLTexture } from './GLTexture';
import { vec2 } from 'gl-matrix';

// assumes 2D
class GLFramebuffer {
  private gl: WebGLRenderingContext;
  private _texture: GLTexture;
  private framebufferId: WebGLFramebuffer;
  private type: GLenum;

  constructor(gl: WebGLRenderingContext, texture: GLTexture) {
    this.gl = gl;
    this._texture = texture;
    this.type = gl.FRAMEBUFFER;
    {
      const fbo: (WebGLFramebuffer | null) = gl.createFramebuffer();
      if (fbo === null) {
        throw new Error("Failed to create WebGL framebuffer");
      }
      this.framebufferId = fbo;
    }

    const w: number = this._texture.width;
    const h: number = this._texture.height;

    this.bind();

    const renderbuffer: (WebGLRenderbuffer | null) = gl.createRenderbuffer();
    if (renderbuffer === null) {
      throw new Error("Failed to create WebGL renderbuffer");
    }
    gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, w, h);

    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, renderbuffer);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);

    this._texture.bind();
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this._texture.glId, 0);

    const status: GLenum = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    switch (status) {
      case gl.FRAMEBUFFER_COMPLETE:
        break;
      case gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT:
        throw new Error('Incomplete framebuffer: FRAMEBUFFER_INCOMPLETE_ATTACHMENT');
      case gl.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT:
        throw new Error('Incomplete framebuffer: FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT');
      case gl.FRAMEBUFFER_INCOMPLETE_DIMENSIONS:
        throw new Error('Incomplete framebuffer: FRAMEBUFFER_INCOMPLETE_DIMENSIONS');
      case gl.FRAMEBUFFER_UNSUPPORTED:
        throw new Error('Incomplete framebuffer: FRAMEBUFFER_UNSUPPORTED');
      default:
        throw new Error('Incomplete framebuffer: Unknown status');
    }

    this.unbind();
  }

  bind(): void {
    this.gl.bindFramebuffer(this.type, this.glId);
  }

  unbind(): void {
    this.gl.bindFramebuffer(this.type, null);
  }

  use(usageFunction: () => void): void {
    this.bind();
    usageFunction();
    this.unbind();
  }

  get glId(): WebGLFramebuffer {
    return this.framebufferId;
  }

  get texture(): GLTexture {
    return this._texture;
  }

  get width(): number {
    return this._texture.width;
  }

  get height(): number {
    return this._texture.height;
  }

  get size(): vec2 {
    return this._texture.size;
  }
}

export { GLFramebuffer };
