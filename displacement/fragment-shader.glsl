varying vec2 vUv;

uniform float dispFactor;
uniform sampler2D disp;
uniform sampler2D texture1;
uniform sampler2D texture2;
uniform float angle1;
uniform float angle2;
uniform float intensity1;
uniform float intensity2;

mat2 getRotM(float angle) {
  float s = sin(angle);
  float c = cos(angle);
  return mat2(c, -s, s, c);
}

mat2 scale(vec2 _scale){
    return mat2(_scale.x,0.0,
                0.0,_scale.y);
}

void main() {
  vec2 st = vUv;
  vec4 disp = texture2D(disp, vUv);
  vec2 dispVec = vec2(disp.r, disp.g);
  vec2 direction = vec2(5, 0);
  //vec2 distortedPosition1 = vUv * dispVec * intensity1 * dispFactor;
  //vec2 distortedPosition2 = vUv * dispVec * intensity2 * dispFactor;
  //vec2 distortedPosition1 = vUv + getRotM(angle1) * dispVec * intensity1 * dispFactor;
  //vec2 distortedPosition2 = vUv + getRotM(angle2) * dispVec * intensity2 * (1.0 - dispFactor);
  //vec4 _texture1 = texture2D(texture1, distortedPosition1);
  //vec4 _texture2 = texture2D(texture1, distortedPosition2);
  //vec4 _texture1 = texture2D(texture1, vUv * dispFactor);

  // SCALE
  st -= vec2(0.5);
  st = scale( vec2(sin(dispFactor)+1.0) ) * st;
  st += vec2(0.5);
  //vec4 disp = texture2D(disp, st);
  //vec2 dispVec = vec2(disp.r, disp.g);

  vec4 mask = texture2D(texture2, st);
  vec4 color = texture2D(texture1, dispVec * dispFactor);
  color = color * mask.a;
  color = mask;

  //vec2 off1 = vec2(1.3846153846) * direction;
  //vec2 off2 = vec2(3.2307692308) * direction;
  //color += texture2D(texture1, st) * 0.2270270270;
  //color += texture2D(texture1, st + (off1)) * 0.3162162162;
  //color += texture2D(texture1, st - (off1)) * 0.3162162162;
  //color += texture2D(texture1, st + (off2)) * 0.0702702703;
  //color += texture2D(texture1, st - (off2)) * 0.0702702703;

  //gl_FragColor = mix(_texture1, _texture2, 0.5);

  gl_FragColor = color;
}
