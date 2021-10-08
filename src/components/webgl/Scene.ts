import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import type {GLTF} from 'three/examples/jsm/loaders/GLTFLoader';
import {DRACOLoader} from 'three/examples/jsm/loaders/DRACOLoader';
import type {Sizes} from './types';
import {KeyEvents} from './Events/KeyEvents';
import {PhysicsWorld} from './Physics/Physics';
import Stats from 'stats-js';

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

const stats = new Stats();

stats.showPanel(1); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);
export class Scene {
  private renderer: THREE.WebGLRenderer;
  private camera: THREE.PerspectiveCamera;
  private scene: THREE.Scene;

  // Development
  private controls: OrbitControls;

  private material: THREE.MeshBasicMaterial;
  private mesh: THREE.Mesh;

  // Loader
  private gltfLoader: GLTFLoader;
  private dracoLoader: DRACOLoader;
  private textureLoader: THREE.TextureLoader;

  // Textures
  private bakedTexture: THREE.Texture;

  // Physics
  private physics: PhysicsWorld;

  private frontVector: THREE.Vector3;
  private sideVector: THREE.Vector3;
  private userDirection: THREE.Vector3;
  private clock: THREE.Clock;

  private keyEvents: KeyEvents;

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

    this.keyEvents = new KeyEvents(this.camera, el);
    this.physics = new PhysicsWorld(this.scene);

    this.material = new THREE.MeshBasicMaterial({map: this.bakedTexture});

    if (this.mesh) {
      this.scene.add(this.mesh);
    }

    this.controls = new OrbitControls(this.camera, el);

    this.dracoLoader = new DRACOLoader();
    this.dracoLoader.setDecoderPath('draco/');

    this.gltfLoader = new GLTFLoader();
    this.gltfLoader.setDRACOLoader(this.dracoLoader);
    this.gltfLoader.load('./static/museum.glb', gltf => {
      gltf.scene.traverse(child => {
        (child as THREE.Mesh).material = this.material;
      });

      const darkGrey = new THREE.MeshBasicMaterial({color: new THREE.Color(0x9b9b9b)});

      const stairs = gltf.scene.children.find(child => child.name === 'treden') as THREE.Mesh;
      stairs.material = darkGrey;
      this.physics.createPhysics(stairs);

      const portraitsSides = gltf.scene.children.find(child => child.name === 'randen') as THREE.Mesh;
      portraitsSides.material = darkGrey;

      const metaSides = gltf.scene.children.find(child => child.name === 'namenbordjes-randen') as THREE.Mesh;
      metaSides.material = darkGrey;

      const shaderSchilderij = gltf.scene.children.find(child => child.name === 'shader-schilderij') as THREE.Mesh;
      shaderSchilderij.material = new THREE.MeshBasicMaterial({color: 0xff0000});

      const looseWalls = gltf.scene.children.find(child => child.name === 'losse-muren') as THREE.Mesh;
      this.physics.createPhysics(looseWalls);

      const handrail = gltf.scene.children.find(child => child.name === 'trapLeuning') as THREE.Mesh;
      handrail.material = darkGrey;

      this.addPortrets(gltf);
      this.addMeta(gltf);
      this.scene.add(gltf.scene);
    });

    this.clock = new THREE.Clock();

    this.keyEvents.handleKeyUpEvents();
    this.keyEvents.handleKeyDownEvents();
    this.resize();
    this.render();
  }

  private resize(): void {
    window.addEventListener('resize', () => {
      sizes.width = window.innerWidth;
      sizes.height = window.innerHeight;

      this.camera.aspect = sizes.width / sizes.height;
      this.camera.updateProjectionMatrix();

      this.renderer.setSize(sizes.width, sizes.height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });
  }

  private addPortrets(gltfScene: GLTF): void {
    portraitNames.forEach(name => {
      const portrait = this.textureLoader.load(`./static/photos/${name}.jpg`);
      portrait.flipY = false;
      portrait.minFilter = THREE.LinearFilter;
      const material = new THREE.MeshBasicMaterial({map: portrait});

      const mesh = gltfScene.scene.children.find(child => child.name === name) as THREE.Mesh;

      mesh.material = material;
    });
  }

  private addMeta(gltfScene: GLTF): void {
    portraitNames.forEach(name => {
      const meta = this.textureLoader.load(`./static/photos/${name}-meta.png`);
      meta.flipY = false;
      const material = new THREE.MeshBasicMaterial({map: meta});

      const mesh = gltfScene.scene.children.find(child => child.name === `${name}-meta`) as THREE.Mesh;
      mesh.material = material;
    });
  }

  private render(): void {
    stats.begin();

    this.frontVector = new THREE.Vector3(0, 0, Number(this.keyEvents.backward) - Number(this.keyEvents.forward));
    this.sideVector = new THREE.Vector3(Number(this.keyEvents.left) - Number(this.keyEvents.right), 0, 0);

    this.userDirection = new THREE.Vector3();

    this.userDirection
      .subVectors(this.frontVector, this.sideVector)
      .normalize()
      .multiplyScalar(this.keyEvents.walkingSpeed)
      .applyEuler(this.camera.rotation);

    if (this.physics) {
      let oldElapsedTime = 0;
      const elapsedTime = this.clock.getElapsedTime();
      const deltaTime = elapsedTime - oldElapsedTime;
      oldElapsedTime = elapsedTime;

      this.physics.cannonDebugRenderer.update();
      this.camera.position.copy(
        new THREE.Vector3(
          this.physics.sphereBody.position.x,
          this.physics.sphereBody.position.y + 0.5,
          this.physics.sphereBody.position.z
        )
      );
      this.physics.sphereBody.velocity.set(this.userDirection.x, -2.0, this.userDirection.z);

      this.physics.physicsWorld.step(1 / 60, deltaTime, 2);
    }

    this.renderer.render(this.scene, this.camera);
    stats.end();
    window.requestAnimationFrame(() => this.render());
  }
}
