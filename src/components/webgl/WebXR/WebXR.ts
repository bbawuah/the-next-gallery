import * as THREE from 'three';
import type {RenderTarget} from '../RenderTarget/RenderTarget';
import {VRButton} from './VRButton';
import {XRControllerModelFactory} from 'three/examples/jsm/webxr/XRControllerModelFactory';

interface Props {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
}

export class WebXR {
  private vrButton: VRButton;
  private clock: THREE.Clock;
  private raycaster: THREE.Raycaster;
  private workingMatrix: THREE.Matrix4;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private controllers: THREE.Group[];

  public bitmapText: RenderTarget;

  constructor(props: Props) {
    this.renderer = props.renderer;
    this.camera = props.camera;
    this.scene = props.scene;
    this.vrButton = new VRButton(this.renderer);
    this.clock = new THREE.Clock();
    this.raycaster = new THREE.Raycaster();
    this.workingMatrix = new THREE.Matrix4();
    this.controllers = this.buildControllers();

    this.renderer.xr.enabled = true;

    this.render();
  }

  private buildControllers(): THREE.Group[] {
    const controllerModelFactory = new XRControllerModelFactory();

    const geometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, -1)
    ]);

    const line = new THREE.Line(geometry);
    line.name = 'line';
    line.scale.z = 10;

    const controllers: THREE.Group[] = [];

    for (let i = 0; i <= 1; i++) {
      const controller = this.renderer.xr.getController(i);
      controller.add(line.clone());
      controller.userData.selectPressed = false;
      this.scene.add(controller);

      controllers.push(controller);

      const grip = this.renderer.xr.getControllerGrip(i);
      grip.add(controllerModelFactory.createControllerModel(grip));
      this.scene.add(grip);
    }

    return controllers;
  }

  // private handleController(controller: THREE.Group) {}

  private render(): void {
    this.renderer.setAnimationLoop(() => {
      const elapsedTime = this.clock.getElapsedTime();

      if (this.bitmapText && this.bitmapText.renderTarget && this.bitmapText.renderTargetMaterial) {
        (this.bitmapText.renderTargetMaterial as THREE.RawShaderMaterial).uniforms.u_time.value = elapsedTime;
      }
      this.renderer.render(this.scene, this.camera);
    });
  }
}
