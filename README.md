# personal-website

Bn0u0's personal digital laboratory — a living index of projects, systems, games, research and experiments.

## Direction

**Minimal surface. Deep interaction.**

The interface stays visually quiet while motion, project transitions and interaction carry the identity.

Current design language:

- warm off-white / black editorial layout
- oversized typography and large negative space
- BN0U0 SVG identity with Pale Sage `#B4C2BE`
- hidden native scrollbar + 1px top scroll progress
- fast inertial custom cursor with `VIEW` state
- magnetic navigation micro-interactions
- smooth Lenis scrolling with native-scroll fallback
- progressive in-view reveals
- responsive mobile layout
- `prefers-reduced-motion` support

## Selected work interaction

Project previews use an **inline expanding row** rather than a floating overlay.

On desktop, hovering a project expands that project downward and pushes the following projects lower in the document flow. The preview and short project summary live inside the expanded area, so content never covers neighboring rows.

On touch devices, projects expand by tap.

## Selected projects

1. PicNest 2.0
2. Quant Research System
3. Grass Cutting 3min
4. Doodle Tyrant
5. Learning Games
6. Pixel Lab

Current preview art is intentionally abstract. Real screenshots / video / case-study transitions can replace these placeholders without changing the interaction structure.

## Architecture

The current site is intentionally deployment-safe and small:

```text
index.html    — complete page, CSS and interaction logic
favicon.svg   — standalone BN0U0 identity asset
vercel.json   — static Vercel delivery / security headers
```

`index.html` is self-contained except for the optional Lenis CDN script. If Lenis fails to load, the site falls back to native scrolling and remains fully styled and usable.

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
