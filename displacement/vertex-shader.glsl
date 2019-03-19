varying vec2 vUv;

uniform float zoom;
uniform float dispFactor;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0);
}