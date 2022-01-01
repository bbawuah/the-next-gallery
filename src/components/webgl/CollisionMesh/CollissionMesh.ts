import * as THREE from 'three';
import {portraitNames} from '../../../utils/metaData';

export class CollissionMesh {
  private geometry: THREE.CylinderGeometry;
  private material: THREE.RawShaderMaterial;
  private mesh: THREE.InstancedMesh;
  private dummy: THREE.Object3D;

  constructor(scene: THREE.Scene) {
    this.dummy = new THREE.Object3D();

    this.geometry = new THREE.CylinderGeometry(1, 1, 0.3, 20, 5, true);
    this.material = new THREE.RawShaderMaterial({
      vertexShader: `
      attribute vec3 position;
      attribute vec2 uv;
      attribute mat4 instanceMatrix;
      
      uniform mat4 projectionMatrix;
      uniform mat4 modelViewMatrix;

      varying vec2 v_uv;

      void main() {
        vec4 modelPosition = instanceMatrix * vec4(position, 1.0);
        vec4 projectionPosition = modelViewMatrix * modelPosition;

        gl_Position =  projectionMatrix * projectionPosition;
        v_uv = uv;
      }
      `,
      fragmentShader: `
      precision mediump float;

      varying vec2 v_uv;

      void main() {
        float strength = 1.0 - v_uv.y;
        vec3 color = vec3(0.95, 0.56, 0.295);
        gl_FragColor = vec4(color, strength);
      }
      `,
      transparent: true,
      side: THREE.DoubleSide
    });

    this.mesh = new THREE.InstancedMesh(this.geometry, this.material, portraitNames.length);
    this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

    scene.add(this.mesh);

    portraitNames.forEach((creative, index) => {
      this.dummy.position.copy(creative.coordinates);
      this.dummy.updateMatrix();

      this.mesh.setMatrixAt(index, this.dummy.matrix);
    });
  }
}
