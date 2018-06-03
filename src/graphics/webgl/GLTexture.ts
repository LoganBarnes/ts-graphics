import { vec2 } from "gl-matrix";

// assume GL_TEXTURE_2D for now
class GLTexture {
  private gl: WebGLRenderingContext;
  private textureId: WebGLTexture;
  private dim: vec2;
  private internalFormat: GLenum;
  private format: GLenum;
  private _filterType: GLenum;
  private _wrapType: GLenum;
  private texType: GLenum;

  constructor(
    gl: WebGLRenderingContext,
    dim: vec2,
    data: null | ArrayBufferView,
    internalFormat: GLenum,
    format: GLenum,
    filterType: GLenum,
    wrapType: GLenum,
    texType: GLenum
  ) {
    this.gl = gl;
    this.dim = dim;
    this.internalFormat = internalFormat;
    this.format = format;
    this._filterType = filterType;
    this._wrapType = wrapType;
    this.texType = texType;
    {
      const tex = gl.createTexture();
      if (tex === null) {
        throw new Error("Failed to create Texture");
      }
      this.textureId = tex;
    }
    this.filterType = filterType;
    this.wrapType = wrapType;

    this.bind();
    gl.texImage2D(
      this.texType,
      0,
      this.internalFormat,
      this.dim[0],
      this.dim[1],
      0,
      this.format,
      gl.FLOAT,
      data
    );
  }

  bind(): void {
    this.gl.bindTexture(this.texType, this.glId);
  }

  get glId(): WebGLTexture {
    return this.textureId;
  }

  get width(): number {
    return this.dim[0];
  }

  get height(): number {
    return this.dim[1];
  }

  get size(): vec2 {
    return this.dim;
  }

  set filterType(type: GLenum) {
    this._filterType = type;
    const gl: WebGLRenderingContext = this.gl;
    this.bind();
    gl.texParameteri(this.texType, gl.TEXTURE_MIN_FILTER, this._filterType);
    gl.texParameteri(this.texType, gl.TEXTURE_MAG_FILTER, this._filterType);
  }

  set wrapType(type: GLenum) {
    this._wrapType = type;
    const gl: WebGLRenderingContext = this.gl;
    this.bind();
    gl.texParameteri(this.texType, gl.TEXTURE_WRAP_S, this._wrapType);
    gl.texParameteri(this.texType, gl.TEXTURE_WRAP_T, this._wrapType);
  }
}

export { GLTexture };
