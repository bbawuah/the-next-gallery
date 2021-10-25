import * as THREE from 'three';
import Stats from 'stats-js';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import type {GLTF} from 'three/examples/jsm/loaders/GLTFLoader';
import {DRACOLoader} from 'three/examples/jsm/loaders/DRACOLoader';
import type {Sizes} from './types';
import {Events} from './Events/Events';
import {PhysicsWorld} from './Physics/Physics';
import {RenderTarget} from './RenderTarget/RenderTarget';
import {deviceOrientation, isMobileDevice, pointerLockerControls} from '../../store/store';
import {DeviceOrientationControls} from 'three/examples/jsm/controls/DeviceOrientationControls.js';
import {PointerLockControls} from 'three/examples/jsm/controls/PointerLockControls';
import {LoadingManager} from './LoadingManager/LoadingManager';
import {LightParticles} from './LightParticles/LightParticles';
import {WebXR} from './WebXR/WebXR';
import {vertexShader} from './Shaders/paintingOne/vertex';
import {fragmentShader} from './Shaders/paintingOne/fragment';
import {vertexShaderTwo} from './Shaders/paintingTwo/vertex';
import {fragmentShaderTwo} from './Shaders/paintingTwo/fragment';

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
  'branco',
  'emmanuel',
  'denitio'
];

const stats = new Stats();

// stats.showPanel(1);
// document.body.appendChild(stats.dom);

export class Scene {
  private renderer: THREE.WebGLRenderer;
  private camera: THREE.PerspectiveCamera;
  private scene: THREE.Scene;

  private controls: OrbitControls;

  private material: THREE.MeshBasicMaterial;
  private mesh: THREE.Mesh;

  private gltfLoader: GLTFLoader;
  private dracoLoader: DRACOLoader;
  private textureLoader: THREE.TextureLoader;

  private bakedTexture: THREE.Texture;

  private physics: PhysicsWorld;

  private clock: THREE.Clock;

  private shaderPaintingOne: THREE.Mesh;
  private renderTargetOne: RenderTarget;

  private shaderPaintingTwo: THREE.Mesh;

  private shaderPaintingThree: THREE.Mesh;
  private renderTargetThree: RenderTarget;

  private particles: LightParticles;

  private loadingManager: LoadingManager;

  private webXR: WebXR;

  public isMobile: boolean;

  public deviceOrientationControls: DeviceOrientationControls;

  public events: Events;

  constructor(el: HTMLCanvasElement) {
    this.renderer = new THREE.WebGLRenderer({
      canvas: el
    });
    this.renderer.setSize(sizes.width, sizes.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.outputEncoding = THREE.sRGBEncoding;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xffffff);

    this.particles = new LightParticles(this.scene);

    this.camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
    this.camera.position.z = -1;

    this.loadingManager = new LoadingManager(this.scene);

    isMobileDevice.subscribe(value => {
      this.isMobile = value;
    });

    this.textureLoader = new THREE.TextureLoader(this.loadingManager.loadingManager);
    this.bakedTexture = this.textureLoader.load('./static/map.jpg');
    this.bakedTexture.flipY = false;
    this.bakedTexture.encoding = THREE.sRGBEncoding;

    this.material = new THREE.MeshBasicMaterial({map: this.bakedTexture});

    this.events = new Events(this.camera);

    this.clock = new THREE.Clock();

    this.physics = new PhysicsWorld({
      scene: this.scene
    });

    if (this.mesh) {
      this.scene.add(this.mesh);
    }

    this.controls = new OrbitControls(this.camera, el); //Development

    this.deviceOrientationControls = new DeviceOrientationControls(this.camera);
    deviceOrientation.update(() => this.deviceOrientationControls);

    this.dracoLoader = new DRACOLoader(this.loadingManager.loadingManager);
    this.dracoLoader.setDecoderPath('draco/');

    this.gltfLoader = new GLTFLoader(this.loadingManager.loadingManager);
    this.gltfLoader.setDRACOLoader(this.dracoLoader);
    this.gltfLoader.load('./static/gallery.glb', gltf => this.handleGltf(gltf));

    isMobileDevice.subscribe(v => (this.isMobile = v));

    this.webXR = new WebXR({
      renderer: this.renderer,
      camera: this.camera,
      scene: this.scene,
      particles: this.particles.lightParticles
    });

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

    this.shaderPaintingOne = gltf.scene.children.find(child => child.name === 'shader-schilderij') as THREE.Mesh;
    this.renderTargetOne = new RenderTarget({
      el: this.shaderPaintingOne,
      shader: {
        vertexShader,
        fragmentShader,
        uniforms: {
          u_time: {value: 0.0}
        }
      },
      text: 'NEXT'
    });

    this.shaderPaintingTwo = gltf.scene.children.find(child => child.name === 'shader-schilderij-2') as THREE.Mesh;
    this.shaderPaintingTwo.material = new THREE.RawShaderMaterial({
      vertexShader: vertexShaderTwo,
      fragmentShader: fragmentShaderTwo,
      uniforms: {
        u_time: {value: 0.0}
      }
    });

    this.shaderPaintingThree = gltf.scene.children.find(child => child.name === 'shader-schilderij-3') as THREE.Mesh;
    this.renderTargetThree = new RenderTarget({
      el: this.shaderPaintingThree,
      shader: {
        vertexShader,
        fragmentShader,
        uniforms: {
          u_time: {value: 0.0}
        }
      },
      text: 'Be Unique'
    });

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

  private handleRenderTarget(renderTarget: RenderTarget, elapsedTime: number, isMobile: boolean): void {
    if (!isMobile) {
      (renderTarget.renderTargetMaterial as THREE.RawShaderMaterial).uniforms.u_time.value = elapsedTime;
    }

    this.renderer.setRenderTarget(renderTarget.renderTarget);

    this.renderer.render(renderTarget.renderTargetScene, renderTarget.renderTargetCamera);
    this.renderer.setRenderTarget(null);
  }

  private render(isMobileDevice: boolean): void {
    const isMobile = isMobileDevice;
    const elapsedTime = this.clock.getElapsedTime();
    stats.begin();

    if (isMobile) {
      this.deviceOrientationControls.update();
    }

    if (this.physics) {
      this.physics.handlePhysics({elapsedTime, camera: this.camera, userDirection: this.events.userDirection});
    }

    if (this.shaderPaintingTwo && this.shaderPaintingTwo.material) {
      (this.shaderPaintingTwo.material as THREE.RawShaderMaterial).uniforms.u_time.value = elapsedTime;
    }

    if (this.renderTargetOne && this.renderTargetOne.renderTargetMaterial && this.renderTargetOne.renderTarget) {
      this.handleRenderTarget(this.renderTargetOne, elapsedTime, isMobile);
    }

    if (this.renderTargetThree && this.renderTargetThree.renderTargetMaterial && this.renderTargetThree.renderTarget) {
      this.handleRenderTarget(this.renderTargetThree, elapsedTime, isMobile);
    }

    this.renderer.render(this.scene, this.camera);
    stats.end();
    window.requestAnimationFrame(() => this.render(isMobile));
  }
}
