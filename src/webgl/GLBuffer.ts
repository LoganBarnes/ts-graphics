
class GLBuffer {
  private gl: WebGLRenderingContext;
  private bufferId: WebGLBuffer;
  private type: GLenum;
  private usage: GLenum;

  constructor(
    gl: WebGLRenderingContext,
    dataBuffer: ArrayBuffer | null,
    type: GLenum = gl.ARRAY_BUFFER,
    usage: GLenum = gl.STATIC_DRAW
  ) {
    this.gl = gl;
    this.type = type;
    this.usage = usage;
    {
      const vbo: (WebGLBuffer | null) = gl.createBuffer();
      if (vbo === null) {
        throw new Error("Failed to create WebGL buffer");
      }
      this.bufferId = vbo;
    }

    this.bind();
    gl.bufferData(this.type, dataBuffer, this.usage);
  }

  bind(): void {
    this.gl.bindBuffer(this.type, this.glId);
  }

  get glId(): WebGLBuffer {
    return this.bufferId;
  }
}

export { GLBuffer };
