import * as THREE from 'three';
import GSAP from 'gsap';
import Stats from 'stats-js';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import type {GLTF} from 'three/examples/jsm/loaders/GLTFLoader';
import {DRACOLoader} from 'three/examples/jsm/loaders/DRACOLoader';
import type {Sizes} from './types';
import {Events} from './Events/Events';
import {PhysicsWorld} from './Physics/Physics';
import {RenderTarget} from './RenderTarget/RenderTarget';
import {deviceOrientation, isMobileDevice, pointerLockerControls, progressRatio} from '../../store/store';
import {DeviceOrientationControls} from 'three/examples/jsm/controls/DeviceOrientationControls.js';
import {PointerLockControls} from 'three/examples/jsm/controls/PointerLockControls';

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

// stats.showPanel(1);
// document.body.appendChild(stats.dom);

export class Scene {
  // Scene
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

  // Movement
  private frontVector: THREE.Vector3;
  private sideVector: THREE.Vector3;
  private userDirection: THREE.Vector3;
  private clock: THREE.Clock;

  // ShaderPainting
  private shaderPainting: THREE.Mesh;
  private bitmapText: RenderTarget;

  // Overlay
  private overlayGeometry: THREE.PlaneGeometry;
  private overlayMaterial: THREE.RawShaderMaterial;
  private overlayMesh: THREE.Mesh;
  private loadingManager: THREE.LoadingManager;

  // IsMobile device?
  public isMobile: boolean;

  public deviceOrientationControls: DeviceOrientationControls;

  //Events
  public events: Events;

  constructor(el: HTMLCanvasElement) {
    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: el
    });
    this.renderer.setSize(sizes.width, sizes.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.outputEncoding = THREE.sRGBEncoding;

    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xffffff);

    // Camera
    this.camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
    this.camera.position.z = -1;

    // Overlay
    this.overlayGeometry = new THREE.PlaneGeometry(2, 2, 1, 1);
    this.overlayMaterial = new THREE.RawShaderMaterial({
      uniforms: {
        u_alpha: {value: 1.0}
      },
      vertexShader: `
          attribute vec3 position;
          uniform mat4 projectionMatrix;
          uniform mat4 modelViewMatrix;
    
    
          void main() {
            gl_Position = vec4(position, 1.0);
          }
          `,
      fragmentShader: `
          precision mediump float;
    
          uniform float u_alpha;
    
          void main() {
            gl_FragColor = vec4(.6, 0.6, 0.6, u_alpha);
          }
          `,
      transparent: true
    });
    this.overlayMesh = new THREE.Mesh(this.overlayGeometry, this.overlayMaterial);
    this.scene.add(this.overlayMesh);

    // Loading Manager
    this.loadingManager = new THREE.LoadingManager(
      () => this.onLoadedAssets(this.overlayMaterial),
      this.onProgressLoadAssets
    );

    // Textures
    this.textureLoader = new THREE.TextureLoader(this.loadingManager);
    this.bakedTexture = this.textureLoader.load('./static/map.jpg');
    this.bakedTexture.flipY = false;
    this.bakedTexture.encoding = THREE.sRGBEncoding;

    // Texture material
    this.material = new THREE.MeshBasicMaterial({map: this.bakedTexture});

    // Events
    this.events = new Events();

    // Physics
    this.physics = new PhysicsWorld(this.scene);

    if (this.mesh) {
      this.scene.add(this.mesh);
    }

    this.controls = new OrbitControls(this.camera, el); //Development
    this.deviceOrientationControls = new DeviceOrientationControls(this.camera);

    deviceOrientation.update(() => this.deviceOrientationControls);

    // DRACO Loader
    this.dracoLoader = new DRACOLoader(this.loadingManager);
    this.dracoLoader.setDecoderPath('draco/');

    // GLTF Loader
    this.gltfLoader = new GLTFLoader(this.loadingManager);
    this.gltfLoader.setDRACOLoader(this.dracoLoader);
    this.gltfLoader.load('./static/museum.glb', gltf => this.handleGltf(gltf));

    // Clock
    this.clock = new THREE.Clock();

    isMobileDevice.subscribe(v => (this.isMobile = v));

    if (!this.isMobile) {
      pointerLockerControls.update(() => new PointerLockControls(this.camera, el));
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

  private onLoadedAssets(material: THREE.RawShaderMaterial): void {
    GSAP.to(material.uniforms.u_alpha, {duration: 3, value: 0.0});
  }

  private onProgressLoadAssets(url: string, loaded: number, total: number): void {
    progressRatio.update(() => Math.floor((loaded / total) * 100));
  }

  private handleGltf(gltf: GLTF): void {
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

    this.shaderPainting = gltf.scene.children.find(child => child.name === 'shader-schilderij') as THREE.Mesh;
    this.shaderPainting.material = new THREE.MeshBasicMaterial({color: 0xff0000});
    this.bitmapText = new RenderTarget(this.shaderPainting);

    const looseWalls = gltf.scene.children.find(child => child.name === 'losse-muren') as THREE.Mesh;
    this.physics.createPhysics(looseWalls);

    const handrail = gltf.scene.children.find(child => child.name === 'trapLeuning') as THREE.Mesh;
    handrail.material = darkGrey;

    this.addPortraits(gltf);
    this.addMeta(gltf);
    this.scene.add(gltf.scene);
  }

  private addPortraits(gltfScene: GLTF): void {
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

  private handleUserDirection(): void {
    this.frontVector = new THREE.Vector3(0, 0, Number(this.events.backward) - Number(this.events.forward));
    this.sideVector = new THREE.Vector3(Number(this.events.left) - Number(this.events.right), 0, 0);

    this.userDirection = new THREE.Vector3();

    this.userDirection
      .subVectors(this.frontVector, this.sideVector)
      .normalize()
      .multiplyScalar(this.events.walkingSpeed)
      .applyEuler(this.camera.rotation);
  }

  private handlePhysics(elapsedTime: number): void {
    let oldElapsedTime = 0;
    const deltaTime = elapsedTime - oldElapsedTime;
    oldElapsedTime = elapsedTime;

    // this.physics.cannonDebugRenderer.update();

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

  private render(isMobileDevice: boolean): void {
    const isMobile = isMobileDevice;
    const elapsedTime = this.clock.getElapsedTime();
    stats.begin();
    this.handleUserDirection();

    //Mobile orientation
    if (isMobile) {
      this.deviceOrientationControls.update();
    }

    if (this.physics) {
      this.handlePhysics(elapsedTime);
    }

    if (this.bitmapText) {
      if (this.bitmapText.renderTarget) {
        if (this.bitmapText.renderTargetMaterial) {
          (this.bitmapText.renderTargetMaterial as THREE.RawShaderMaterial).uniforms.u_time.value = elapsedTime;
        }
      }

      this.renderer.setRenderTarget(this.bitmapText.renderTarget);

      this.renderer.render(this.bitmapText.renderTargetScene, this.bitmapText.renderTargetCamera);
      this.renderer.setRenderTarget(null);
    }

    this.renderer.render(this.scene, this.camera);
    stats.end();
    window.requestAnimationFrame(() => this.render(isMobile));
  }
}
