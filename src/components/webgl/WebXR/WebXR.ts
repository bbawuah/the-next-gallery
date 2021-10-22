import * as THREE from 'three';
import {VRButton} from './VRButton';
import type {ButtonStates, LeftController, RightController, XRProfile, Profile} from './types';
import {XRControllerModelFactory} from 'three/examples/jsm/webxr/XRControllerModelFactory.js';
import {
  Constants as MotionControllerConstants,
  fetchProfile
} from 'three/examples/jsm/libs/motion-controllers.module.js';

const DEFAULT_PROFILES_PATH = 'https://cdn.jsdelivr.net/npm/@webxr-input-profiles/assets@1.0/dist/profiles';
const DEFAULT_PROFILE = 'generic-trigger';
interface Props {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  particles: THREE.Points;
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
  private gamepadIndices: LeftController | RightController;
  private buttonStates: ButtonStates;
  private lightParticles: THREE.Points;
  private dolly: THREE.Object3D;
  private dummyCam: THREE.Object3D;

  constructor(props: Props) {
    this.renderer = props.renderer;
    this.camera = props.camera;
    this.scene = props.scene;
    this.lightParticles = props.particles;
    this.vrButton = new VRButton(this.renderer);
    this.clock = new THREE.Clock();
    this.raycaster = new THREE.Raycaster();
    this.workingMatrix = new THREE.Matrix4();
    this.controllers = this.buildControllers();

    this.renderer.xr.enabled = true;

    this.dolly = new THREE.Object3D();
    this.dolly.position.z = 5;
    this.dolly.add(this.camera);
    this.scene.add(this.dolly);

    this.dummyCam = new THREE.Object3D();
    this.camera.add(this.dummyCam);

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

      this.createButtonStates(info.right);
    });
  }

  private createButtonStates(components: LeftController | RightController) {
    const buttonStates: ButtonStates = {};
    this.gamepadIndices = components;

    Object.keys(components).forEach(key => {
      if (key.indexOf('touchpad') != -1 || key.indexOf('thumbstick') != -1) {
        buttonStates[key] = {button: 0, xAxis: 0, yAxis: 0};
      } else {
        buttonStates[key] = 0;
      }
    });

    this.buttonStates = buttonStates;
  }

  private onSelectStart(controller: THREE.Group) {
    controller.userData.selectPressed = true;
  }

  private onSelectEnd(controller: THREE.Group) {
    controller.userData.selectPressed = false;
  }

  // private updateGamepadState(): void {
  //   const session = this.renderer.xr.getSession();
  //   const inputSource = session.inputSources[0];

  //   if (inputSource && inputSource.gamepad && this.gamepadIndices && this.buttonStates) {
  //     const gamepad = inputSource.gamepad;

  //     try {
  //       Object.entries(this.buttonStates).forEach(([key, value]) => {
  //         const buttonIndex = this.gamepadIndices[key].button;

  //         if (key.indexOf('touchpad') != -1 || key.indexOf('thumbstick') != -1) {
  //           const xAxisIndex = this.gamepadIndices[key].xAxis;
  //           const yAxisIndex = this.gamepadIndices[key].yAxis;
  //           this.buttonStates[key].button = gamepad.buttons[buttonIndex].value;
  //           this.buttonStates[key].xAxis = gamepad.axes[xAxisIndex].toFixed(2);
  //           this.buttonStates[key].yAxis = gamepad.axes[yAxisIndex].toFixed(2);
  //         } else {
  //           this.buttonStates[key].button = gamepad.buttons[buttonIndex].value;
  //         }
  //       });
  //     } catch (e) {
  //       console.warn('An error occured setting up the UI');
  //     }
  //   }
  // }

  private handleController(controller: THREE.Group, dt: number) {
    if (controller.userData.selectPressed) {
      const speed = 2;
      console.log(-dt * speed);
      const quaternion = this.dolly.quaternion.clone();
      this.dolly.quaternion.copy(this.dummyCam.getWorldQuaternion(new THREE.Quaternion()));
      this.dolly.translateZ(-dt * speed);
      this.dolly.position.y = 0;
      this.dolly.quaternion.copy(quaternion);
    }
  }

  private render(): void {
    this.renderer.setAnimationLoop(() => {
      const deltaTime = this.clock.getDelta();
      const elapsedTime = this.clock.getElapsedTime();
      if (this.controllers) {
        this.handleController(this.controllers[0], deltaTime);
      }

      if (this.lightParticles) {
        (this.lightParticles.material as THREE.RawShaderMaterial).uniforms.u_time.value = elapsedTime;
      }
      this.renderer.render(this.scene, this.camera);
    });
  }
}
