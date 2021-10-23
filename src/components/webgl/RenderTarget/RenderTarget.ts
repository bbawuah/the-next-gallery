import * as THREE from 'three';
import createGeometry from 'three-bmfont-text';
import loadFont from 'load-bmfont';
import type {BufferGeometry} from 'three';
import {createMSDFShader} from '../Shaders/msdf';

interface ShaderProps {
  vertexShader: string;
  fragmentShader: string;
  uniforms: {[uniform: string]: THREE.IUniform};
}

interface Props {
  el: THREE.Mesh;
  shader: ShaderProps;
  text: string;
}

export class RenderTarget {
  private text: string;
  private geometry: BufferGeometry;
  private material: THREE.RawShaderMaterial;
  private shader: ShaderProps;

  public renderTarget: THREE.WebGLRenderTarget;
  public renderTargetCamera: THREE.PerspectiveCamera;
  public renderTargetScene: THREE.Scene;
  public renderTargetMesh: THREE.Mesh;
  public renderTargetMaterial: THREE.RawShaderMaterial;

  constructor(props: Props) {
    this.text = props.text;
    this.shader = props.shader;

    this.createRenderTarget();
    this.initializeShader(props.el);
  }

  private createRenderTarget(): void {
    this.renderTarget = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight);

    this.renderTargetCamera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    this.renderTargetCamera.position.z = 2.5;

    this.renderTargetScene = new THREE.Scene();
    this.renderTargetScene.background = new THREE.Color(0xe8e8e8);
  }

  private addShader(mesh: THREE.Mesh | undefined): void {
    this.shader.uniforms.u_texture = {value: this.renderTarget.texture};

    this.renderTargetMaterial = new THREE.RawShaderMaterial({
      ...this.shader,
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

        text.position.set(-0.1, -0.95, 0);
        text.rotation.set(Math.PI, 0, Math.PI * 1.5);
        text.scale.set(0.0075, 0.01, 1);

        this.renderTargetScene.add(text);
        this.addShader(mesh);
      });
    });
  }
}
