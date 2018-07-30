import { GLProgram, GLShader } from "./GLProgram";
import { GLBuffer } from "./GLBuffer";
import { GLVertexArray, VAOElement } from "./GLVertexArray";
import { GLTexture } from "./GLTexture";
import { GLFramebuffer } from "./GLFramebuffer";
import { vec2 } from "gl-matrix";

class GLUtils {
  private context: WebGLRenderingContext;

  constructor(context: WebGLRenderingContext) {
    this.context = context;

    this.setDefaults();

    const gl: WebGLRenderingContext = this.context;
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  }

  getContext(): WebGLRenderingContext {
    return this.context;
  }

  setDefaults(): void {
    const gl: WebGLRenderingContext = this.context;
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Enable depth testing, so that objects are occluded based
    // on depth instead of drawing order.
    gl.enable(gl.DEPTH_TEST);

    // Move the polygons back a bit so lines are still drawn
    // even though they are coplanar with the polygons they
    // came from, which will be drawn before them.
    gl.enable(gl.POLYGON_OFFSET_FILL);
    gl.polygonOffset(-1, -1);

    // Enable back-face culling, meaning only the front side
    // of every face is rendered.
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);

    // Specify that the front face is represented by vertices in
    // a counterclockwise order (this is the default).
    gl.frontFace(gl.CCW);
  }

  createProgram(...shaders: GLShader[]): GLProgram {
    return new GLProgram(this.context, ...shaders);
  }

  createVbo(
    vboData: null | Float32Array,
    dynamicDraw: boolean = false
  ): GLBuffer {
    const gl: WebGLRenderingContext = this.context;
    return new GLBuffer(
      gl,
      vboData,
      gl.ARRAY_BUFFER,
      dynamicDraw ? gl.DYNAMIC_DRAW : gl.STATIC_DRAW
    );
  }

  createIbo(iboData: Uint16Array, dynamicDraw = false): GLBuffer {
    const gl = this.context;
    return new GLBuffer(
      gl,
      iboData,
      gl.ELEMENT_ARRAY_BUFFER,
      dynamicDraw ? gl.DYNAMIC_DRAW : gl.STATIC_DRAW
    );
  }

  createVao(
    program: GLProgram,
    vbo: GLBuffer,
    totalStride: number,
    vaoElements: VAOElement[]
  ): GLVertexArray {
    return new GLVertexArray(
      this.context,
      program,
      vbo,
      totalStride,
      vaoElements
    );
  }

  createTexture(
    width: number,
    height: number,
    data: null | ArrayBufferView = null,
    internalFormat: GLenum = this.context.RGBA,
    format: GLenum = this.context.RGBA,
    filterType: GLenum = this.context.NEAREST,
    wrapType: GLenum = this.context.REPEAT,
    texType: GLenum = this.context.TEXTURE_2D
  ): GLTexture {
    return new GLTexture(
      this.context,
      vec2.fromValues(width, height),
      data,
      internalFormat,
      format,
      filterType,
      wrapType,
      texType
    );
  }

  createFramebuffer(
    width: number,
    height: number,
    data: null | ArrayBufferView = null,
    internalFormat: GLenum = this.context.RGBA,
    format: GLenum = this.context.RGBA,
    filterType: GLenum = this.context.NEAREST,
    wrapType: GLenum = this.context.CLAMP_TO_EDGE
  ): GLFramebuffer {
    return new GLFramebuffer(
      this.context,
      this.createTexture(
        width,
        height,
        data,
        internalFormat,
        format,
        filterType,
        wrapType
      )
    );
  }
}

export { GLUtils };
