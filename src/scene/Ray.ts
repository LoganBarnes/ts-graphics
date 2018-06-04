import { vec2, vec3 } from 'gl-matrix';

class Ray2 {
    public origin: vec2;
    public direction: vec2;

    constructor(origin: vec2, direction: vec2) {
        this.origin = origin;
        this.direction = direction;
    }
}

class Ray3 {
    public origin: vec3;
    public direction: vec3;

    constructor(origin: vec3, direction: vec3) {
        this.origin = origin;
        this.direction = direction;
    }
}

export { Ray2, Ray3 };
