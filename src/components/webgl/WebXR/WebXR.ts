import {VRButton} from './VRButton';

interface Props {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
}

export class WebXR {
  private vrButton: VRButton;

  constructor(props: Props) {
    this.vrButton = new VRButton(props.renderer);

    props.renderer.xr.enabled = true;
    props.renderer.setAnimationLoop(function () {
      props.renderer.render(props.scene, props.camera);
    });
  }
}
