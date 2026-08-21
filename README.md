# personal-website

Bn0u0's personal digital laboratory — a living index of projects, systems, games, research and experiments.

## Direction

**Minimal surface. Deep interaction.**

The interface stays visually quiet while motion, project transitions and interaction carry the identity.

Current design language:

- warm off-white / black editorial layout
- oversized typography and large negative space
- BN0U0 identity with Pale Sage `#B4C2BE`
- hidden native scrollbar + 1px top scroll progress
- fast inertial custom cursor with contextual states
- magnetic navigation micro-interactions
- smooth Lenis scrolling with native-scroll fallback
- progressive in-view reveals
- responsive mobile layout
- `prefers-reduced-motion` support

## Selected projects

1. PicNest 2.0
2. Quant Research System
3. Grass Cutting 3min
4. Doodle Tyrant
5. Learning Games
6. Pixel Lab

## Architecture

The site is a build-free static project. Files are grouped by responsibility so the repository root stays readable:

```text
/
├─ index.html
├─ README.md
├─ vercel.json
├─ assets/
│  └─ favicon.svg
├─ styles/
│  ├─ site.css
│  ├─ about.css
│  ├─ archive.css
│  ├─ project-details.css
│  ├─ cursor-contrast.css
│  ├─ elastic-grid.css
│  ├─ surface-integration.css
│  ├─ section-cues.css
│  └─ timeline.css
└─ scripts/
   ├─ site.js
   ├─ about.js
   ├─ archive.js
   ├─ project-details.js
   ├─ quant-story.js
   ├─ lang.js
   ├─ lang-polish.js
   ├─ elastic-grid.js
   ├─ section-cues.js
   └─ timeline.js
```

`index.html` is the only page entry point. Shared visual rules live in `styles/`, behavior lives in `scripts/`, and standalone media assets live in `assets/`.

## Run locally

No build step is required.

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Deployment

This repository is designed to be imported directly into Vercel as a static project. No framework preset, install command or build command is required. Once Git integration is connected, pushes to `main` should produce production deployments automatically.

## Motion principle

> Nothing moves without reason. Nothing appears without purpose.
