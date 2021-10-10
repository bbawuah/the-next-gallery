import {PointerLockControls} from 'three/examples/jsm/controls/PointerLockControls';
import {DeviceOrientationControls} from 'three/examples/jsm/controls/DeviceOrientationControls.js';

export class Events {
  private pointerLockerControls: PointerLockControls;
  public deviceOrientationControls: DeviceOrientationControls;

  private _forward: boolean;
  private _backward: boolean;
  private _left: boolean;
  private _right: boolean;

  public walkingSpeed: number;

  constructor(camera: THREE.PerspectiveCamera, el: HTMLCanvasElement, isMobileDevice: boolean) {
    this._forward = false;
    this._backward = false;
    this._left = false;
    this._right = false;

    this.walkingSpeed = 5;

    if (isMobileDevice) {
      this.deviceOrientationControls = new DeviceOrientationControls(camera);
    } else {
      this.pointerLockerControls = new PointerLockControls(camera, el);
    }
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

  public handleKeyUpEvents(): void {
    window.addEventListener('keyup', e => {
      if (this.pointerLockerControls && e.key === 'Enter') {
        this.pointerLockerControls.lock();
      }

      if (e.key === 'ArrowDown') {
        this.backward = false;
      }

      if (e.key === 'ArrowUp') {
        this.forward = false;
      }

      if (e.key === 'ArrowLeft') {
        this.left = false;
      }

      if (e.key === 'ArrowRight') {
        this.right = false;
      }
    });
  }

  public handleKeyDownEvents(): void {
    window.addEventListener('keydown', e => {
      if (e.key === 'ArrowDown') {
        this.backward = true;
      }

      if (e.key === 'ArrowUp') {
        this.forward = true;
      }

      if (e.key === 'ArrowLeft') {
        this.left = true;
      }

      if (e.key === 'ArrowRight') {
        this.right = true;
      }
    });
  }
}
