export const fragmentShader = `
precision mediump float;
uniform sampler2D u_texture;

varying vec2 vUv;
varying float vTime;

void main() {
  vec2 repeat = vec2(2., 2.);

  vec3 texture = texture2D(u_texture, vUv).rgb;


  gl_FragColor = vec4(texture, 1.);
}
`;
