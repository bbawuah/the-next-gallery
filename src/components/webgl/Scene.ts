import * as THREE from 'three';
import Stats from 'stats-js';
// import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import type {GLTF} from 'three/examples/jsm/loaders/GLTFLoader';
import {DRACOLoader} from 'three/examples/jsm/loaders/DRACOLoader';
import type {Sizes} from './types';
import {Events} from './Events/Events';
import {PhysicsWorld} from './Physics/Physics';
import {RenderTarget} from './RenderTarget/RenderTarget';
import {store} from '../../store/store';
import {DeviceOrientationControls} from 'three/examples/jsm/controls/DeviceOrientationControls.js';
import {PointerLockControls} from 'three/examples/jsm/controls/PointerLockControls';
import {LoadingManager} from './LoadingManager/LoadingManager';
import {LightParticles} from './LightParticles/LightParticles';
import {WebXR} from './WebXR/WebXR';
import {vertexShader} from './Shaders/paintingOne/vertex';
import {fragmentShader} from './Shaders/paintingOne/fragment';
import {vertexShaderTwo} from './Shaders/paintingTwo/vertex';
import {fragmentShaderTwo} from './Shaders/paintingTwo/fragment';
import {fragmentShaderThree} from './Shaders/paintingThree/fragment';
import {vertexShaderThree} from './Shaders/paintingThree/vertex';
import {EffectComposer} from 'three/examples/jsm/postprocessing/EffectComposer.js';
// import {ShaderPass} from 'three/examples/jsm/postprocessing/ShaderPass.js';
import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass.js';
import {GlitchPass} from 'three/examples/jsm/postprocessing/GlitchPass.js';
import {ShaderPass} from 'three/examples/jsm/postprocessing/ShaderPass';
import {postProcessingShader} from './Shaders/postprocessing/shader';

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

  // private controls: OrbitControls;

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
  private renderTargetTwo: RenderTarget;

  private shaderPaintingThree: THREE.Mesh;
  private renderTargetThree: RenderTarget;

  private particles: LightParticles;

  private loadingManager: LoadingManager;

  private webXR: WebXR;

  private composer: EffectComposer;
  private shaderPass: ShaderPass;
  private renderPass: RenderPass;
  private glitchPass: GlitchPass;

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

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xffffff);

    this.particles = new LightParticles(this.scene);

    this.camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
    this.camera.position.z = -1;

    this.camera.rotateY(220);

    store.isMobileDevice.subscribe(value => {
      this.isMobile = value;
    });

    this.loadingManager = new LoadingManager(this.scene);

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

    this.deviceOrientationControls = new DeviceOrientationControls(this.camera);
    this.deviceOrientationControls.connect();

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
    this.glitchPass = new GlitchPass();
    this.shaderPass = new ShaderPass(postProcessingShader);

    this.composer.addPass(this.renderPass);

    store.currentSession.subscribe(v => {
      this.currentSession = v;
      if (!v) {
        this.composer.addPass(this.shaderPass);
      } else {
        this.composer.removePass(this.shaderPass);
      }
    });

    if (!this.isMobile) {
      store.scrollSpeed.subscribe(v => {
        if (this.currentSession) {
          this.camera.rotation.y = this.camera.rotation.y + v * 0.01;
        }

        this.shaderPass.uniforms.scrollSpeed.value = v + 0.0;
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
      text: 'NEXT',
      backgroundColor: 0xe8e8e8,
      textColor: 0x383838
    });

    this.shaderPaintingTwo = gltf.scene.children.find(child => child.name === 'shader-schilderij-2') as THREE.Mesh;
    this.renderTargetTwo = new RenderTarget({
      el: this.shaderPaintingTwo,
      shader: {
        vertexShader: vertexShaderTwo,
        fragmentShader: fragmentShaderTwo,
        uniforms: {
          u_time: {value: 0.0}
        }
      },
      text: "'IMPACT'",
      backgroundColor: 0x383838,
      textColor: 0xe8e8e8
    });

    this.shaderPaintingThree = gltf.scene.children.find(child => child.name === 'shader-schilderij-3') as THREE.Mesh;
    this.renderTargetThree = new RenderTarget({
      el: this.shaderPaintingThree,
      shader: {
        vertexShader: vertexShaderThree,
        fragmentShader: fragmentShaderThree,
        uniforms: {
          u_time: {value: 0.0}
        }
      },
      text: "'INSPIRE'",
      backgroundColor: 0x383838,
      textColor: 0xe8e8e8
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

    if (this.physics) {
      this.physics.handlePhysics({elapsedTime, camera: this.camera, userDirection: this.events.userDirection});
    }

    if (this.renderTargetOne && this.renderTargetOne.renderTargetMaterial && this.renderTargetOne.renderTarget) {
      this.handleRenderTarget(this.renderTargetOne, elapsedTime, isMobile);
    }

    if (this.renderTargetThree && this.renderTargetThree.renderTargetMaterial && this.renderTargetThree.renderTarget) {
      this.handleRenderTarget(this.renderTargetThree, elapsedTime, isMobile);
    }

    if (this.renderTargetTwo && this.renderTargetTwo.renderTargetMaterial && this.renderTargetTwo.renderTarget) {
      this.handleRenderTarget(this.renderTargetTwo, elapsedTime, isMobile);
    }

    this.deviceOrientationControls.update();
    this.composer.render();

    window.requestAnimationFrame(() => this.render(isMobile));
  }
}
