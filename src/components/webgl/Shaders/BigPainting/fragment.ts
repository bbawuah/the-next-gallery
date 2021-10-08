export const fragment = `
precision mediump float;

uniform float u_time;

varying vec2 v_uv;

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
    f += 0.9*noise( p ); p = m2*p*2.07;
    f += 0.027*noise( p ); p = m2*p*2.01;
    f += 0.02*noise( p );

    return f/0.769;
}

float pattern( vec2 p ) {
    vec2 q = vec2(fbm(p + vec2(0.0,0.0)));
    vec2 r = vec2( fbm( p + 4.0*q + vec2(1.7,9.2)));
    r+= u_time * 0.15;
    return fbm( p + 1.760*r );
  }
  
  vec3 palette( float t, vec3 a, vec3 b, vec3 c, vec3 d )
  {
      return a + b*cos( 6.28318*(c*t+d) );
  }

void main(void) {
  vec2 custom_uv = v_uv;

  custom_uv *= 6.5;

  float displacement = pattern(custom_uv);

  vec4 color = vec4(palette(.5, vec3(0.5, 2., 1.) * displacement, vec3(5.0, 0.3, 3.0) * displacement, vec3(.65, .2, 0.0) * displacement, vec3(0.90, 0.20, 0.75)), 1.0);
    
  color.a = min(color.r * 0.25, 1.);
  
  gl_FragColor = vec4(color);
}
`;
