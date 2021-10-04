import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import type {GLTF} from 'three/examples/jsm/loaders/GLTFLoader';
import {DRACOLoader} from 'three/examples/jsm/loaders/DRACOLoader';
import type {Sizes} from './types';

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
  public renderer: THREE.WebGLRenderer;
  public camera: THREE.PerspectiveCamera;
  public scene: THREE.Scene;
  public controls: OrbitControls;
  public geometry: THREE.BoxGeometry;
  public material: THREE.MeshBasicMaterial;
  public mesh: THREE.Mesh;
  public gltfLoader: GLTFLoader;
  public dracoLoader: DRACOLoader;
  public textureLoader: THREE.TextureLoader;
  public bakedTexture: THREE.Texture;

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

    this.dracoLoader = new DRACOLoader();
    this.dracoLoader.setDecoderPath('draco/');

    this.gltfLoader = new GLTFLoader();
    this.gltfLoader.load('./static/museum.glb', gltf => {
      gltf.scene.traverse(child => {
        (child as THREE.Mesh).material = this.material;
      });

      // Not sure if I am going to use this
      const stairs = gltf.scene.children.find(child => child.name === 'treden') as THREE.Mesh;
      stairs.material = new THREE.MeshBasicMaterial({color: new THREE.Color(0x9b9b9b)});

      this.addPortrets(gltf);
      this.addMeta(gltf);
      this.scene.add(gltf.scene);
    });
    this.gltfLoader.setDRACOLoader(this.dracoLoader);

    if (this.mesh) {
      this.scene.add(this.mesh);
    }
    this.controls = new OrbitControls(this.camera, el);

    this.resize();
    this.render();
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
    this.renderer.render(this.scene, this.camera);
    window.requestAnimationFrame(() => this.render());
  }
}
