import * as THREE from 'three';
import GSAP from 'gsap';
import {store} from '../../../store/store';

export class LoadingManager {
  private overlayGeometry: THREE.PlaneGeometry;
  private overlayMaterial: THREE.RawShaderMaterial;
  private overlayMesh: THREE.Mesh;

  public loadingManager: THREE.LoadingManager;

  constructor(scene: THREE.Scene) {
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
               gl_FragColor = vec4(0.6, 0.6, 0.6, u_alpha);
             }
             `,
      transparent: true
    });
    this.overlayMesh = new THREE.Mesh(this.overlayGeometry, this.overlayMaterial);

    this.loadingManager = new THREE.LoadingManager(
      () => this.onLoadedAssets(this.overlayMaterial),
      this.onProgressLoadAssets
    );

    scene.add(this.overlayMesh);
  }

  private onLoadedAssets(material: THREE.RawShaderMaterial): void {
    GSAP.to(material.uniforms.u_alpha, {duration: 3, value: 0.0});
  }

  private onProgressLoadAssets(url: string, loaded: number, total: number): void {
    store.progressRatio.update(() => Math.floor((loaded / total) * 100));
  }
}
