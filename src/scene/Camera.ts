import { vec3, mat4, glMatrix } from "gl-matrix";

class Camera {
  // view matrix variables
  private _eyeVec: vec3;
  private _lookVec: vec3;
  private _upVec: vec3;
  private _rightVec: vec3;
  private viewFromWorldMat: mat4;
  private invViewMat: mat4;

  // projection matrix variables
  private _fovYDegrees: number;
  private fovYRadians: number;
  private _aspectRatio: number;
  private _nearPlane: number;
  private _farPlane: number;
  private perspectiveScreenFromViewMat: mat4;
  private perspectiveInvScaleMat: mat4;

  // orthographic matrix variables
  private _orthoLeft: number;
  private _orthoRight: number;
  private _orthoBottom: number;
  private _orthoTop: number;
  private _orthoNear: number;
  private _orthoFar: number;
  private orthographicScreenFromViewMat: mat4;
  private orthographicInvScaleMat: mat4;

  // combined matrices
  private perspectiveScreenFromWorldMat: mat4;
  private orthographicScreenFromWorldMat: mat4;
  private perspectiveInvScaleViewMat: mat4;
  private orthographicInvScaleViewMat: mat4;

  private usingOrthographic = false;

  constructor() {
    // view matrix variables
    this._eyeVec = vec3.create();
    this._lookVec = vec3.create();
    this._upVec = vec3.create();
    this._rightVec = vec3.create();
    this.viewFromWorldMat = mat4.create();
    this.invViewMat = mat4.create();

    // projection matrix variables
    this._fovYDegrees = 0.0;
    this.fovYRadians = 0.0;
    this._aspectRatio = 0.0;
    this._nearPlane = 0.0;
    this._farPlane = 0.0;
    this.perspectiveScreenFromViewMat = mat4.create();
    this.perspectiveInvScaleMat = mat4.create();

    // orthographic matrix variables
    this._orthoLeft = 0.0;
    this._orthoRight = 0.0;
    this._orthoBottom = 0.0;
    this._orthoTop = 0.0;
    this._orthoNear = 0.0;
    this._orthoFar = 0.0;
    this.orthographicScreenFromViewMat = mat4.create();
    this.orthographicInvScaleMat = mat4.create();

    // combined matrices
    this.perspectiveScreenFromWorldMat = mat4.create();
    this.orthographicScreenFromWorldMat = mat4.create();
    this.perspectiveInvScaleViewMat = mat4.create();
    this.orthographicInvScaleViewMat = mat4.create();

    this.usingOrthographic = false;

    this.lookAt(vec3.create(), vec3.fromValues(0, 0, -1));
    this.perspective(60, 1, 0.1, 1000);
    this.ortho(-1, 1, -1, 1);
  }

  get screenFromWorldMatrix(): mat4 {
    return this.usingOrthographic
      ? this.orthographicScreenFromWorldMat
      : this.perspectiveScreenFromWorldMat;
  }

  get screenFromViewMatrix(): mat4 {
    return this.usingOrthographic
      ? this.orthographicScreenFromViewMat
      : this.perspectiveScreenFromViewMat;
  }

  get viewFromWorldMatrix(): mat4 {
    return this.viewFromWorldMat;
  }

  get inverseScaleViewMatrix(): mat4 {
    return this.usingOrthographic
      ? this.orthographicInvScaleViewMat
      : this.perspectiveInvScaleViewMat;
  }

  get eyeVec(): vec3 {
    return vec3.copy(vec3.create(), this._eyeVec);
  }

  get lookVec(): vec3 {
    return vec3.copy(vec3.create(), this._lookVec);
  }

  get rightVec(): vec3 {
    return vec3.copy(vec3.create(), this._rightVec);
  }

  get upVec(): vec3 {
    return vec3.copy(vec3.create(), this._upVec);
  }

  get nearPlaneDist(): number {
    if (this.isOrthographic()) {
      return this._orthoNear;
    }
    return this._nearPlane;
  }

  get farPlaneDist(): number {
    if (this.isOrthographic()) {
      return this._orthoFar;
    }
    return this._farPlane;
  }

  isOrthographic(): boolean {
    return this.usingOrthographic;
  }

  lookAt(eye: vec3, point: vec3, up: vec3 = vec3.fromValues(0, 1, 0)): void {
    this._eyeVec = eye;
    this._upVec = up;

    vec3.sub(this._lookVec, point, this._eyeVec);
    vec3.normalize(this._lookVec, this._lookVec);

    vec3.cross(this._rightVec, this._lookVec, this._upVec);
    mat4.lookAt(this.viewFromWorldMat, this._eyeVec, point, this._upVec);
    mat4.invert(this.invViewMat, this.viewFromWorldMat);

    mat4.mul(
      this.perspectiveScreenFromWorldMat,
      this.perspectiveScreenFromViewMat,
      this.viewFromWorldMat
    );
    mat4.mul(
      this.orthographicScreenFromWorldMat,
      this.orthographicScreenFromViewMat,
      this.viewFromWorldMat
    );
    mat4.mul(
      this.perspectiveInvScaleViewMat,
      this.invViewMat,
      this.perspectiveInvScaleMat
    );
    mat4.mul(
      this.orthographicInvScaleViewMat,
      this.invViewMat,
      this.orthographicInvScaleMat
    );
  }

  perspective(
    fovyDegrees: number,
    aspect: number,
    zNear: number,
    zFar: number
  ): void {
    this._fovYDegrees = fovyDegrees;
    this.fovYRadians = glMatrix.toRadian(this._fovYDegrees);
    this._aspectRatio = aspect;
    this._nearPlane = zNear;
    this._farPlane = zFar;

    mat4.perspective(
      this.perspectiveScreenFromViewMat,
      this.fovYRadians,
      this._aspectRatio,
      this._nearPlane,
      this._farPlane
    );

    const h: number = this._farPlane * Math.tan(this.fovYRadians / 2.0);
    const w: number = this._aspectRatio * h;

    mat4.fromScaling(
      this.perspectiveInvScaleMat,
      vec3.fromValues(w, h, this._farPlane)
    );

    mat4.mul(
      this.perspectiveScreenFromWorldMat,
      this.perspectiveScreenFromViewMat,
      this.viewFromWorldMat
    );
    mat4.mul(
      this.perspectiveInvScaleViewMat,
      this.invViewMat,
      this.perspectiveInvScaleMat
    );
  }

  ortho(
    left: number,
    right: number,
    bottom: number,
    top: number,
    near: number = 0,
    far: number = 1
  ): void {
    this._orthoLeft = left;
    this._orthoRight = right;
    this._orthoBottom = bottom;
    this._orthoTop = top;
    this._orthoNear = near;
    this._orthoFar = far;

    mat4.ortho(
      this.orthographicScreenFromViewMat,
      this._orthoLeft,
      this._orthoRight,
      this._orthoBottom,
      this._orthoTop,
      this._orthoNear,
      this._orthoFar
    );

    const w: number = this._orthoRight - this._orthoLeft;
    const h: number = this._orthoTop - this._orthoBottom;

    mat4.fromScaling(
      this.orthographicInvScaleMat,
      vec3.fromValues(w / 2, h / 2, this._orthoFar)
    );

    mat4.mul(
      this.orthographicScreenFromWorldMat,
      this.orthographicScreenFromViewMat,
      this.viewFromWorldMat
    );
    mat4.mul(
      this.orthographicInvScaleViewMat,
      this.invViewMat,
      this.orthographicInvScaleMat
    );
  }

  setUsingOrthographic(usingOrthographic: boolean): void {
    this.usingOrthographic = usingOrthographic;
  }

  set eyeVec(eyeVec: vec3) {
    vec3.add(this._lookVec, eyeVec, this._lookVec);
    this.lookAt(eyeVec, this._lookVec, this._upVec);
  }

  set lookVec(lookVec: vec3) {
    vec3.add(this._lookVec, this._eyeVec, lookVec);
    this.lookAt(this._eyeVec, this._lookVec, this._upVec);
  }

  set upVec(upVec: vec3) {
    vec3.add(this._lookVec, this._eyeVec, this._lookVec);
    this.lookAt(this._eyeVec, this._lookVec, upVec);
  }

  set fovYDegrees(fovYDeg: number) {
    this.perspective(
      fovYDeg,
      this._aspectRatio,
      this._nearPlane,
      this._farPlane
    );
  }

  set aspectRatio(aspect: number) {
    this.perspective(
      this._fovYDegrees,
      aspect,
      this._nearPlane,
      this._farPlane
    );
  }

  set nearPlane(near: number) {
    this.perspective(
      this._fovYDegrees,
      this._aspectRatio,
      near,
      this._farPlane
    );
  }

  set farPlane(far: number) {
    this.perspective(
      this._fovYDegrees,
      this._aspectRatio,
      this._nearPlane,
      far
    );
  }

  set orthoLeft(orthoLeft: number) {
    this.ortho(
      orthoLeft,
      this._orthoRight,
      this._orthoBottom,
      this._orthoTop,
      this._orthoNear,
      this._orthoFar
    );
  }

  set orthoRight(orthoRight: number) {
    this.ortho(
      this._orthoLeft,
      orthoRight,
      this._orthoBottom,
      this._orthoTop,
      this._orthoNear,
      this._orthoFar
    );
  }

  set orthoBottom(orthoBottom: number) {
    this.ortho(
      this._orthoLeft,
      this._orthoRight,
      orthoBottom,
      this._orthoTop,
      this._orthoNear,
      this._orthoFar
    );
  }

  set orthoTop(orthoTop: number) {
    this.ortho(
      this._orthoLeft,
      this._orthoRight,
      this._orthoBottom,
      orthoTop,
      this._orthoNear,
      this._orthoFar
    );
  }

  set orthoNear(orthoNear: number) {
    this.ortho(
      this._orthoLeft,
      this._orthoRight,
      this._orthoBottom,
      this._orthoTop,
      orthoNear,
      this._orthoFar
    );
  }

  set orthoFar(orthoFar: number) {
    this.ortho(
      this._orthoLeft,
      this._orthoRight,
      this._orthoBottom,
      this._orthoTop,
      this._orthoNear,
      orthoFar
    );
  }
}

export { Camera };
