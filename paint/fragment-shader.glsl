uniform vec2 resolution;
uniform sampler2D texture;
uniform float time;

varying vec2 vUv;

const float Pi = 3.14159;
const int   complexity      = 47;    // More points of color.
const float fluid_speed     = 250.0;  // Drives speed, higher number will make it slower.
const float color_intensity = 0.6;

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  uv.x *= resolution.x / resolution.y;

  vec2 p = (2.0 * gl_FragCoord.xy - resolution) / max(resolution.x, resolution.y);

  for(int i = 1; i < complexity; i++) {
    vec2 newp = p + time * 0.001;
    newp.x += 0.6 / float(i) * sin(float(i) * p.y + time / fluid_speed + 0.3 * float(i)) + 0.5;
    newp.y += 0.6 / float(i) * sin(float(i) * p.x + time / fluid_speed + 0.3 * float(i+10)) - 0.5;
    p = newp;
  }

  vec4 texture = texture2D(texture, p);

  gl_FragColor = vec4(texture);
}
