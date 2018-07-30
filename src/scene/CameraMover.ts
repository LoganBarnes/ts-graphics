import { vec3, glMatrix } from "gl-matrix";
import { Ray3 } from "./Ray";
import { Camera } from "./Camera";

class CameraMover {
  private _camera: Camera;
  private yawRadians: number;
  private pitchRadians: number;
  private _offsetFromAnchor: number;
  private anchorPoint: vec3;

  constructor(camera: Camera) {
    this._camera = camera;
    this.yawRadians = 0;
    this.pitchRadians = 0;
    this._offsetFromAnchor = 5;
    this.anchorPoint = vec3.create();

    this._camera.lookAt(vec3.fromValues(0, 0, 5), this.anchorPoint);
  }

  get camera(): Camera {
    return this._camera;
  }

  pan(translation: vec3): void {
    vec3.add(this.anchorPoint, this.anchorPoint, translation);
    this.updateCamera();
  }

  yaw(degrees: number): void {
    this.yawRadians += glMatrix.toRadian(degrees);
    this.yawRadians = this.yawRadians % (Math.PI * 2);
    this.updateCamera();
  }

  pitch(degrees: number): void {
    this.pitchRadians += glMatrix.toRadian(degrees);
    this.pitchRadians = Math.max(-Math.PI / 2.01, this.pitchRadians);
    this.pitchRadians = Math.min(Math.PI / 2.01, this.pitchRadians);
    this.updateCamera();
  }

  zoom(distance: number): void {
    this._offsetFromAnchor = Math.max(0, this._offsetFromAnchor - distance);
    this.updateCamera();
  }

  set offsetFromAnchor(offsetFromAnchor: number) {
    this._offsetFromAnchor = offsetFromAnchor;
    this.updateCamera();
  }

  private updateCamera(): void {
    const zero: vec3 = vec3.create();

    let eye: vec3 = vec3.fromValues(0, 0, this._offsetFromAnchor);
    let pnt: vec3 = vec3.fromValues(0, 0, -1);

    vec3.rotateX(eye, eye, zero, this.pitchRadians);
    vec3.rotateX(pnt, pnt, zero, this.pitchRadians);

    vec3.rotateY(eye, eye, zero, this.yawRadians);
    vec3.rotateY(pnt, pnt, zero, this.yawRadians);

    vec3.add(eye, eye, this.anchorPoint);
    vec3.add(pnt, pnt, this.anchorPoint);

    this._camera.lookAt(eye, pnt);
  }

  intersectPlaneAtAnchor(ray: Ray3): vec3 | null {
    // plane at p with normal n
    let n: vec3 = this._camera.lookVec;
    vec3.scale(n, n, -1.0);

    const p: vec3 = vec3.copy(vec3.create(), this.anchorPoint);

    // plane ray intersection
    const denom: number = vec3.dot(ray.direction, n);

    vec3.sub(p, p, ray.origin);
    const t: number = vec3.dot(p, n) / denom;

    if (t >= 0.0 && t !== Number.POSITIVE_INFINITY) {
      return vec3.scaleAndAdd(vec3.create(), ray.origin, ray.direction, t);
    }
    return null;
  }
}

export { CameraMover };
