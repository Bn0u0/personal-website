# personal-website

Bn0u0's personal digital laboratory — a living index of projects, systems, games, research and experiments.

## Direction

**Minimal surface. Deep interaction. Evidence before polish.**

The homepage stays visually quiet while motion carries identity. Project work is now backed by a canonical data layer, shareable case-study routes, evidence cards and decision traces so the site can show not only what was built, but why it became that way.

## Project routes

- `/work/picnest`
- `/work/quant`
- `/work/grass-cutting`
- `/work/doodle-tyrant`
- `/work/learning-games`
- `/work/pixel-lab`

Every project route has its own title, description, canonical URL and Open Graph metadata. The homepage keeps the organic fullscreen detail reveal; opening a project also updates browser history to the same canonical project route.

## Canonical project data

`data/projects.js` is the single source of truth for project identity, timeline, status, stack, bilingual case-study copy, evidence and decision history. Homepage rows, fullscreen details, standalone case studies and Lab Lens read from the same project records.

## Lab Lens

Press `L` or use the small `LAB / OFF` control to reveal the site as a system. The lens exposes the current surface/project, viewport and DPR, input profile, motion preference, approximate frame rate and active project stack without changing the normal visual experience.

## Architecture

```text
/
├─ index.html
├─ data/
│  └─ projects.js
├─ work/
│  ├─ picnest.html
│  ├─ quant.html
│  ├─ grass-cutting.html
│  ├─ doodle-tyrant.html
│  ├─ learning-games.html
│  └─ pixel-lab.html
├─ styles/
│  ├─ site.css
│  ├─ motion-system.css
│  ├─ lab-upgrades.css
│  ├─ lab-lens.css
│  ├─ project-page.css
│  └─ ...
├─ scripts/
│  ├─ site.js
│  ├─ portfolio-upgrades.js
│  ├─ project-page.js
│  ├─ lab-lens.js
│  ├─ mobile.js
│  └─ ...
├─ tests/
│  └─ portfolio.spec.js
├─ .github/workflows/quality.yml
├─ playwright.config.js
├─ lighthouserc.json
├─ robots.txt
├─ sitemap.xml
├─ site.webmanifest
└─ vercel.json
```

## Quality gate

Pull requests run a browser quality workflow with:

- Playwright desktop + mobile interaction paths
- reduced-motion path
- project URL/history open and close behavior
- standalone case-study route checks
- axe serious/critical accessibility checks
- Lighthouse performance, accessibility, best-practices and SEO budgets

## Accessibility and runtime

- `prefers-reduced-motion` remains a site-wide contract.
- Custom fullscreen overlays make the background inert while open.
- Project detail can receive programmatic focus and returns focus to its trigger when closed.
- Desktop and phone Project Detail close behavior now share the same `site.js` state machine; mobile changes input/cost behavior without owning a parallel close controller.

## SEO and delivery

The site ships canonical URLs, Open Graph metadata, WebSite/Person structured data, sitemap, robots and a small web manifest. Vercel adds security headers including CSP and `frame-ancestors 'none'`; non-fingerprinted static assets use a conservative short cache with stale-while-revalidate rather than immutable caching.

## Run locally

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Motion principle

> Nothing moves without reason. Nothing appears without purpose.
