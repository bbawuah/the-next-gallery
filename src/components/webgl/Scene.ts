import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import {PointerLockControls} from 'three/examples/jsm/controls/PointerLockControls';
import type {GLTF} from 'three/examples/jsm/loaders/GLTFLoader';
import {DRACOLoader} from 'three/examples/jsm/loaders/DRACOLoader';
import type {Sizes} from './types';
import * as CANNON from 'cannon-es';
import CannonDebugRenderer from '../../cannonDebugger/cannonDebuger';

const sizes: Sizes = {
  width: window.innerWidth,
  height: window.innerHeight
};

const portraitNames = [
  'dalis',
  'jamil',
  'porchia',
  'junior',
  'kwame',
  'soraja',
  'samantha',
  'darryl',
  'les',
  'terry-afram',
  'tonny',
  'kenneth',
  'mirella',
  'crystalina',
  'bonsu',
  'eben',
  'jaysi',
  'meester-kwame',
  'crystalina',
  'ronald',
  'eoboafo',
  'shaneequa',
  'churchbwoygram',
  'othnell',
  'branco'
];

export class Scene {
  private renderer: THREE.WebGLRenderer;
  private camera: THREE.PerspectiveCamera;
  private scene: THREE.Scene;
  private controls: OrbitControls;
  private material: THREE.MeshBasicMaterial;
  private mesh: THREE.Mesh;

  // Loader
  private gltfLoader: GLTFLoader;
  private dracoLoader: DRACOLoader;
  private textureLoader: THREE.TextureLoader;
  private pointerLockerControls: PointerLockControls;

  // Textures
  private bakedTexture: THREE.Texture;

  // Physics
  private physicsWorld: CANNON.World;
  private sphereBody: CANNON.Body;
  private planeBody: CANNON.Body;
  private planeShape: CANNON.Shape;

  // Debugger
  private cannonDebugRenderer: CannonDebugRenderer;

  // Movement
  private forward: boolean;
  private backward: boolean;
  private left: boolean;
  private right: boolean;
  private walkingSpeed: number;
  private frontVector: THREE.Vector3;
  private sideVector: THREE.Vector3;
  private userDirection: THREE.Vector3;
  private clock: THREE.Clock;

  constructor(el: HTMLCanvasElement) {
    this.renderer = new THREE.WebGLRenderer({
      canvas: el
    });

    this.renderer.setSize(sizes.width, sizes.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.outputEncoding = THREE.sRGBEncoding;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xffffff);

    this.camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
    this.camera.position.z = 4;
    this.camera.position.y = 1;

    this.textureLoader = new THREE.TextureLoader();
    this.bakedTexture = this.textureLoader.load('./static/map.jpg');
    this.bakedTexture.flipY = false;
    this.bakedTexture.encoding = THREE.sRGBEncoding;

    this.material = new THREE.MeshBasicMaterial({map: this.bakedTexture});

    if (this.mesh) {
      this.scene.add(this.mesh);
    }

    this.controls = new OrbitControls(this.camera, el);
    this.pointerLockerControls = new PointerLockControls(this.camera, el);

    this.dracoLoader = new DRACOLoader();
    this.dracoLoader.setDecoderPath('draco/');

    this.gltfLoader = new GLTFLoader();
    this.gltfLoader.load('./static/museum.glb', gltf => {
      console.log(gltf.scenes);
      gltf.scene.traverse(child => {
        (child as THREE.Mesh).material = this.material;
      });

      const darkGrey = new THREE.MeshBasicMaterial({color: new THREE.Color(0x9b9b9b)});
      // Not sure if I am going to use this
      const stairs = gltf.scene.children.find(child => child.name === 'treden') as THREE.Mesh;
      stairs.material = darkGrey;

      const portraitsSides = gltf.scene.children.find(child => child.name === 'randen') as THREE.Mesh;
      portraitsSides.material = darkGrey;

      this.addPortrets(gltf);
      this.addMeta(gltf);
      this.scene.add(gltf.scene);
    });

    this.physicsWorld = new CANNON.World();
    this.physicsWorld.broadphase = new CANNON.SAPBroadphase(this.physicsWorld);
    this.physicsWorld.gravity = new CANNON.Vec3(0, -30, 0);

    this.sphereBody = new CANNON.Body({
      mass: 1,
      type: CANNON.Body.DYNAMIC,
      position: new CANNON.Vec3(0, 2, -5),
      shape: new CANNON.Sphere(1)
    });

    this.planeBody = new CANNON.Body({
      position: new CANNON.Vec3(0, 0.5, 0),
      shape: new CANNON.Plane()
    });

    this.planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);

    this.physicsWorld.addBody(this.sphereBody);
    this.physicsWorld.addBody(this.planeBody);

    this.forward = false;
    this.backward = false;
    this.left = false;
    this.right = false;

    this.walkingSpeed = 7.5;

    this.clock = new THREE.Clock();

    this.cannonDebugRenderer = new CannonDebugRenderer(this.scene, this.physicsWorld);

    this.gltfLoader.setDRACOLoader(this.dracoLoader);

    this.resize();
    this.handleKeyUpEvents();
    this.handleKeyDownEvents();
    this.render();
  }

  handleKeyUpEvents(): void {
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

  handleKeyDownEvents(): void {
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

  resize(): void {
    window.addEventListener('resize', () => {
      // Update sizes
      sizes.width = window.innerWidth;
      sizes.height = window.innerHeight;

      // Update camera
      this.camera.aspect = sizes.width / sizes.height;
      this.camera.updateProjectionMatrix();

      // Update renderer
      this.renderer.setSize(sizes.width, sizes.height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });
  }

  addPortrets(gltfScene: GLTF): void {
    portraitNames.forEach(name => {
      const portrait = this.textureLoader.load(`./static/photos/${name}.jpg`);
      portrait.flipY = false;
      portrait.minFilter = THREE.LinearFilter;
      const material = new THREE.MeshBasicMaterial({map: portrait});

      const mesh = gltfScene.scene.children.find(child => child.name === name) as THREE.Mesh;

      mesh.material = material;
    });
  }

  addMeta(gltfScene: GLTF): void {
    portraitNames.forEach(name => {
      const meta = this.textureLoader.load(`./static/photos/${name}-meta.png`);
      meta.flipY = false;
      const material = new THREE.MeshBasicMaterial({map: meta});

      const mesh = gltfScene.scene.children.find(child => child.name === `${name}-meta`) as THREE.Mesh;
      mesh.material = material;
    });
  }

  render(): void {
    this.frontVector = new THREE.Vector3(0, 0, Number(this.backward) - Number(this.forward));
    this.sideVector = new THREE.Vector3(Number(this.left) - Number(this.right), 0, 0);

    this.userDirection = new THREE.Vector3();

    this.userDirection
      .subVectors(this.frontVector, this.sideVector)
      .normalize()
      .multiplyScalar(this.walkingSpeed)
      .applyEuler(this.camera.rotation);

    this.cannonDebugRenderer.update();

    if (this.physicsWorld) {
      this.camera.position.copy(
        new THREE.Vector3(this.sphereBody.position.x, this.sphereBody.position.y, this.sphereBody.position.z)
      );
      this.sphereBody.velocity.set(this.userDirection.x, 0, this.userDirection.z);
      this.physicsWorld.step(Math.min(this.clock.getDelta(), 0.1));
    }

    this.renderer.render(this.scene, this.camera);
    window.requestAnimationFrame(() => this.render());
  }
}
