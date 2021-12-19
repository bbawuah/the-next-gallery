export const fragmentShaderThree = `
precision mediump float;
uniform sampler2D u_texture;

varying vec2 vUv;
varying float vTime;


void main() {
  vec2 uv = vUv;
  
  vec2 repeat = vec2(3.,3.);

  float strength = distance(vec2(vUv.y, (vUv.x - 0.3) * 1.0 + 0.5), vec2(0.5));
  
  vec2 newUv = fract(uv * vec2(strength) * repeat + sin(vec2(0.0, -vTime * 1.25)));
  
  vec3 texture = texture2D(u_texture, newUv).rgb;
  
	gl_FragColor = vec4(texture, 1.0);
}
`;
