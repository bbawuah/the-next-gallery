import * as THREE from 'three';
export class LightParticles {
  private lightParticlesGeometry: THREE.BufferGeometry;
  private lightParticlesMaterial: THREE.RawShaderMaterial;
  private count: number;
  private positionArray: Float32Array;
  private scaleArray: Float32Array;
  private clock: THREE.Clock;

  public lightParticles: THREE.Points;

  constructor(scene: THREE.Scene) {
    this.lightParticlesGeometry = new THREE.BufferGeometry();
    this.count = 200;
    this.positionArray = new Float32Array(this.count * 3);
    this.scaleArray = new Float32Array(this.count);

    for (let i = 0; i < this.count; i++) {
      this.positionArray[i * 3 + 0] = (Math.random() - 0.5) * 20;
      this.positionArray[i * 3 + 1] = Math.random() * 25;
      this.positionArray[i * 3 + 2] = (Math.random() - 0.5) * 70;
      this.scaleArray[i] = Math.random();
    }

    this.lightParticlesGeometry.setAttribute('aScale', new THREE.BufferAttribute(this.scaleArray, 1));
    this.lightParticlesMaterial = new THREE.RawShaderMaterial({
      uniforms: {
        u_size: {value: 200.0},
        u_time: {value: 0.0},
        u_PixelRatio: {value: Math.min(window.devicePixelRatio, 2)}
      },
      vertexShader: `
                   attribute vec3 position;
                   attribute float aScale;
                   uniform mat4 projectionMatrix;
                   uniform mat4 modelViewMatrix;

                   uniform float u_PixelRatio;
                   uniform float u_size;
                   uniform float u_time;
             
             
                   void main() {
                    vec4 modelPosition = modelViewMatrix * vec4(position, 1.0);
                    vec4 projectionPosition = projectionMatrix * modelPosition;
                    projectionPosition.y += sin(u_time + position.x * 100.0) * aScale * 0.2;;

                     gl_Position = projectionPosition;
                     gl_PointSize = u_size * aScale * u_PixelRatio;
                     gl_PointSize *= (1.0 / - modelPosition.z);
                   }
                   `,
      fragmentShader: `
                   precision mediump float;
            
             
                   void main() {
                    float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
                    float strength = 0.05 / distanceToCenter - 0.1;
                    gl_FragColor = vec4(1.0, 1.0, 1.0, strength);
                   }
                   `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    this.lightParticlesGeometry.setAttribute('position', new THREE.BufferAttribute(this.positionArray, 3));

    this.lightParticles = new THREE.Points(this.lightParticlesGeometry, this.lightParticlesMaterial);

    this.clock = new THREE.Clock();

    scene.add(this.lightParticles);

    window.addEventListener('resize', () => {
      this.lightParticlesMaterial.uniforms.u_PixelRatio.value = Math.min(window.devicePixelRatio, 2);
    });

    this.render();
  }

  private render(): void {
    const elapsedTime = this.clock.getElapsedTime();

    if (this.lightParticles) {
      this.lightParticlesMaterial.uniforms.u_time.value = elapsedTime;
    }

    window.requestAnimationFrame(() => this.render());
  }
}
