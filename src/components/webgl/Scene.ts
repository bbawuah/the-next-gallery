import * as THREE from 'three';
// import Stats from 'stats-js';
// import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import type {GLTF} from 'three/examples/jsm/loaders/GLTFLoader';
import {DRACOLoader} from 'three/examples/jsm/loaders/DRACOLoader';
import type {Sizes} from './types';
import {Events} from './Events/Events';
import {PhysicsWorld} from './Physics/Physics';
import {store} from '../../store/store';
import {DeviceOrientationControls} from 'three/examples/jsm/controls/DeviceOrientationControls.js';
import {PointerLockControls} from 'three/examples/jsm/controls/PointerLockControls';
import {LoadingManager} from './LoadingManager/LoadingManager';
import {LightParticles} from './LightParticles/LightParticles';
import {WebXR} from './WebXR/WebXR';
import {Sky} from 'three/examples/jsm/objects/Sky.js';
import {Water} from './Water/Water';
import {EffectComposer} from 'three/examples/jsm/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass.js';
import {physicalObjects, portraitNames} from '../../utils/metaData';
import {CollissionMesh} from './CollisionMesh/CollissionMesh';

const sizes: Sizes = {
  width: window.innerWidth,
  height: window.innerHeight
};

export class Scene {
  private renderer: THREE.WebGLRenderer;
  private camera: THREE.PerspectiveCamera;
  private scene: THREE.Scene;

  // private controls: OrbitControls;

  private material: THREE.MeshBasicMaterial;
  private mesh: THREE.Mesh;

  private gltfLoader: GLTFLoader;
  private dracoLoader: DRACOLoader;
  private textureLoader: THREE.TextureLoader;

  private bakedTexture: THREE.Texture;
  private floorTexture: THREE.Texture;
  private tessalationTexture: THREE.Texture;
  private woodenWallsTexture: THREE.Texture;
  private vaseOne: THREE.Texture;
  private vaseTwo: THREE.Texture;
  private sky: Sky;
  private water: any;
  private sun: THREE.Vector3;

  private physics: PhysicsWorld;

  private clock: THREE.Clock;

  private particles: LightParticles;

  private loadingManager: LoadingManager;

  private webXR: WebXR;

  private composer: EffectComposer;
  private renderPass: RenderPass;

  private collissionMesh: CollissionMesh;

  public isMobile: boolean;

  public deviceOrientationControls: DeviceOrientationControls;

  public events: Events;

  public scrollSpeed: number;

  public currentSession: boolean;

  constructor(el: HTMLCanvasElement) {
    this.renderer = new THREE.WebGLRenderer({
      canvas: el
    });
    this.renderer.setSize(sizes.width, sizes.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.toneMapping = THREE.ReinhardToneMapping;
    this.renderer.toneMappingExposure = 1.5;

    this.scene = new THREE.Scene();

    this.sun = new THREE.Vector3();

    this.sky = new Sky();
    this.sky.scale.setScalar(450000);
    this.scene.add(this.sky);

    this.collissionMesh = new CollissionMesh(this.scene);

    const waterGeometry = new THREE.PlaneGeometry(20000, 20000);

    this.water = new Water(waterGeometry, {
      textureWidth: 512,
      textureHeight: 512,
      waterNormals: new THREE.TextureLoader().load('static/waternormals.jpg', function (texture) {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      }),
      sunDirection: new THREE.Vector3(),
      sunColor: 0xffffff,
      waterColor: 0x17727a,
      distortionScale: 3.7
    });

    this.water.rotation.x = -Math.PI / 2;
    this.water.position.y = -1;

    this.scene.add(this.water);

    const uniforms = this.sky.material.uniforms;

    const phi = THREE.MathUtils.degToRad(90 - 50);
    const theta = THREE.MathUtils.degToRad(180);

    this.sun.setFromSphericalCoords(1, phi, theta);

    uniforms['turbidity'].value = 10;
    uniforms['rayleigh'].value = 1.246;
    uniforms['mieCoefficient'].value = 0.069;
    uniforms['mieDirectionalG'].value = 0.7;
    uniforms['sunPosition'].value.copy(this.sun);

    this.particles = new LightParticles(this.scene);

    this.camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000);
    this.camera.position.x = 3;

    this.camera.rotateY(135);

    store.isMobileDevice.subscribe(value => {
      this.isMobile = value;
    });

    // this.controls = new OrbitControls(this.camera, el);

    this.loadingManager = new LoadingManager(this.scene);

    this.textureLoader = new THREE.TextureLoader(this.loadingManager.loadingManager);

    this.bakedTexture = this.textureLoader.load('./static/interior-base.jpg');
    this.tessalationTexture = this.textureLoader.load('./static/tessalation-tent.jpg');
    this.woodenWallsTexture = this.textureLoader.load('./static/wooden-walls.jpg');
    this.vaseOne = this.textureLoader.load('./static/vases-one.jpg');
    this.vaseTwo = this.textureLoader.load('./static/vases-two.jpg');
    this.floorTexture = this.textureLoader.load('./static/floor.jpg');

    this.loadTextures([
      this.bakedTexture,
      this.tessalationTexture,
      this.woodenWallsTexture,
      this.vaseOne,
      this.vaseTwo,
      this.floorTexture
    ]);

    this.material = new THREE.MeshBasicMaterial({map: this.bakedTexture});

    this.events = new Events(this.camera);

    this.clock = new THREE.Clock();

    this.physics = new PhysicsWorld({
      scene: this.scene
    });

    if (this.mesh) {
      this.scene.add(this.mesh);
    }

    this.deviceOrientationControls = new DeviceOrientationControls(this.camera);
    store.deviceOrientation.update(() => this.deviceOrientationControls);
    this.deviceOrientationControls.enabled = false;

    this.dracoLoader = new DRACOLoader(this.loadingManager.loadingManager);
    this.dracoLoader.setDecoderPath('draco/');

    this.gltfLoader = new GLTFLoader(this.loadingManager.loadingManager);
    this.gltfLoader.setDRACOLoader(this.dracoLoader);
    this.gltfLoader.load('./static/gallery.glb', gltf => this.handleGltf(gltf));

    store.isMobileDevice.subscribe(v => (this.isMobile = v));

    this.webXR = new WebXR({
      renderer: this.renderer,
      camera: this.camera,
      scene: this.scene,
      particles: this.particles.lightParticles
    });

    this.renderPass = new RenderPass(this.scene, this.camera);
    this.composer = new EffectComposer(this.renderer);

    this.composer.addPass(this.renderPass);

    if (!this.isMobile) {
      store.scrollSpeed.subscribe(v => {
        if (!this.currentSession) {
          this.camera.rotation.y = this.camera.rotation.y + v * 0.00099;
        }
      });

      store.pointerLockerControls.update(() => new PointerLockControls(this.camera, el));
      this.events.handleKeyUpEvents();
      this.events.handleKeyDownEvents();
    }

    this.resize();
    this.render(this.isMobile);
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

  private handleGltf(gltf: GLTF): void {
    const floor = ['floor', 'tent-foundation'];
    const baseGeometry = [
      'kleine-rotsen',
      'randen',
      'randen001',
      'trap',
      'trap-leuning',
      'trap-steuning',
      'tweede-verdieping'
    ];

    const vase = ['vase-one', 'vase-one001', 'vase-one002', 'vase-one003', 'vase-one004', 'vase-one005', 'vase-one006'];

    const vaseTwo = ['vase-two002', 'vase-two004', 'vase-two005', 'vase-two010'];

    gltf.scene.traverse(child => {
      if (baseGeometry.includes(child.name)) {
        (child as THREE.Mesh).material = this.material;
      }

      if (physicalObjects.includes(child.name)) {
        this.physics.createPhysics(child as THREE.Mesh);
      }

      if (floor.includes(child.name)) {
        (child as THREE.Mesh).material = new THREE.MeshBasicMaterial({map: this.floorTexture});
      }

      if (child.name === 'tessalation-tent') {
        (child as THREE.Mesh).material = new THREE.MeshBasicMaterial({map: this.tessalationTexture});
      }

      if (child.name.includes('muren')) {
        (child as THREE.Mesh).material = new THREE.MeshBasicMaterial({map: this.woodenWallsTexture});
        this.physics.createPhysics(child as THREE.Mesh);
      }

      if (vase.includes(child.name)) {
        (child as THREE.Mesh).material = new THREE.MeshBasicMaterial({map: this.vaseOne});
      }

      if (vaseTwo.includes(child.name)) {
        (child as THREE.Mesh).material = new THREE.MeshBasicMaterial({map: this.vaseTwo});
      }

      if (child.name.includes('tree')) {
        (child as THREE.Mesh).material = new THREE.MeshBasicMaterial({color: new THREE.Color(0xffe7d3)});
      }

      if (child.name.includes('leaves')) {
        (child as THREE.Mesh).material = new THREE.MeshBasicMaterial({color: new THREE.Color(0x93e788)});
      }
    });

    this.addPortraits(gltf);
    this.scene.add(gltf.scene);
  }

  private addPortraits(gltfScene: GLTF): void {
    portraitNames.forEach(creative => {
      const portrait = this.textureLoader.load(`./static/photos/${creative.slug}.jpg`);
      portrait.flipY = false;
      portrait.minFilter = THREE.LinearFilter;
      const material = new THREE.MeshBasicMaterial({map: portrait});

      const mesh = gltfScene.scene.children.find(child => child.name === creative.slug) as THREE.Mesh;

      mesh.material = material;
    });
  }

  private loadTextures(textures: THREE.Texture[]): void {
    textures.forEach(texture => {
      texture.flipY = false;
      texture.encoding = THREE.sRGBEncoding;
    });
  }

  private render(isMobileDevice: boolean): void {
    // stats.begin();
    const isMobile = isMobileDevice;
    const elapsedTime = this.clock.getElapsedTime();

    if (this.water) {
      (this.water.material as any).uniforms['time'].value += 1.0 / 60.0;
    }

    // this.controls.update();

    if (this.physics) {
      this.physics.handlePhysics({elapsedTime, camera: this.camera, userDirection: this.events.userDirection});
    }

    if (this.isMobile) {
      this.deviceOrientationControls.update();
    }

    this.composer.render();
    // stats.end();

    window.requestAnimationFrame(() => this.render(isMobile));
  }
}
