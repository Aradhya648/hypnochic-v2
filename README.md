# HypnoChic

Interactive 3D particle experience driven by your hands — or your mouse.

Built with Three.js and MediaPipe Hands.

---

<a href="#-live-demo">Live Demo</a> · <a href="#-gestures">Gestures</a> · <a href="#-quick-start">Quick Start</a> · <a href="#-controls">Controls</a>

## What is this?

HypnoChic turns your hand movements into physics. Point to repel, open palm to attract, fist to shockwave, pinch to explode. 20 floating geometries react in real-time with trails, particles, and glow effects.

No camera? Keyboard and mouse controls work as a fallback.

## Gestures

| Gesture | Hand | Effect |
|---------|------|--------|
| **☝️ Point** | Index finger extended only | Repel objects (push away from fingertip) |
| **🖐️ Palm** | 3+ fingers extended | Attract objects (pull toward palm center) |
| **✊ Fist** | Closed fist | Shockwave blast (knocks everything outward) |
| **🤏 Pinch** | Thumb + index tips touching | Particle explosion burst |

## Quick Start

```bash
# Clone
git clone https://github.com/Aradhya648/hypnochic-v2.git
cd hypnochic-v2

# Run — just serve the static files (any of these works):
# Option 1: Python
python3 -m http.server 3000

# Option 2: Node
npx serve . -p 3000

# Option 3: VS Code
# Open folder → Right-click index.html → Open with Live Server
```

Then open `http://localhost:3000`.

### No server needed

Open `index.html` directly in a browser. MediaPipe loads from CDN, so you just need internet.

### Camera permission

Click **Allow Camera** → approve the browser prompt. If denied, keyboard/mouse fallbacks still work.

## Controls

### Camera mode
Just move your hand. MediaPipe auto-detects gestures.

### Keyboard / Mouse fallback
If camera is denied or unavailable:

| Key | Action |
|-----|--------|
| **1** | Repel mode |
| **2** | Attract mode |
| **3** | Shockwave |
| **4** | Explosion |
| **R** | Reset all objects to initial positions |
| **F** | Toggle FPS counter |

**Mouse** — Left-click and drag to repel/attract objects (mode-dependent).

## Tech

- **Three.js** r128 — Web 3D rendering
- **MediaPipe Hands** — Hand tracking
- Vanilla JS (IIFE modules) — zero build step

## Structure

```
├── index.html        # Entry point, loads libs from CDN
├── css/
│   └── styles.css    # UI styling + animations
└── js/
    ├── scene.js      # Three.js scene, camera, renderer
    ├── objects.js    # Mesh pool + trails
    ├── particles.js  # Particle burst system
    ├── physics.js    # Repulsion, attraction, shockwave, damping
    ├── gestures.js   # MediaPipe landmark → gesture detection
    ├── handTracker.js# MediaPipe setup + skeleton rendering
    ├── camera.js     # Camera permission + video stream
    └── main.js       # Animation loop + glue
```

## License

MIT

## Authors

Aradhya Mishra · Maneesh Awasthi
