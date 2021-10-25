export const fragmentShader = `precision mediump float;
uniform sampler2D u_texture;


varying vec2 vUv;
varying float vTime;

void main() {
  vec2 repeat = vec2(3., 3.);

  float eye = 6.;

  vec2 strengthCenterOne = vec2(0.3, 0.5);
  

  float strength = distance(vUv, strengthCenterOne) * eye;

  vec2 uv = fract(vUv * vec2(strength) * repeat + vec2(-vTime * 1.25, 0.0));


  uv *= strength;
  
  vec3 texture = texture2D(u_texture, uv).rgb;


  gl_FragColor = vec4(texture, 1.);
}
`;
