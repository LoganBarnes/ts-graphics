import { Camera } from './Camera';

abstract class Updatable {
  abstract onUpdate(timestep: number): void;
}

abstract class Renderable {
  abstract onRender(camera: Camera, scene: Scene): void;
}

enum DisplayMode {
  POSITION,
  NORMALS,
  TEX_COORDS,
  VERTEX_COLOR,
  SHAPE_COLOR,
  WHITE,
  NUM_MODES
}

class Scene {
  private toUpdate: Updatable[];
  private toRender: Renderable[];
  private _displayMode: DisplayMode;

  constructor() {
    this.toUpdate = [];
    this.toRender = [];
    this._displayMode = DisplayMode.NORMALS;
  }

  onUpdate(timestep: number): void {
    this.toUpdate.forEach(item => item.onUpdate(timestep));
  }

  onRender(camera: Camera): void {
    this.toRender.forEach(item => item.onRender(camera, this));
  }

  addItemToUpdate(item: Updatable): void {
    this.toUpdate.push(item);
  }

  addItemToRender(item: Renderable): void {
    this.toRender.push(item);
  }

  get displayMode(): DisplayMode {
    return this._displayMode;
  }

  set displayMode(mode: DisplayMode) {
    this._displayMode = mode;
  }
}

export { Updatable, Renderable, DisplayMode, Scene };
export default Scene;
