import * as THREE from 'three';
import {VRButton} from './VRButton';
import type {XRProfile} from './types';
import {XRControllerModelFactory} from 'three/examples/jsm/webxr/XRControllerModelFactory.js';
import {
  Constants as MotionControllerConstants,
  fetchProfile,
  MotionController
} from 'three/examples/jsm/libs/motion-controllers.module.js';

const DEFAULT_PROFILES_PATH = 'https://cdn.jsdelivr.net/npm/@webxr-input-profiles/assets@1.0/dist/profiles';
const DEFAULT_PROFILE = 'generic-trigger';
interface Props {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
}

interface Profile {
  name?: string;
  targetRayMode?: string;
  layouts?: string;
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
      controller.addEventListener('connected', event => this.onConnected(event));
      this.scene.add(controller);

      controllers.push(controller);

      const grip = this.renderer.xr.getControllerGrip(i);
      grip.add(controllerModelFactory.createControllerModel(grip));
      this.scene.add(grip);
    }
    controllers.forEach(controller => {
      controller.addEventListener('selectstart', event => this.onSelectStart(event.target));
      controller.addEventListener('selectend', event => this.onSelectEnd(event.target));
    });

    return controllers;
  }

  private onConnected(event: THREE.Event): void {
    const info: Profile = {};

    fetchProfile(event.data, DEFAULT_PROFILES_PATH, DEFAULT_PROFILE).then(({profile, assethPath}) => {
      const typedProfile = profile as XRProfile;
      info.name = typedProfile.profileId as string;
      info.targetRayMode = event.data.targetRayMode as string;

      Object.entries(typedProfile.layouts).forEach(([key, layout]) => {
        const components = {};

        Object.values(layout.components as any[]).forEach(component => {
          components[component.rootNodeName] = component.gamepadIndices;
        });

        info[key] = components;
      });
    });
  }

  private createButtonStates(components) {
    const buttonStates = {};

    Object.keys(components).forEach(key => {
      if (key.indexOf('touchpad') != -1 || key.indexOf('thumbstick') != -1) {
        buttonStates[key] = {button: 0, xAxis: 0, yAxis: 0};
      } else {
        buttonStates[key] = 0;
      }
    });
  }

  private onSelectStart(controller: THREE.Group) {
    controller.userData.selectPressed = true;
  }

  private onSelectEnd(controller: THREE.Group) {
    controller.userData.selectPressed = false;
  }

  private handleController(controller: THREE.Group) {
    if (controller.userData.selectPressed) {
      controller.children[0].scale.z = 10;

      this.workingMatrix.identity().extractRotation(controller.matrixWorld);

      this.raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);

      this.raycaster.ray.direction.set(0, 0, -1).applyMatrix4(controller.matrixWorld);

      // const intersects = this.raycaster.intersectObjects(this.r)
    }
  }

  private render(): void {
    this.renderer.setAnimationLoop(() => {
      this.renderer.render(this.scene, this.camera);
    });
  }
}
