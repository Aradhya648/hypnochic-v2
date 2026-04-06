/* ─── scene.js ─── */
window.SceneManager = (function () {
  var renderer, scene, camera;
  var composer, bloomPass, chromaticPass;
  var ambientLight, pointLight, fillLight;

  // Mode definitions
  var MODES = {
    default: {
      background: new THREE.Color(0x000000),
      ambient: { color: 0x7c3aed, intensity: 0.3 },
      point:   { color: 0xa78bfa, intensity: 1.0 },
      fill:    { color: 0xec4899, intensity: 0.5 },
      palette: [0x7c3aed, 0xa78bfa, 0xec4899]
    },
    cosmic: {
      background: new THREE.Color(0x050510),
      ambient: { color: 0x1e3a8a, intensity: 0.2 },
      point:   { color: 0x60a5fa, intensity: 1.2 },
      fill:    { color: 0xa855f7, intensity: 0.6 },
      palette: [0x60a5fa, 0xa855f7, 0xf472b6]
    },
    zen: {
      background: new THREE.Color(0xe0f2f1),
      ambient: { color: 0x004d40, intensity: 0.5 },
      point:   { color: 0x00695c, intensity: 0.9 },
      fill:    { color: 0x4db6ac, intensity: 0.5 },
      palette: [0x004d40, 0x00695c, 0x4db6ac]
    },
    chaos: {
      background: new THREE.Color(0x1a0000),
      ambient: { color: 0x7f1d1d, intensity: 0.4 },
      point:   { color: 0xef4444, intensity: 1.3 },
      fill:    { color: 0xf59e0b, intensity: 0.7 },
      palette: [0xef4444, 0xf59e0b, 0x10b981]
    }
  };

  // Chromatic Aberration Shader
  var ChromaticAberrationShader = {
    uniforms: {
      "tDiffuse": { value: null },
      "amount":   { value: 0.002 }
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D tDiffuse;
      uniform float amount;
      varying vec2 vUv;

      void main() {
        vec2 uv = vUv;
        vec2 center = vec2(0.5, 0.5);
        vec2 dir = uv - center;
        float dist = length(dir);
        vec2 rUv = uv + dir * amount * 0.8;
        vec2 gUv = uv + dir * amount * 0.2;
        vec2 bUv = uv - dir * amount * 0.6;
        float r = texture2D(tDiffuse, rUv).r;
        float g = texture2D(tDiffuse, gUv).g;
        float b = texture2D(tDiffuse, bUv).b;
        gl_FragColor = vec4(r, g, b, 1.0);
      }
    `
  };

  function init() {
    var canvas = document.getElementById('hypnochic-canvas');

    // Renderer
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 1);

    // EffectComposer
    composer = new THREE.EffectComposer(renderer);
    var renderPass = new THREE.RenderPass(scene, camera);
    composer.addPass(renderPass);

    bloomPass = new THREE.UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.2, 0.4, 0.85
    );
    composer.addPass(bloomPass);

    chromaticPass = new THREE.ShaderPass(ChromaticAberrationShader);
    composer.addPass(chromaticPass);

    // Scene
    scene = new THREE.Scene();
    scene.background = MODES.default.background;

    // Camera
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 12);

    // Lights
    ambientLight = new THREE.AmbientLight(MODES.default.ambient.color, MODES.default.ambient.intensity);
    scene.add(ambientLight);

    pointLight = new THREE.PointLight(MODES.default.point.color, MODES.default.point.intensity);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    fillLight = new THREE.PointLight(MODES.default.fill.color, MODES.default.fill.intensity);
    fillLight.position.set(-5, -3, 3);
    scene.add(fillLight);

    // Resize
    window.addEventListener('resize', function () {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      composer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  function getScene()    { return scene; }
  function getCamera()   { return camera; }
  function getRenderer() { return renderer; }
  function getComposer() { return composer; }
  function getBloomPass(){ return bloomPass; }
  function getChromatic(){ return chromaticPass; }

  function applySceneMode(name) {
    var mode = MODES[name] || MODES.default;
    scene.background = mode.background;
    ambientLight.color.setHex(mode.ambient.color);
    ambientLight.intensity = mode.ambient.intensity;
    pointLight.color.setHex(mode.point.color);
    pointLight.intensity = mode.point.intensity;
    fillLight.color.setHex(mode.fill.color);
    fillLight.intensity = mode.fill.intensity;

    var objects = ObjectManager.getObjects();
    for (var i = 0; i < objects.length; i++) {
      var idx = i % mode.palette.length;
      var col = mode.palette[idx];
      var mat = objects[i].mesh.material;
      mat.color.setHex(col);
      mat.emissive.setHex(col);
    }
  }

  function render() {
    composer.render();
  }

  return {
    init: init,
    getScene: getScene,
    getCamera: getCamera,
    getRenderer: getRenderer,
    getComposer: getComposer,
    getBloomPass: getBloomPass,
    getChromatic: getChromatic,
    applySceneMode: applySceneMode
  };
})();
