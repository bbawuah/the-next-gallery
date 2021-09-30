import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import type {Sizes} from './types';

const sizes: Sizes = {
  width: window.innerWidth,
  height: window.innerHeight
};

export class Scene {
  public renderer: THREE.WebGLRenderer;
  public camera: THREE.PerspectiveCamera;
  public scene: THREE.Scene;
  public controls: OrbitControls;
  public geometry: THREE.BoxGeometry;
  public material: THREE.MeshBasicMaterial;
  public mesh: THREE.Mesh;

  constructor(el: HTMLCanvasElement) {
    this.renderer = new THREE.WebGLRenderer({
      canvas: el
    });

    this.renderer.setSize(sizes.width, sizes.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x111111);

    this.camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
    this.camera.position.z = 4;
    this.camera.position.y = 0;

    this.geometry = new THREE.BoxGeometry(1, 1, 1);
    this.material = new THREE.MeshBasicMaterial({color: 0xff0000});
    this.mesh = new THREE.Mesh(this.geometry, this.material);

    this.scene.add(this.mesh);
    this.controls = new OrbitControls(this.camera, el);
    console.log(this.controls);

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

  render(): void {
    if (this.mesh) {
      this.mesh.rotation.x += 0.01;
      this.mesh.rotation.y += 0.01;
    }

    this.renderer.render(this.scene, this.camera);
    window.requestAnimationFrame(() => this.render());
  }
}
