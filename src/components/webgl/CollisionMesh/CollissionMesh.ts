import * as THREE from 'three';
import {portraitNames} from '../../../utils/metaData';

export class CollissionMesh {
  private geometry: THREE.BoxGeometry;
  private material: THREE.MeshBasicMaterial;
  private mesh: THREE.InstancedMesh;
  private dummy: THREE.Object3D;

  constructor(scene: THREE.Scene) {
    this.dummy = new THREE.Object3D();

    this.geometry = new THREE.BoxGeometry(1.5, 0.15, 1.5);
    this.material = new THREE.MeshBasicMaterial({
      color: new THREE.Color(0xffe7d3),
      transparent: true
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
