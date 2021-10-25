export const fragmentShaderTwo = `
precision mediump float;
uniform vec2 u_resolution;

varying vec2 vUv;
varying float vTime;

float rand(vec2 n) {
  return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 ip = floor(p);
  vec2 u = fract(p);
  u = u*u*(3.0-2.0*u);

  float res = mix(
      mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),
      mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);
  return res*res;
}

const mat2 m2 = mat2(0.8,-0.6,0.6,0.8);

float fbm( vec2 p ){
  float f = 0.0;
  f += 0.8*noise( p ); p = m2*p*2.0;
  f += 0.3*noise( p ); p = m2*p*2.07;
  f += 0.027*noise( p ); p = m2*p*2.01;
  f += 0.02*noise( p );

  return f/0.769;
}

float pattern( vec2 p ) {
  vec2 q = vec2(fbm(p + vec2(0.0,0.0)));
  vec2 r = vec2( fbm( p + 4.0*q + vec2(1.7,9.2)));
  r+= vTime * 0.4;
  return fbm( p + 1.760*r );
}

vec3 palette(float t,  vec3 a,  vec3 b, vec3 c, vec3 d )
{
    return a + b*cos( 6.28318*(c*t+d) );
}

void main() {
  vec2 uv = vUv;
    
  uv *= 4.5; // Scale UV to make it nicer in that big screen !

  float displacement = pattern(uv);
  
  vec4 color = vec4(palette(0.8, vec3(2.5, 2.5, 2.5) * displacement, vec3(1.3, 1.5, 1.9) * displacement, vec3(.6, .2, 0.0) * displacement, vec3(0.9, 0.2, 0.7)), 1.0);

  gl_FragColor = color;
}
`;
