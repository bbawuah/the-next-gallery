export const vertex = `
uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
attribute vec2 uv;
attribute vec3 position;
attribute vec3 normal;

varying vec2 v_uv;

void main() {
  gl_Position = projectionMatrix * viewMatrix * vec4(position, 1.0);

  v_uv = uv;
}
`;
