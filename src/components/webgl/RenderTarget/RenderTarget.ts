import * as THREE from 'three';
import createGeometry from 'three-bmfont-text';
import loadFont from 'load-bmfont';
import type {BufferGeometry} from 'three';
import {vertexShader} from '../Shaders/KinecticText/vertex';
import {fragmentShader} from '../Shaders/KinecticText/fragment';
import {createMSDFShader} from '../Shaders/msdf';

export class RenderTarget {
  private text: string;
  private geometry: BufferGeometry;
  private material: THREE.RawShaderMaterial;

  public renderTarget: THREE.WebGLRenderTarget;
  public renderTargetCamera: THREE.PerspectiveCamera;
  public renderTargetScene: THREE.Scene;
  public renderTargetMesh: THREE.Mesh;
  public renderTargetMaterial: THREE.RawShaderMaterial;

  constructor(el: THREE.Mesh) {
    this.text = 'NEXT';

    this.createRenderTarget();
    this.initializeShader(el);
  }

  private createRenderTarget(): void {
    this.renderTarget = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight);

    this.renderTargetCamera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    this.renderTargetCamera.position.z = 2.5;

    this.renderTargetScene = new THREE.Scene();
    this.renderTargetScene.background = new THREE.Color(0xe8e8e8);
  }

  private addShader(mesh: THREE.Mesh | undefined): void {
    this.renderTargetMaterial = new THREE.RawShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        u_time: {value: 0.0},
        u_texture: {value: this.renderTarget.texture}
      },
      side: THREE.FrontSide
    });

    if (mesh) {
      this.renderTargetMesh = mesh;
      this.renderTargetMesh.material = this.renderTargetMaterial;
    }
  }

  public initializeShader(mesh: THREE.Mesh): void {
    loadFont('/fonts/helvetica.fnt', (error, font) => {
      this.geometry = createGeometry({
        font,
        text: this.text
      }) as BufferGeometry;

      const loader = new THREE.TextureLoader();

      loader.load('/fonts/helvetica.png', texture => {
        this.material = new THREE.RawShaderMaterial(
          createMSDFShader({
            map: texture,
            negate: false,
            color: 0x383838
          })
        );

        const text = new THREE.Mesh(this.geometry, this.material);

        text.position.set(-0.9, -0.8, 0);
        text.rotation.set(Math.PI, 0, 0);
        text.scale.set(0.0075, 0.01, 1);

        this.renderTargetScene.add(text);
        this.addShader(mesh);
      });
    });
  }
}
