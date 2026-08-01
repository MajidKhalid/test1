# Handoff: SPARK site floating artifacts v2 — "Solids"

## Overview
A motion/3D artifact system for the SPARK product site (the Ministry of Energy's private AI
experimentation platform, under the Digital Energy initiative). The four Digital Energy glow
tiles are extruded into true 3D objects — cube, octahedron, orbital sphere, hover stack — plus
a glass orb, cursor parallax, scroll-driven reveals and a blade light-sweep. This replaces the
earlier v1 "flat tiles on plates" system entirely.

## How to apply this in the 'SPARK context handoff' Claude Code session
Paste into that chat (recommended: plan first, Fable 5 / Ultracode as you have it set):

> Unzip design_handoff_spark_site_artifacts into the repo (e.g. src/brand/). Read README.md and
> BRAND.md fully. Then embed the v2 floating-artifact system across the SPARK site: replace ALL
> v1 floating-tile usages; hero = ParallaxScene with one centerpiece solid + SPARK wordmark;
> follow the "Rules of space" section exactly (one centerpiece per view, depth = hierarchy,
> fixed per-shape colours, compositor-only animation, reduced-motion respected). Keep the
> existing Hub/verifier/page structure — this is a visual layer, not an IA change.

## About the design files
These files are **design references created in HTML/CSS/JSX** — working prototypes showing
intended look and behavior, not production code to copy blindly. Recreate/adapt them in the
site's existing environment and patterns. `components/floating-artifacts.css` and
`components/FloatingArtifacts.jsx` are close to drop-in (plain CSS + one React file, no
dependencies beyond React); adjust import paths and asset locations to the repo's layout.

## Fidelity
**High-fidelity.** Colors, durations, easings, amplitudes, and geometry are final. Recreate
exactly; do not restyle.

## The artifacts
| Artifact | Component | Classes | Behavior |
|---|---|---|---|
| Glass cube (sky-blue square tile) | `SolidCube` | `.de-solid .de-cube .de-cube__face` | 6 faces textured with the tile PNG, rotateX(-16°) + 26s Y-spin, 11s hover float |
| Octahedron (deep-blue diamond) | `SolidOcta` | `.de-octa .de-octa__half .de-octa__face` | 8 translucent glass facets that breathe apart along their normals (translateZ 7→22px, 8s), per-face opacity lighting (top .96/.8/.68/.88; bottom ×0.78) — hue stays pure #113879, cores transparent, 30s spin |
| Orbital sphere (teal circle) | `GyroSphere` | `.de-gyro .de-gyro__ring .de-gyro__core` | 4 longitude rings (alternating 0.9/0.5 alpha teal) + equator + shaded 3D ball core (specular top-left, dark limb), 22s spin |
| Hover stack (orange rounded tile) | `MotifStack` | `.de-stack .de-stack__tilt .de-stack__layer` | 3 layers at translateZ ±36px, isometric rotateX(56°) rotateZ(-42°), layers bob 18px on 9s offsets |
| Glass orb | `GlassOrb` | `.de-orb3d + __spec __halo` | DE-blob gradient + inset shading + specular + teal halo, 7s breathe |
| Cursor parallax | `ParallaxScene` | `.de-parallax .de-plx[data-depth]` | pointer offset × depth × 100px, lerp 0.06 in rAF, reset on leave |
| Scroll reveal | — | `.de-reveal` | native `animation-timeline: view()`, range entry 0%→55%, inside `@supports` |
| Blade sweep | `BladeDivider` | `.de-sweep` | white light pass, 6s |
| Aurora wash bg | `AuroraBackdrop` | `.de-bg .de-bg-aurora__b--teal/blue/gold` | 3 blurred blobs, 24–32s drifts — hero default |
| Great orbits bg | `OrbitLines` | `.de-bg-orbit(--blue/--dashed/--rev) + __sat` | ring lines wheeling around an off-screen centre, 42–80s |
| Rising embers bg | `EmberField count` | `.de-bg-ember` | motif tiles floating up at ≤.55 opacity, 13–20s loops |
| Blade streaks bg | `BladeStreaks count` | `.de-bg-streak(--blue/--sky)` | multiple rare light strikes crossing diagonally |
| Section breakers | `SectionBreak variant dark` | `.de-break + __line/__tumble/__ember` | keystone octahedron, live-wire embers, metronome cube — one style per page |
| Contact shadow | — | `.de-shadow(--light)` | radial ellipse, counter-scales with the float |

## Rules of space (binding)
- One 3D centerpiece per view; supporting solids smaller + blurred + lower opacity (blur = distance).
- Depth encodes hierarchy: primary content nearest (largest `data-depth`, sharpest).
- Fixed colours per shape (BRAND.md §4): cube #0080e8, octahedron #113879, sphere #00646a/#0b8f92,
  stack #ff734a, orb = the DE blob palette. Never recolour or cross-assign.
- Compositor-only animation (transform/opacity/filter). No JS scroll listeners — CSS
  `animation-timeline` with `@supports` fallback (unsupported = simply visible).
- Parallax ≤ ±12px effective; loops 6–34s; global speed via `--de-motion-speed`.
- `prefers-reduced-motion: reduce` disables everything (already in the CSS).
- Motion never sits behind body text; solids and `.de-bg` layers are `aria-hidden`.
- The SPARK orb is ALIVE everywhere it renders in code: two colour families counter-rotate inside
  the crisp circle (`.spark-orb::before/::after`, 13s/19s, no blur). Raster exports stay static.
- Backgrounds: one `.de-bg` system per section; aurora for heroes, orbits for About/system pages,
  embers for footers/community, streaks only as rare moments (loading, transitions).

## Design tokens
From `BRAND.md` §7 / DE tokens: navy-950 #081631 · blue-700 #113879 · blue-500 #0080e8 ·
blue-300 #63b3ff · teal-700 #00646a · teal-500 #0b8f92 · teal-300 #6fd2d0 · green-500 #00ac29 ·
orange-500 #ff734a · gold-300 #dfc28c · gray-50 #f5f7fa. Fonts: Lafet (display),
IBM Plex Sans Arabic (UI).

## Assets
The four motif PNGs + fonts + logos ship in the `spark-identity/` bundle
(`brand/motifs/`, `brand/fonts/`, `logos/`) — this handoff assumes that bundle is in the repo.

## Files in this handoff
- `components/floating-artifacts.css` — the whole motion system (keyframes, classes, a11y)
- `components/FloatingArtifacts.jsx` — React components listed above
- `components/spark-logo.css` + `SparkLogo.jsx` — the SPARK logo system (orb lockups, merged marks)
- `BRAND.md` — full brand contract (logo rules, motif colours §4, motion §11)
- Living reference: the "Floating Artifacts" page in the design project (hero + all six artifacts, annotated).
