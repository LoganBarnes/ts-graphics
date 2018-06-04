import { GLTexture } from "./GLTexture";

interface GLShader {
  text: string;
  type: GLenum;
}

function isArrayBuffer(val: number | ArrayBuffer): val is ArrayBuffer {
  return (<ArrayBuffer>val).byteLength !== undefined;
}

class GLProgram {
  private gl: WebGLRenderingContext;
  private programId: WebGLProgram;

  constructor(gl: WebGLRenderingContext, ...shaders: GLShader[]) {
    this.gl = gl;
    const shaderIds: WebGLShader[] = [];

    for (let shader of shaders) {
      const glShader: (WebGLShader | null) = gl.createShader(shader.type);
      if (glShader === null) {
        throw new Error("Failed to create WebGL shader");
      }

      gl.shaderSource(glShader, shader.text);
      gl.compileShader(glShader);

      if (!gl.getShaderParameter(glShader, gl.COMPILE_STATUS)) {
        throw new Error('Failed to compile shader: ' + gl.getShaderInfoLog(glShader));
      }
      shaderIds.push(glShader);
    }

    const program: (WebGLProgram | null) = gl.createProgram();
    if (program === null) {
      throw new Error("Failed to create WebGL program");
    }

    for (let shaderToAttach of shaderIds) {
      gl.attachShader(program, shaderToAttach);
    }
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error('Failed to link program: ' + gl.getProgramInfoLog(program));
    }

    for (let shaderToDetach of shaderIds) {
      gl.detachShader(program, shaderToDetach);
    }
    this.programId = program;
  }

  use(usageFunction: () => void): void {
    this.gl.useProgram(this.glId);
    usageFunction();
  }

  get glId(): WebGLProgram {
    return this.programId;
  }

  setIntUniform(val: number | Int32Array, name: string): boolean {
    const gl: WebGLRenderingContext = this.gl;
    const loc: WebGLUniformLocation | null = gl.getUniformLocation(this.glId, name);

    if (!loc) {
      console.error('Uniform location not found for: ' + name);
      return false;
    }

    if (!isArrayBuffer(val)) {
      gl.uniform1i(loc, val);
    } else {
      switch (val.length) {
        case 1:
          gl.uniform1iv(loc, val);
          break;
        case 2:
          gl.uniform2iv(loc, val);
          break;
        case 3:
          gl.uniform3iv(loc, val);
          break;
        case 4:
          gl.uniform4iv(loc, val);
          break;
        default:
          throw new Error('GLSL ivec' + val.length + ' does not exist');
      }
    }
    return true;
  }

  setFloatUniform(val: number | Float32Array, name: string): boolean {
    const gl: WebGLRenderingContext = this.gl;
    const loc: WebGLUniformLocation | null = gl.getUniformLocation(this.glId, name);

    if (!loc) {
      console.error('Uniform location not found for: ' + name);
      return false;
    }

    if (!isArrayBuffer(val)) {
      gl.uniform1f(loc, val);
    } else {
      switch (val.length) {
        case 1:
          gl.uniform1fv(loc, val);
          break;
        case 2:
          gl.uniform2fv(loc, val);
          break;
        case 3:
          gl.uniform3fv(loc, val);
          break;
        case 4:
          gl.uniform4fv(loc, val);
          break;
        default:
          throw new Error('GLSL vec' + val.length + ' does not exist');
      }
    }
    return true;
  }

  setMatrixUniform(val: Float32Array, name: string): boolean {
    const gl: WebGLRenderingContext = this.gl;
    const loc: WebGLUniformLocation | null = gl.getUniformLocation(this.glId, name);

    if (!loc) {
      console.error('Uniform location not found for: ' + name);
      return false;
    }

    switch (val.length) {
      case 4:
        gl.uniformMatrix2fv(loc, false, val);
        break;
      case 9:
        gl.uniformMatrix3fv(loc, false, val);
        break;
      case 16:
        gl.uniformMatrix4fv(loc, false, val);
        break;
      default:
        throw new Error("GLSL matrix data must contain 4, 9, or 16 elements");
    }
    return true;
  }

  setTextureUniform(texture: GLTexture, name: string, activeTex: number = 0): boolean {
    const gl: WebGLRenderingContext = this.gl;
    const loc: WebGLUniformLocation | null = gl.getUniformLocation(this.glId, name);

    if (!loc) {
      console.error('Uniform location not found for: ' + name);
      return false;
    }

    gl.activeTexture(gl.TEXTURE0 + activeTex);
    gl.uniform1i(loc, activeTex);
    texture.bind();
    return true;
  }
}

export { GLProgram, GLShader };
