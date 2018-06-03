import { GLBuffer } from './GLBuffer';
import { GLProgram } from '@/graphics/webgl/GLProgram';

interface VAOElement {
  name: string;
  size: number;
  type: GLenum;
  offset: number
}

interface GLVaoElement {
  location: number;
  size: number;
  type: GLenum;
  offset: number;
}

class GLVertexArray {
  private gl: WebGLRenderingContext;
  private elements: GLVaoElement[];
  private vbo: GLBuffer;
  private totalStride: number;

  constructor(
    gl: WebGLRenderingContext,
    program: GLProgram,
    vbo: GLBuffer,
    totalStride: number,
    vaoElements: VAOElement[]
  ) {
    this.gl = gl;
    this.elements = [];
    this.vbo = vbo;
    this.totalStride = totalStride;

    for (let element of vaoElements) {
      const loc = gl.getAttribLocation(program.glId, element.name);

      if (loc < 0) {
        throw new Error('Failed to find attrib location for: ' + element.name);
      }

      this.elements.push({
        location: loc,
        size: element.size,
        type: element.type,
        offset: element.offset
      });
    }
  }

  render(mode: GLenum, start: number, numVerts: number, ibo: null | GLBuffer = null): void {
    const gl: WebGLRenderingContext = this.gl;
    this.vbo.bind();

    this.elements.forEach(element => {
      gl.enableVertexAttribArray(element.location);
      gl.vertexAttribPointer(
        element.location,
        element.size,
        element.type,
        false,
        this.totalStride,
        element.offset);
    });

    if (ibo === null) {
      gl.drawArrays(mode, start, numVerts);
    } else {
      ibo.bind();
      gl.drawElements(mode, numVerts, gl.UNSIGNED_SHORT, start * 2); // 2 bytes in ushort
    }
  }
}

export { GLVertexArray, VAOElement };
