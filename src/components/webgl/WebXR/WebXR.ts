import * as THREE from 'three';
import {VRButton} from './VRButton';
import type {ButtonStates, LeftController, RightController, XRProfile, Profile} from './types';
import {XRControllerModelFactory} from 'three/examples/jsm/webxr/XRControllerModelFactory.js';
import {fetchProfile} from 'three/examples/jsm/libs/motion-controllers.module.js';
import {TeleportMesh} from './TeleportMesh';

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
  private origin: THREE.Vector3;
  private teleports: TeleportMesh[];
  private collisionObjects: THREE.Object3D[];

  constructor(props: Props) {
    this.renderer = props.renderer;
    this.camera = props.camera;
    this.scene = props.scene;
    this.lightParticles = props.particles;
    this.vrButton = new VRButton(this.renderer);

    this.clock = new THREE.Clock();
    this.raycaster = new THREE.Raycaster();
    this.workingMatrix = new THREE.Matrix4();

    this.renderer.xr.enabled = true;

    this.dolly = new THREE.Object3D();
    this.dolly.add(this.camera);
    this.scene.add(this.dolly);
    this.origin = new THREE.Vector3();

    this.dummyCam = new THREE.Object3D();
    this.camera.add(this.dummyCam);
    this.controllers = this.buildControllers();

    const locations: THREE.Vector3[] = [
      new THREE.Vector3(-1.4411578358044423, 0, -12.7902673661434),
      new THREE.Vector3(1.408202185061461, 0, -14.59596980904186),
      new THREE.Vector3(2.2322463246114808, 0, -20.022498424597057),
      new THREE.Vector3(-0.7143463136406428, 0, -20.884178077483437),
      new THREE.Vector3(3.8957668683477857, 0, -22.997137183792685),
      new THREE.Vector3(-2.7715808064437817, 0, -24.06950431854075),
      new THREE.Vector3(-14.184811972111136, 0, -25.192878140758882),
      new THREE.Vector3(-13.645796824317507, 0, -16.84230505197753),
      new THREE.Vector3(-13.65444636702242, 0, -8.824376425299347),
      new THREE.Vector3(-13.365366711325443, 0, 0.06779025505478342),
      new THREE.Vector3(-13.472713912090512, 0, 14.16126213479785),
      new THREE.Vector3(-13.223165346946413, 0, 23.094053460188935),
      new THREE.Vector3(13.848622389704037, 0, 25.487481232138368),
      new THREE.Vector3(13.330024885178467, 0, 14.921956753477273),
      new THREE.Vector3(13.709804551512184, 0, 7.6775593300571865),
      new THREE.Vector3(13.451456302717393, 0, -0.8678559898471846),
      new THREE.Vector3(13.740666875752018, 0, -8.848286348883995),
      new THREE.Vector3(13.767639616866397, -17.14089751761281)
    ];

    this.teleports = [];

    locations.forEach(location => {
      const teleport = new TeleportMesh();
      teleport.position.copy(location);
      this.scene.add(teleport);
      this.teleports.push(teleport);
    });

    this.collisionObjects = [];
    this.teleports.forEach(teleport => this.collisionObjects.push(teleport.children[0]));

    this.render();
  }

  private createMarker(geometry: THREE.BufferGeometry, material: THREE.Material): THREE.Mesh {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.visible = false;
    this.scene.add(mesh);
    return mesh;
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

    const geometry2 = new THREE.SphereGeometry(0.5, 8, 6);
    const material = new THREE.MeshBasicMaterial({color: 0xff0000});

    const controllers: THREE.Group[] = [];

    for (let i = 0; i <= 1; i++) {
      const controller = this.renderer.xr.getController(i);
      controller.add(line.clone());
      controller.userData.selectPressed = false;
      controller.userData.marker = this.createMarker(geometry2, material);
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

  private onSelectStart(controller: THREE.Group) {
    controller.userData.selectPressed = true;
    if (controller.userData.teleport) {
      this.dolly.position.copy(controller.userData.teleport.position);
      this.teleports.forEach(teleport => teleport.fadeOut(0.5));
    } else if (controller.userData.marker.visible) {
      const pos = controller.userData.marker.position;
      console.log(`${pos.x.toFixed(3)}, ${pos.y.toFixed(3)}, ${pos.z.toFixed(3)}`);
    }
  }

  private onSelectEnd(controller: THREE.Group) {
    controller.userData.selectPressed = false;
  }

  private onSqueezeStart(controller: THREE.Group) {
    controller.userData.squeezePressed = false;
    this.teleports.forEach(teleport => teleport.fadeIn(1));
  }

  private onSqueezeEnd(controller: THREE.Group) {
    controller.userData.squeezePressed = true;
    this.teleports.forEach(teleport => teleport.fadeOut(1));
  }

  private intersectObjects(controller: THREE.Group): void {
    const line = controller.getObjectByName('ray');
    this.workingMatrix.identity().extractRotation(controller.matrixWorld);

    this.raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);
    this.raycaster.ray.direction.set(0, 0, -1).applyMatrix4(this.workingMatrix);

    const intersects = this.raycaster.intersectObjects(this.collisionObjects);
    const marker = controller.userData.marker;
    marker.visible = false;

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
      const deltaTime = this.clock.getDelta();
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
