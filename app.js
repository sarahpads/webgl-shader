import * as THREE from 'three.js';
import * as async from 'async';

import maskAsset from './mask.png';
import backgroundAsset from './bg2.jpg';

import vertexShader from './vertex-shader.glsl';
import fragmentShader from './fragment-shader.glsl';

const renderer = new THREE.WebGLRenderer({
  alpha: true,
  antialias: true
});
renderer.setClearColor(0x000000, 0);
renderer.autoClear = false;
renderer.setSize(window.innerWidth, window.innerHeight);

const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

const scene = new THREE.Scene();

const textureLoader = new THREE.TextureLoader();

async.parallel([
  (callback) => textureLoader.load(backgroundAsset, (result) => callback(null, result)),
  (callback) => textureLoader.load(maskAsset, (result) => callback(null, result))
], (error, [background, mask]) => {

  const uniforms = {
    Texture: {
      type: 't',
      value: background
    },
    Mask: {
      type: 't',
      value: mask
    },
    Amplitude: {
      type: 'f',
      value: 50
    },
    Frequency: {
      type: 'f',
      value: 10
    }
  }

  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader
  });

  const mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(2, 2), material);
  scene.add(mesh);

  document.body.appendChild(renderer.domElement);

  const options = {
    fromAmplitude: 80,
    toAmplitude: 0,

    fromFrequency: 8,
    toFrequency: 7,

    fromOffset: -30,
    toOffset: 28,
  };

  const duration = 8000;
  let timer = 0;

  animate();

  function animate() {
    renderer.render(scene, camera);

    const percent = (timer / duration);

    const amplitude = options.fromAmplitude - ((options.fromAmplitude - options.toAmplitude) * percent);
    const frequency = options.fromFrequency - ((options.fromFrequency - options.toFrequency) * percent);

    // stop animating if these values get to 0 or lower 
    if (percent === 1) {
      return;
    }

    mesh.material.uniforms.Amplitude.value = amplitude;
    mesh.material.uniforms.Frequency.value = frequency;

    timer += 10;
    requestAnimationFrame(animate);
  }
});