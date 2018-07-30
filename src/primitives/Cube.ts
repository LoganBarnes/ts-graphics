// Unit cube centered on origin
class Cube {
  private _vertexData: Float32Array;
  private _normalData: Float32Array;
  private _texCoordData: Float32Array;

  private _indexData: Uint16Array;

  constructor() {
    const r: number = 0.5;
    const vertexData: number[] = [
      // pos-z face
      -r,
      -r,
      r,
      r,
      -r,
      r,
      -r,
      r,
      r,
      r,
      r,
      r,
      // pos-x face
      r,
      -r,
      r,
      r,
      -r,
      -r,
      r,
      r,
      r,
      r,
      r,
      -r,
      // neg-z face
      r,
      -r,
      -r,
      -r,
      -r,
      -r,
      r,
      r,
      -r,
      -r,
      r,
      -r,
      // neg-x face
      -r,
      -r,
      -r,
      -r,
      -r,
      r,
      -r,
      r,
      -r,
      -r,
      r,
      r,
      // pos-y face
      -r,
      r,
      r,
      r,
      r,
      r,
      -r,
      r,
      -r,
      r,
      r,
      -r,
      // neg-y face
      -r,
      -r,
      -r,
      r,
      -r,
      -r,
      -r,
      -r,
      r,
      r,
      -r,
      r
    ];

    const normalData: number[] = [
      // pos-z face
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      0,
      1,
      // pos-x face
      1,
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      0,
      // neg-z face
      0,
      0,
      -1,
      0,
      0,
      -1,
      0,
      0,
      -1,
      0,
      0,
      -1,
      // neg-x face
      -1,
      0,
      0,
      -1,
      0,
      0,
      -1,
      0,
      0,
      -1,
      0,
      0,
      // pos-y face
      0,
      1,
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      // neg-y face
      0,
      -1,
      0,
      0,
      -1,
      0,
      0,
      -1,
      0,
      0,
      -1,
      0
    ];

    const texCoordData: number[] = [
      // pos-z face
      0,
      0,
      1,
      0,
      0,
      1,
      1,
      1,
      // pos-x face
      0,
      0,
      1,
      0,
      0,
      1,
      1,
      1,
      // neg-z face
      0,
      0,
      1,
      0,
      0,
      1,
      1,
      1,
      // neg-x face
      0,
      0,
      1,
      0,
      0,
      1,
      1,
      1,
      // pos-y face
      0,
      0,
      1,
      0,
      0,
      1,
      1,
      1,
      // neg-y face
      0,
      0,
      1,
      0,
      0,
      1,
      1,
      1
    ];

    const indexData: number[] = [
      // pos-z face
      0,
      1,
      2,
      2,
      1,
      3,
      // pos-x face
      4,
      5,
      6,
      6,
      5,
      7,
      // neg-z face
      8,
      9,
      10,
      10,
      9,
      11,
      // neg-x face
      12,
      13,
      14,
      14,
      13,
      15,
      // pos-y face
      16,
      17,
      18,
      18,
      17,
      19,
      // neg-y face
      20,
      21,
      22,
      22,
      21,
      23
    ];

    this._vertexData = new Float32Array(vertexData);
    this._normalData = new Float32Array(normalData);
    this._texCoordData = new Float32Array(texCoordData);

    this._indexData = new Uint16Array(indexData);
  }

  get vertexData(): Float32Array {
    return this._vertexData;
  }

  get normalData(): Float32Array {
    return this._normalData;
  }

  get texCoordData(): Float32Array {
    return this._texCoordData;
  }

  get indexData(): Uint16Array {
    return this._indexData;
  }

  getVertexDataSizeInBytes(): number {
    return this._vertexData.length * 4;
  }

  getNormalDataSizeInBytes(): number {
    return this._normalData.length * 4;
  }

  getTexCoordDataSizeInBytes(): number {
    return this._texCoordData.length * 4;
  }
}

export { Cube };
