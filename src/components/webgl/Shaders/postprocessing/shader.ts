import {snoise} from '../functions/noise';

export const postProcessingShader = {
  uniforms: {
    tDiffuse: {value: null},
    opacity: {value: 1.0},
    scrollSpeed: {value: 0.0}
  },
  vertexShader: /* glsl */ `
		varying vec2 vUv;
        varying vec3 vPosition;
		void main() {
			vUv = uv;
            vPosition = position;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,

  fragmentShader: /* glsl */ `
		uniform float opacity;
		uniform sampler2D tDiffuse;
        uniform float scrollSpeed;

		varying vec2 vUv;
        varying vec3 vPosition;


    ${snoise}

		void main() {
            vec2 newUv = vUv;

            float distort = snoise(vPosition);

            newUv.x += vUv.x * distort * scrollSpeed;

            vec4 texel = texture2D( tDiffuse, newUv );

            newUv.y += 0.80 * scrollSpeed;
            texel.g = texture2D(tDiffuse, newUv).g;

            newUv.y += 0.80 * scrollSpeed;
            texel.b = texture2D(tDiffuse, newUv).b;

            newUv.y += 0.80 * scrollSpeed;
            texel.b = texture2D(tDiffuse, newUv).b;

            gl_FragColor = opacity * texel;
		}`
};
