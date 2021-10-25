export const fragmentShader = `precision mediump float;
uniform sampler2D u_texture;


varying vec2 vUv;
varying float vTime;

void main() {
  vec2 repeat = vec2(5., 5.);

  float eye = 2.35;

  vec2 strengthCenterOne = vec2(0.5, 0.9);
  vec2 strengthCenterTwo = vec2(0.1, 0.125);
  vec2 strengthCenterThree = vec2(0.5, 0.125);
  vec2 strengthCenterFour = vec2(0.1, .9);
  

  float strength = distance(vUv, strengthCenterOne) * eye;
  strength *= distance(vUv, strengthCenterTwo) * eye;
  strength *= distance(vUv, strengthCenterThree) * eye;
  strength *= distance(vUv, strengthCenterFour) * eye;

  vec2 uv = fract(vUv * vec2(strength) * repeat + vec2(-vTime * 1.25, 0.0));


  uv *= strength;
  
  vec3 texture = texture2D(u_texture, uv).rgb;


  gl_FragColor = vec4(texture, 1.);
}
`;
