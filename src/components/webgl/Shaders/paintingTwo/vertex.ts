export const vertexShaderTwo = `
attribute vec2 uv;
attribute vec3 position;
attribute vec3 normal;
uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

uniform float u_time;

varying vec2 vUv;
varying float vTime;
varying vec3 vPosition;

void main() {
  float time = u_time * 0.125;
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
  vUv = uv;
  vTime = time; 
  vPosition = position;
}
`;
