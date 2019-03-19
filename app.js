import * as THREE from 'three.js';
import * as async from 'async';
import TweenMax from 'gsap/TweenMax';

import maskAsset from './mask.svg';
import backgroundAsset from './bg5.jpg';
import background2Asset from './bg3.jpg'
import blueAsset from './blue.png';

import image1 from './Img22.jpg';
import image2 from './Img26.jpg';
import disp from './1.jpg';

import {
  vertexShader,
  fragmentShader
} from './displacement';

const height = window.innerHeight;
const width = window.innerWidth;
console.log(height, width)

const renderer = new THREE.WebGLRenderer({
  alpha: true,
  antialias: true
});
renderer.setClearColor(0x000000, 0);
renderer.autoClear = false;
renderer.setSize(width, height);

const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

const scene = new THREE.Scene();

loadDisplacement()

function loadDisplacement() {
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setClearColor(0xffffff, 0.0);

  var intensity1 = 1;
  var intensity2 = 1;
  var commonAngle = Math.PI / 4; // 45 degrees by default, so grayscale images work correctly
  var angle1 = commonAngle;
  var angle2 = -commonAngle * 3;
  var speedIn = 10;
  var speedOut = 10;
  var userHover = true;
  var easing = Expo.Rough;

  const textureLoader = new THREE.TextureLoader();

  async.parallel([
    (callback) => textureLoader.load(backgroundAsset, (result) => callback(null, result)),
    (callback) => textureLoader.load(maskAsset, (result) => callback(null, result)),
    (callback) => textureLoader.load(disp, (result) => callback(null, result)),
  ], (error, [texture1, texture2, disp]) => {
    disp.wrapS = disp.wrapT = THREE.RepeatWrapping;
    texture2.wrapS = texture2.wrapT = THREE.ClampToEdgeWrapping;

    texture1.magFilter = texture2.magFilter = THREE.LinearFilter;
    texture1.minFilter = texture2.minFilter = THREE.LinearFilter;

    const material = new THREE.ShaderMaterial({
      uniforms: {
        intensity1: {
          type: 'f',
          value: intensity1
        },
        intensity2: {
          type: 'f',
          value: intensity2
        },
        dispFactor: {
          type: 'f',
          value: 0.0
        },
        angle1: {
          type: 'f',
          value: angle1
        },
        angle2: {
          type: 'f',
          value: angle2
        },
        texture1: {
          type: 't',
          value: texture1
        },
        texture2: {
          type: 't',
          value: texture2
        },
        disp: {
          type: 't',
          value: disp
        },
        zoom: {
          type: 'f',
          value: 10.0
        }
      },

      vertexShader,
      fragmentShader
    });

    var geometry = new THREE.PlaneGeometry(2, 2, 1);
    var mesh = new THREE.Mesh(geometry, material);
    /*var imageMaterial = new THREE.MeshBasicMaterial({
      map: texture1,
      alphaMap: texture2,
      transparent: false,
      depthWrite: false
    });

    var mesh = new THREE.Mesh(geometry, imageMaterial)*/
    scene.add(mesh);

    document.body.appendChild(renderer.domElement);

    var render = function () {
      // This will be called by the TextureLoader as well as TweenMax.
      renderer.render(scene, camera);
    };

    animateIn()

    function animateIn() {
      TweenMax.to(material.uniforms.dispFactor, speedIn, {
        value: 1,
        ease: easing,
        onUpdate: render,
        onComplete: animateOut
      });
    }

    function animateOut() {
      TweenMax.to(material.uniforms.dispFactor, speedOut, {
        value: 0,
        ease: easing,
        onUpdate: render,
        onComplete: animateIn
      });

    }
  })
}

function loadPaint() {
  new THREE.TextureLoader().load(blueAsset, (background) => {
    const uniforms = {
      time: {
        type: 'f',
        value: 0
      },
      resolution: new THREE.Uniform(new THREE.Vector2(width, height)),
      texture: {
        type: 't',
        value: background
      }
    };

    const material = new THREE.ShaderMaterial({
      uniforms,
      fragmentShader
    });

    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);

    scene.add(mesh);

    document.body.appendChild(renderer.domElement);

    let time = 0;

    animate();

    function animate() {
      renderer.render(scene, camera);
      time++;

      mesh.material.uniforms.time.value = time / 100;

      requestAnimationFrame(animate)
    }
  });
}

function loadWatercolor() {
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
}