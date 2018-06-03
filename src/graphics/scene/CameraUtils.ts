import { vec2, vec3 } from 'gl-matrix';
import { Camera } from '@/graphics/scene/Camera';
import { Ray3 } from '@/graphics/scene/Ray';

class CameraUtils {
  static getClipspacePos(screenX: number, screenY: number, viewWidth: number, viewHeight: number) {
    let p: vec2 = vec2.fromValues(screenX / viewWidth, -screenY / viewHeight);
    vec2.scaleAndAdd(p, vec2.fromValues(-1, 1), p, 2.0);
    return p;
  }

  static getRayFromScreenPos(
    camera: Camera,
    screenX: number,
    screenY: number,
    viewWidth: number,
    viewHeight: number,
    perspective: boolean = true
  ): Ray3 {

    let clipP: vec2 = this.getClipspacePos(screenX, screenY, viewWidth, viewHeight);

    if (camera.isOrthographic()) {
      const clipNearPoint: vec3 = vec3.fromValues(clipP[0], clipP[1], 0);

      let worldNearPoint: vec3 = vec3.create();
      vec3.transformMat4(
        worldNearPoint, clipNearPoint, camera.inverseScaleViewMatrix
      );

      const direction: vec3 = camera.lookVec;
      const origin: vec3 = vec3.create();
      vec3.scaleAndAdd(origin, worldNearPoint, direction, camera.nearPlaneDist);

      return new Ray3(origin, direction);
    }

    // perspective
    const clipFarPoint: vec3 = vec3.fromValues(clipP[0], clipP[1], -1);

    let worldFarPoint: vec3 = vec3.create();
    vec3.transformMat4(
      worldFarPoint, clipFarPoint, camera.inverseScaleViewMatrix
    );

    const origin: vec3 = camera.eyeVec;
    let direction: vec3 = vec3.create();
    vec3.sub(direction, worldFarPoint, origin);
    vec3.normalize(direction, direction);

    return new Ray3(origin, direction);
  }
}

export { CameraUtils };
