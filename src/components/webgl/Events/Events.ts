import * as THREE from 'three';
import {store} from '../../../store/store';

export class Events {
  private _forward: boolean;
  private _backward: boolean;
  private _left: boolean;
  private _right: boolean;
  private playerIsInScene: boolean;
  private frontVector: THREE.Vector3;
  private sideVector: THREE.Vector3;

  public userDirection: THREE.Vector3;
  public walkingSpeed: number;

  constructor(camera: THREE.PerspectiveCamera) {
    this._forward = false;
    this._backward = false;
    this._left = false;
    this._right = false;

    this.walkingSpeed = 1.85;

    store.currentSession.subscribe(value => {
      this.playerIsInScene = value;
    });

    this.render(camera);
  }

  get backward(): boolean {
    return this._backward;
  }

  set backward(value: boolean) {
    this._backward = value;
  }

  get forward(): boolean {
    return this._forward;
  }

  set forward(value: boolean) {
    this._forward = value;
  }

  get left(): boolean {
    return this._left;
  }

  set left(value: boolean) {
    this._left = value;
  }

  get right(): boolean {
    return this._right;
  }

  set right(value: boolean) {
    this._right = value;
  }

  private handleUserDirection(camera: THREE.PerspectiveCamera): void {
    this.frontVector = new THREE.Vector3(0, 0, Number(this.backward) - Number(this.forward));
    this.sideVector = new THREE.Vector3(Number(this.left) - Number(this.right), 0, 0);

    this.userDirection = new THREE.Vector3();

    this.userDirection
      .subVectors(this.frontVector, this.sideVector)
      .normalize()
      .multiplyScalar(this.walkingSpeed)
      .applyEuler(camera.rotation);
  }

  private render(camera: THREE.PerspectiveCamera): void {
    const _camera = camera;
    this.handleUserDirection(camera);

    window.requestAnimationFrame(() => this.render(_camera));
  }

  public handleKeyUpEvents(): void {
    window.addEventListener('keyup', e => {
      if (e.key === 's') {
        this.backward = false;
      }

      if (e.key === 'w') {
        this.forward = false;
      }

      if (e.key === 'a') {
        this.left = false;
      }

      if (e.key === 'd') {
        this.right = false;
      }
    });
  }

  public handleKeyDownEvents(): void {
    window.addEventListener('keydown', e => {
      if (this.playerIsInScene) {
        if (e.key === 's') {
          this.backward = true;
        }

        if (e.key === 'w') {
          this.forward = true;
        }

        if (e.key === 'a') {
          this.left = true;
        }

        if (e.key === 'd') {
          this.right = true;
        }
      }
    });
  }
}
