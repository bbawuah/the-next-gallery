import * as THREE from 'three';
import {VRButton} from './VRButton';
import type {ButtonStates, LeftController, RightController} from './types';
import {XRControllerModelFactory} from 'three/examples/jsm/webxr/XRControllerModelFactory.js';
import {TeleportMesh} from './TeleportMesh';
import {portraitNames} from '../../../utils/metaData';
import {store} from '../../../store/store';
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
  private teleports: TeleportMesh[];
  private collisionObjects: THREE.Object3D[];

  constructor(props: Props) {
    this.renderer = props.renderer;
    this.camera = props.camera;
    this.scene = props.scene;
    this.lightParticles = props.particles;

    this.clock = new THREE.Clock();
    this.raycaster = new THREE.Raycaster();
    this.workingMatrix = new THREE.Matrix4();

    this.teleports = [];
    this.collisionObjects = [];

    this.vrButton = new VRButton(this.renderer);

    this.initializeWebXR();
  }

  private initializeWebXR(): void {
    this.renderer.xr.enabled = true;

    this.dolly = new THREE.Object3D();
    this.dolly.add(this.camera);
    this.dolly.position.y = 0.8;

    store.vrSession.subscribe(v => {
      if (v) {
        this.dolly.position.x = 3;
        this.dolly.position.z = 3;
      }
    });

    this.scene.add(this.dolly);

    this.dummyCam = new THREE.Object3D();
    this.camera.add(this.dummyCam);
    this.controllers = this.buildControllers();

    store.vrSession.subscribe(v => {
      if (v) {
        portraitNames.forEach(location => {
          const teleport = new TeleportMesh();
          teleport.position.copy(location.coordinates);
          this.scene.add(teleport);
          this.teleports.push(teleport);
        });

        this.teleports.forEach(teleport => this.collisionObjects.push(teleport.children[0]));
      }
    });

    this.render();
  }

  private buildControllers(): THREE.Group[] {
    const controllerModelFactory = new XRControllerModelFactory();

    const geometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, -1)
    ]);

    const line = new THREE.Line(geometry);
    line.name = 'ray';
    line.scale.z = 10;

    const controllers: THREE.Group[] = [];

    for (let i = 0; i <= 1; i++) {
      const controller = this.renderer.xr.getController(i);
      controller.add(line.clone());
      controller.userData.selectPressed = false;
      this.scene.add(controller);
      controllers.push(controller);
      this.dolly.add(controller);

      const grip = this.renderer.xr.getControllerGrip(i);
      grip.add(controllerModelFactory.createControllerModel(grip));
      this.scene.add(grip);
      this.dolly.add(grip);
    }
    controllers.forEach(controller => {
      controller.addEventListener('selectstart', event => this.onSelectStart(event.target));
      controller.addEventListener('selectend', event => this.onSelectEnd(event.target));
      controller.addEventListener('squeezestart', event => this.onSqueezeStart(event.target));
      controller.addEventListener('squeezeend', event => this.onSqueezeEnd(event.target));
    });

    return controllers;
  }

  private onSelectStart(controller: THREE.Group): void {
    controller.userData.selectPressed = true;
    if (controller.userData.teleport) {
      this.dolly.position.copy(controller.userData.teleport.position);
      this.teleports.forEach(teleport => teleport.fadeOut(0.5));
    }
  }

  private onSelectEnd(controller: THREE.Group): void {
    controller.userData.selectPressed = false;
  }

  private onSqueezeStart(controller: THREE.Group): void {
    controller.userData.squeezePressed = false;
    this.teleports.forEach(teleport => teleport.fadeIn(1));
  }

  private onSqueezeEnd(controller: THREE.Group): void {
    controller.userData.squeezePressed = true;
    this.teleports.forEach(teleport => teleport.fadeOut(1));
  }

  private intersectObjects(controller: THREE.Group): void {
    const line = controller.getObjectByName('ray');
    this.workingMatrix.identity().extractRotation(controller.matrixWorld);

    this.raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);
    this.raycaster.ray.direction.set(0, 0, -1).applyMatrix4(this.workingMatrix);

    const intersects = this.raycaster.intersectObjects(this.collisionObjects);

    controller.userData.teleport = undefined;

    if (intersects.length > 0) {
      const intersect = intersects[0];
      line.scale.z = intersect.distance;

      if (intersect.object.parent && intersect.object.parent instanceof TeleportMesh) {
        intersect.object.parent.selected = true;
        controller.userData.teleport = intersect.object.parent;
      }
    }
  }

  private render(): void {
    this.renderer.setAnimationLoop(() => {
      const elapsedTime = this.clock.getElapsedTime();

      this.teleports.forEach(teleport => {
        teleport.selected = false;
        teleport.update();
      });

      this.controllers.forEach(controller => {
        this.intersectObjects(controller);
      });
      if (this.lightParticles) {
        (this.lightParticles.material as THREE.RawShaderMaterial).uniforms.u_time.value = elapsedTime;
      }

      this.renderer.render(this.scene, this.camera);
    });
  }
}
