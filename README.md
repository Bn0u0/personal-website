# personal-website

Bn0u0's personal digital laboratory — a living index of projects, systems, games, research and experiments.

## v0.1 direction

**Minimal surface. Deep interaction.**

The first concept intentionally keeps the visual system quiet and lets interaction carry the identity:

- editorial black / off-white layout
- oversized typography and large negative space
- project-index-first homepage instead of a card grid
- inertial custom cursor on fine pointers
- project preview stage that reacts to hover and pointer movement
- magnetic micro-interactions for navigation
- smooth Lenis scrolling
- progressive in-view reveals
- responsive mobile layout
- `prefers-reduced-motion` support

## Selected projects in v0.1

1. PicNest 2.0
2. Quant Research System
3. Grass Cutting 3min
4. Doodle Tyrant
5. Learning Games
6. Pixel Lab

The current project previews are deliberately abstract placeholders. Real project imagery, case-study transitions and project pages come after the interaction language is approved.

## Run locally

No build step is required for v0.1.

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Structure

```text
index.html   — content and semantic structure
styles.css   — design system, layout, responsive states and motion
script.js    — Lenis setup, cursor, hover stage, magnetic UI and reveal logic
```

## Motion principle

Nothing moves without reason. Nothing appears without purpose.
