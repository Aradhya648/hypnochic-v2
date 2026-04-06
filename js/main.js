/* ─── main.js ─── */
(function () {
  var lastTime  = 0;
  var animating = false;
  var modeEl;

  var MODES = {
    point:     { label: '⊳  REPEL',     color: '#a78bfa', key: '1' },
    palm:      { label: '✦  ATTRACT',   color: '#ec4899', key: '2' },
    fist:      { label: '◉  SHOCKWAVE', color: '#ff6400', key: '3' },
    'fist-hold':{ label: '◉  SHOCKWAVE', color: '#ff6400', key: '3' },
    pinch:     { label: '✺  EXPLODE',   color: '#ffffff', key: '4' },
    none:      { label: '',             color: '#555', key: '' }
  };

  // ── Fallback input (keyboard + mouse) ──
  var fallback = false;          // true when camera denied
  var mouseDown = false;
  var mouseX = 0, mouseY = 0;
  var fallbackMode = 'point';
  var shakeCooldown = 0;
  var explodeCooldown = 0;
  var effectsActive = { bloom: true, chromatic: true };
  var SCENE_MODES = ['default','cosmic','zen','chaos'];
  var sceneModeIndex = 0;

  // ── FPS counter state ──
  var fpsFrames = 0;
  var fpsElapsed = 0;
  var fpsDisplay = 0;
  var fpsVisible = false;
  var fpsEl;

  document.addEventListener('DOMContentLoaded', function () {
    fpsEl = document.getElementById('fps-counter');
    modeEl = document.getElementById('gesture-mode');

    document.getElementById('allow-btn').addEventListener('click', function () {
      CameraManager.requestPermission();
    });

    // Camera denied → enable fallback
    window.addEventListener('hypnochic-fallback', function () {
      fallback = true;
      if (fpsEl) fpsEl.style.display = 'block';
      var hint = document.getElementById('controls-hint');
      if (hint) hint.style.display = 'block';
    });

    window.addEventListener('hypnochic-ready', function () {
      SceneManager.init();
      ObjectManager.init(SceneManager.getScene());
      SceneManager.applySceneMode('default'); // ensure correct color palette
      ParticleSystem.init(SceneManager.getScene());
      GestureDetector.init();

      if (!animating) {
        animating = true;
        lastTime  = performance.now();
        requestAnimationFrame(loop);
      }
    });

    // ── Keyboard controls ──
    document.addEventListener('keydown', function (e) {
      var key = e.key.toLowerCase();
      var objects = ObjectManager.getObjects();

      if (key === 'f') {
        fpsVisible = !fpsVisible;
        if (fpsEl) fpsEl.style.display = fpsVisible ? 'block' : 'none';
        return;
      }

      if (key === 'r') {
        for (var i = 0; i < objects.length; i++) {
          var o = objects[i];
          o.mesh.position.set(o.basePosition.x, o.basePosition.y, o.basePosition.z);
          o.velocity = { x: 0, y: 0, z: 0 };
          o.rotationSpeed.x *= 0.1;
          o.rotationSpeed.y *= 0.1;
        }
        return;
      }

      if (key === 'b') {
        var chroma = SceneManager.getChromatic();
        if (chroma) {
          effectsActive.chromatic = !effectsActive.chromatic;
          chroma.enabled = effectsActive.chromatic;
        }
        return;
      }

      if (key === 'c' || key === 'C') {
        var bloom = SceneManager.getBloomPass();
        if (bloom) {
          effectsActive.bloom = !effectsActive.bloom;
          bloom.enabled = effectsActive.bloom;
        }
        return;
      }

      if (key === 'm') {
        sceneModeIndex = (sceneModeIndex + 1) % SCENE_MODES.length;
        var modeName = SCENE_MODES[sceneModeIndex];
        SceneManager.applySceneMode(modeName);
        var ind = document.getElementById('mode-indicator');
        if (ind) {
          ind.textContent = modeName.toUpperCase();
          ind.style.display = 'block';
        }
        return;
      }

      if (key >= '1' && key <= '4') {
        fallbackMode = ['point','palm','fist','pinch'][parseInt(key) - 1];
        setModeUI(fallbackMode);
        return;
      }
    });

    // ── Mouse controls ──
    var canvas = document.getElementById('hypnochic-canvas');
    canvas.addEventListener('mousedown', function (e) { mouseDown = true; });
    canvas.addEventListener('mouseup',   function ()  { mouseDown = false; });
    canvas.addEventListener('mouseleave',function ()  { mouseDown = false; });
    canvas.addEventListener('mousemove', function (e) {
      if (!mouseDown || !fallback) return;

      var x = (e.clientX / window.innerWidth  - 0.5) * 16;
      var y = -(e.clientY / window.innerHeight - 0.5) * 10;
      var position = { x: x, y: y, z: 0 };

      var objects = ObjectManager.getObjects();

      if (fallbackMode === 'point') {
        PhysicsEngine.applyRepulsion(objects, [position]);
      } else if (fallbackMode === 'palm') {
        PhysicsEngine.applyAttraction(objects, position);
      }
    });

    // Touch support (mobile)
    canvas.addEventListener('touchstart', function (e) {
      e.preventDefault();
      mouseDown = true;
    }, { passive: false });
    canvas.addEventListener('touchend', function () { mouseDown = false; });
    canvas.addEventListener('touchmove', function (e) {
      if (!mouseDown || !fallback) return;
      e.preventDefault();
      var touch = e.touches[0];
      var x = (touch.clientX / window.innerWidth  - 0.5) * 16;
      var y = -(touch.clientY / window.innerHeight - 0.5) * 10;
      var position = { x: x, y: y, z: 0 };

      var objects = ObjectManager.getObjects();

      if (fallbackMode === 'point') {
        PhysicsEngine.applyRepulsion(objects, [position]);
      } else if (fallbackMode === 'palm') {
        PhysicsEngine.applyAttraction(objects, position);
      }
    }, { passive: false });
  });

  function setModeUI(type) {
    if (!modeEl) return;
    var m = MODES[type] || MODES.none;
    modeEl.textContent  = m.label;
    modeEl.style.color  = m.color;
    modeEl.style.textShadow = '0 0 12px ' + m.color;
    modeEl.style.opacity = m.label ? '1' : '0';
  }

  function loop(timestamp) {
    requestAnimationFrame(loop);

    var deltaTime = Math.min((timestamp - lastTime) / 1000, 0.05);
    lastTime = timestamp;

    // FPS
    fpsFrames++;
    fpsElapsed += deltaTime;
    if (fpsElapsed >= 0.5) {
      fpsDisplay = Math.round(fpsFrames / fpsElapsed);
      fpsFrames = 0;
      fpsElapsed = 0;
      if (fpsEl) fpsEl.textContent = fpsDisplay + ' FPS';
    }

    var handData = HandTracker.getHandData();
    var objects  = ObjectManager.getObjects();
    var gesture = null;

    if (!fallback && handData.isTracked) {
      // Camera mode — use MediaPipe
      gesture = GestureDetector.detect(handData);
      setModeUI(gesture.type);
      HandTracker.draw(gesture.type);
    } else if (fallback) {
      gesture = { type: fallbackMode, position: null, raw: null };
      setModeUI(fallbackMode);
    } else {
      gesture = { type: 'none', position: null, raw: null };
    }

    if (gesture.position) {
      if (gesture.type === 'point') {
        PhysicsEngine.applyRepulsion(objects, [gesture.position]);
      }

      if (gesture.type === 'palm') {
        PhysicsEngine.applyAttraction(objects, gesture.position);
      }

      if (gesture.type === 'fist') {
        PhysicsEngine.applyShockwave(objects, gesture.position);
        if (gesture.raw) HandTracker.addRing(gesture.raw, '#ff6400');
      }

      if (gesture.type === 'pinch') {
        ParticleSystem.triggerExplosion(gesture.position.x, gesture.position.y, gesture.position.z);
        if (gesture.raw) HandTracker.addRing(gesture.raw, '#ffffff');
      }
    }

    PhysicsEngine.applyDamping(objects);
    PhysicsEngine.applyBoundaries(objects);
    PhysicsEngine.applyReturnForce(objects);

    ObjectManager.update();
    ParticleSystem.update(deltaTime);
    SceneManager.render();
  }
})();
