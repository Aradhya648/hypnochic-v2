/* ─── scene.js ─── */
window.SceneManager = (function () {
  var renderer, scene, camera;
  var composer, bloomPass, chromaticPass;

  // Custom Chromatic Aberration shader
  var ChromaticAberrationShader = {
    uniforms: {
      "tDiffuse": { value: null },
      "amount":   { value: 0.002 }  // strength
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
        // Subtle radial RGB shift
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

    // EffectComposer pipeline
    composer = new THREE.EffectComposer(renderer);

    // RenderPass renders the scene normally first
    var renderPass = new THREE.RenderPass(scene, camera);
    composer.addPass(renderPass);

    // UnrealBloomPass for glow
    bloomPass = new THREE.UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.2,   // strength
      0.4,   // radius
      0.85   // threshold
    );
    composer.addPass(bloomPass);

    // Custom Chromatic Aberration
    chromaticPass = new THREE.ShaderPass(ChromaticAberrationShader);
    composer.addPass(chromaticPass);

    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    // Camera
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 12);

    // Ambient light
    var ambient = new THREE.AmbientLight(0x7c3aed, 0.3);
    scene.add(ambient);

    // Point light
    var point = new THREE.PointLight(0xa78bfa, 1.0);
    point.position.set(5, 5, 5);
    scene.add(point);

    // Second fill light
    var fill = new THREE.PointLight(0xec4899, 0.5);
    fill.position.set(-5, -3, 3);
    scene.add(fill);

    // Resize handler — update both renderer and composer
    window.addEventListener('resize', function () {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      composer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  function getScene()       { return scene; }
  function getCamera()      { return camera; }
  function getRenderer()    { return renderer; }
  function getComposer()    { return composer; }
  function getBloomPass()   { return bloomPass; }
  function getChromatic()   { return chromaticPass; }

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
    render: render
  };
})();
