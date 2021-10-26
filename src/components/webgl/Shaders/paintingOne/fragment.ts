export const fragmentShader = `precision mediump float;
uniform sampler2D u_texture;


varying vec2 vUv;
varying float vTime;

void main() {
  vec2 repeat = vec2(10.,5.);

  float eye = 0.95;

  vec2 strengthCenterOne = vec2(0.3, 0.5);
  
  float strength = distance(vUv, strengthCenterOne) * eye;

  vec2 uv = fract(vec2(vUv.x, vUv.y + 1.75) * vec2(strength) * repeat + vec2(-vTime * 1.35, 0.0));

  uv -= strength;
  
  vec3 texture = texture2D(u_texture, uv).rgb;

  gl_FragColor = vec4(texture, 1.);
}
`;
