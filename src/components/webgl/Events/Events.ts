import {PointerLockControls} from 'three/examples/jsm/controls/PointerLockControls';
import {DeviceOrientationControls} from 'three/examples/jsm/controls/DeviceOrientationControls.js';

export class Events {
  private pointerLockerControls: PointerLockControls;
  public deviceOrientationControls: DeviceOrientationControls;
  private isMobile: boolean;

  public forward: boolean;
  public backward: boolean;
  public left: boolean;
  public right: boolean;
  public walkingSpeed: number;

  constructor(camera: THREE.PerspectiveCamera, el: HTMLCanvasElement) {
    this.forward = false;
    this.backward = false;
    this.left = false;
    this.right = false;

    this.walkingSpeed = 5;

    if (this.isMobile) {
      this.deviceOrientationControls = new DeviceOrientationControls(camera);
    } else {
      this.pointerLockerControls = new PointerLockControls(camera, el);
    }
  }

  public handleKeyUpEvents(): void {
    window.addEventListener('keyup', e => {
      if (e.key === 'Enter') {
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
