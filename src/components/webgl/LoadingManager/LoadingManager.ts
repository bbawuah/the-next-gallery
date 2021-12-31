import * as THREE from 'three';
import GSAP from 'gsap';
import {CustomEase} from 'gsap/CustomEase';
import {store} from '../../../store/store';

GSAP.registerPlugin(CustomEase);

export class LoadingManager {
  private overlayGeometry: THREE.PlaneGeometry;
  private overlayMaterial: THREE.RawShaderMaterial;
  private overlayMesh: THREE.Mesh;

  public loadingManager: THREE.LoadingManager;

  constructor(scene: THREE.Scene) {
    this.overlayGeometry = new THREE.PlaneGeometry(2, 2, 1, 1);
    this.overlayMaterial = new THREE.RawShaderMaterial({
      uniforms: {
        u_alpha: {value: 1.0},
        u_moveY: {value: 0.0}
      },
      vertexShader: `
             attribute vec3 position;
             attribute vec2 uv;
             uniform mat4 projectionMatrix;
             uniform mat4 modelViewMatrix;

             uniform float u_moveY;
       
       
             void main() {

              float strength = step(0.5, distance(uv, vec2(0.5)) + 0.25);
              vec3 customPosition = vec3(position.x,position.y - u_moveY,position.z);
               gl_Position = vec4(customPosition, 1.0);
             }
             `,
      fragmentShader: `
             precision mediump float;
       
             uniform float u_alpha;
       
             void main() {
               gl_FragColor = vec4(1.0, 0.676, 0.1, u_alpha);
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
    GSAP.to(material.uniforms.u_alpha, {duration: 3, value: 0.7});
    GSAP.to(material.uniforms.u_moveY, {
      duration: 3,
      ease: CustomEase.create(
        'custom',
        'M0,0 C0.01,0.077 0.098,0.095 0.162,0.11 0.504,0.186 0.504,0.502 0.566,0.694 0.637,0.916 0.811,1 1,1 '
      ),
      value: 2.0
    });
  }

  private onProgressLoadAssets(url: string, loaded: number, total: number): void {
    store.progressRatio.update(() => Math.floor((loaded / total) * 100));
  }
}
