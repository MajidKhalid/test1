# SPARK — brand & identity handoff

SPARK is the Ministry of Energy's private, self-hosted AI experimentation platform, built under the
**Digital Energy (طاقتنا رقمية)** initiative. This folder is the complete visual identity: logos,
type, color tokens, the parent Digital Energy and Ministry of Energy marks, and ready-to-use code.

Drop the whole `spark-identity/` folder into the repo (e.g. `src/brand/`) and follow this file.

---

## 1. Folder map

```
spark-identity/
  BRAND.md                          ← this file
  logos/
    spark-orb.svg                   the Digital Energy gradient orb (the only glyph)
    spark-orb-512.png               orb raster, transparent
    spark-lockup-navy.svg  / .png   SPARK + orb, light backgrounds
    spark-lockup-white.svg / .png   SPARK + orb, dark backgrounds
    spark-lockup-navy-tagline.svg  / .png   with A DIGITAL ENERGY INITIATIVE
    spark-lockup-white-tagline.svg / .png
    spark-de-lockup-navy.png        merged mark A (slash), light
    spark-de-lockup-white.png       merged mark A (slash), dark
    spark-de-hinge-navy.png         merged mark B (hinge), light
    spark-de-hinge-white.png        merged mark B (hinge), dark
    spark-blade.svg                 the gradient "/" blade used in merged mark A
    favicon.svg                     navy rounded square + orb
    icons/app-icon-{32,64,180,192,512,1024}.png
  components/
    SparkLogo.jsx                   <SparkOrb>, <SparkLockup>, <SparkDigitalEnergyLockup>
    spark-logo.css                  composition rules (orb, gaps, offsets, clearspace)
    FloatingArtifacts.jsx           <MotifField>, <FloatingMotif>, <BreathingOrb>,
                                    <OrbitOrnament>, <DepthRing>, <TiltCard>, <BladeDivider>
    floating-artifacts.css          the motion system (keyframes, classes, reduced-motion)
  brand/
    tokens/colors.css               Digital Energy color tokens (--de-*, semantic aliases)
    tokens/typography.css           type scale + font stacks
    tokens/spacing.css              spacing scale
    tokens/gradients.css            the signature blurred gradient-blob motif
    tokens/fonts.css                @font-face declarations (expects ../fonts/)
    styles.css                      Digital Energy base component styles
    fonts/                          Lafet, IBM Plex Sans Arabic, Adobe Arabic
    logos/                          Digital Energy + Ministry of Energy official marks
    motifs/                         the four DE glow tiles — one fixed colour each (§4)
    avatars/                        DE avatars, SVG + PNG
    misc/                           atom icon
    motion/                         official logo animation reference (mp4)
```

Load order in the app:

```css
@import "brand/tokens/fonts.css";
@import "brand/tokens/colors.css";
@import "brand/tokens/typography.css";
@import "brand/tokens/spacing.css";
@import "brand/tokens/gradients.css";
@import "brand/styles.css";
@import "components/spark-logo.css";
```

---

## 2. The SPARK mark

**Concept.** The wordmark in **Lafet** — the initiative's high-contrast Didone display face — closed
by the Digital Energy gradient orb as a full stop. The orb is the same blurred blue/teal/gold/green
blob that sits behind the Ministry's palm emblem, so the product mark carries the parent identity
inside it rather than beside it. There is no separate icon.

| Rule | Value |
|---|---|
| Wordmark font | Lafet Regular (`--font-display`) |
| Tracking | `0.055em` — never tighter, never looser |
| Case | Always all-caps `SPARK`. Never "Spark" |
| Orb diameter | `0.27 × font-size` |
| Orb gap | `0.17em`, baseline-aligned (the orb sits on the baseline, not centred on the cap) |
| Sub-label | `A DIGITAL ENERGY INITIATIVE` — IBM Plex Sans Arabic 600, `0.19em`, tracking `0.26em`, `--text-secondary` |
| Clearspace | ≥ 2 × orb diameter on all four sides |
| Minimum size | 20px wordmark; drop the sub-label below 30px |

Wordmark color: `--text-primary` (#081631) on light, `#ffffff` on dark. The orb keeps its gradient
on both; on dark, add a soft teal glow at `0.5 × diameter` (`box-shadow: 0 0 .5em rgba(111,210,208,.42)`).

```jsx
import { SparkLockup, SparkOrb } from "./components/SparkLogo";

<SparkLockup size={40} />                    // light background
<SparkLockup size={40} inverse />            // dark background
<SparkLockup size={56} sublabel />           // with A DIGITAL ENERGY INITIATIVE
<SparkOrb />                                 // orb alone, sized in em by its parent
```

---

## 3. The merged marks (SPARK + Digital Energy)

Three lockups run the two identities as one. **A is the product-site default.**

**A · Slash** — the SPARK lockup and the طاقتنا رقمية wordmark split by a tapered blade at `/`, the
halves optically offset around it (SPARK `-0.22em`, the DE wordmark `+0.22em`). Blade gradient runs
blue → teal → green.

**B · Hinge** — a single orb sits between the two wordmarks and serves both: it is SPARK's full stop
and the join to Digital Energy. Tighter and quieter; good for narrow headers.

**C · Stacked** — SPARK over a hairline rule over the DE wordmark, for square spaces (avatars,
social, cover slides). Compose from `SparkLockup` + `brand/logos/de-wordmark-*.png`.

```jsx
<SparkDigitalEnergyLockup size={40} />                    // A · slash
<SparkDigitalEnergyLockup size={40} variant="hinge" />    // B · hinge
<SparkDigitalEnergyLockup size={64} inverse />            // dark
```

| Rule | Value |
|---|---|
| Blade width | `0.24em`, height `2.32em` (em = SPARK font-size) |
| Gaps (A) | `0.34em` either side of the blade |
| Gaps (B) | `0.41em` either side of the orb |
| DE wordmark height | `1.56em` (A and C), `1.41em` (B) |
| Minimum size | 28px SPARK font-size — below that use `SparkLockup` alone |

Never rebuild the Arabic طاقتنا رقمية wordmark in live text — always use the supplied
`brand/logos/de-wordmark-*.png`. For places that can't compose the mark in code (email, PDF, slides,
README), use the flattened rasters in `logos/` — transparent background, no font dependency.

---

---

## 4. Digital Energy shape motifs — one colour each

The initiative's four glow tiles. **Every shape owns its colour.** Never recolour a tile, never tint
it, never put one shape's colour on another, and never re-draw them — use the supplied PNGs.

| Shape | Colour | Token | File |
|---|---|---|---|
| Circle | `#00646a` deep teal | `--de-teal-700` | `brand/motifs/motif-circle-teal.png` |
| Diamond | `#113879` deep blue | `--de-blue-700` | `brand/motifs/motif-diamond-blue.png` |
| Rounded square | `#ff734a` orange | `--de-orange-500` | `brand/motifs/motif-square-orange.png` |
| Square | `#0080e8` sky blue | `--de-blue-500` | `brand/motifs/motif-square-skyblue.png` |

Each tile is a soft radial glow: saturated at the edge, blowing out to white at the centre.
They are built to sit on **white or a very light surface** — on navy, put them on a light plate or
drop them to low opacity as a background field. Any size; keep the source aspect ratio (1:1).

There is **no triangle tile** in the kit that was handed over — only these four. If the initiative
owns a triangle (or any further shapes), get the source file and add it here with its own fixed
colour; do not invent one by recolouring an existing tile.

When a shape is used as an accent next to text or a card, treat its colour as decoration only —
text and UI colour still come from the semantic tokens in §6.

---

## 5. Other original artifacts

| Asset | File |
|---|---|
| Digital Energy full lockup (طاقتنا رقمية + وزارة الطاقة + emblem) | `brand/logos/de-lockup-full-color.png` |
| Same, emblem only variant | `brand/logos/de-lockup-color-alt.png` |
| طاقتنا رقمية wordmark, navy / white | `brand/logos/de-wordmark-navy.png` · `-white.png` |
| Ministry lockup, colour / white | `brand/logos/moe-lockup-color.png` · `moe-lockup-white.png` |
| Ministry wordmark only, green / white | `brand/logos/moe-wordmark-green.png` · `-white.png` |
| Palm emblem (gradient blob), large / small | `brand/logos/moe-emblem-large.png` · `moe-emblem.png` |
| Avatars (SVG + PNG) | `brand/avatars/` |
| Atom icon | `brand/misc/icon-atom.svg` |
| Official logo animation reference | `brand/motion/logo-motion-reference.mp4` |
| Fonts (Lafet, IBM Plex Sans Arabic, Adobe Arabic) | `brand/fonts/` |
| Tokens + base styles | `brand/tokens/` · `brand/styles.css` |

The palm-emblem blob is also the source of SPARK's orb — same colour family, same soft radial
build. Use the emblem itself **only** as part of a Ministry lockup, never as a decorative graphic.

---

## 6. Ministry of Energy endorsement

The Ministry lockup (`وزارة الطاقة` / MINISTRY OF ENERGY + palm emblem) is a **separate
endorsement**, never merged into the SPARK mark and never recolored.

- Site header: right-aligned, opposite the SPARK mark, 32–36px tall.
- Footer / documents: centered with the label `AN INITIATIVE OF` (IBM Plex Sans Arabic 500,
  10px, `letter-spacing: .18em`, `--de-gray-400`), lockup 40–48px tall.
- Use `brand/logos/moe-lockup-color.png` on light backgrounds. On navy, use
  `moe-wordmark-white.png` + `moe-emblem.png` side by side — the emblem's gradient stays as-is.
- Minimum lockup height 28px; clearspace ≥ the emblem's width.

---

## 7. Color

Use the tokens, not hex literals. Full set in `brand/tokens/colors.css`. The one exception is the
shape motifs in §4 — those colours are fixed to their shape.

| Role | Token | Value |
|---|---|---|
| Brand surface / primary text | `--de-navy-950` | `#081631` |
| Orb base | `--de-teal-500` | `#0b8f92` |
| Orb layers | `--de-teal-300` / `--de-gold-300` / `--de-green-500` / `--de-blue-300` | `#6fd2d0` / `#dfc28c` / `#00ac29` / `#63b3ff` |
| Blade | `--de-blue-500` → `--de-teal-500` → `--de-green-500` | `#0080e8` → `#0b8f92` → `#00ac29` |
| Link / info | `--de-blue-500` | `#0080e8` |
| Page, canvas, card | `--surface-page` / `--surface-canvas` / `--surface-card` | `#fff` / `#f5f7fa` / `#fff` |
| Body text | `--text-secondary` | `#454f65` |

Backgrounds: max two per surface — white/`--de-gray-50` for light UI, `--de-navy-950` for dark
sections. The blurred gradient blob (`--gradient-blob-primary`, `filter: blur(40–52px)`,
opacity ≤ .45) is the only decorative background treatment; never behind body text.

## 8. Type

| Use | Token |
|---|---|
| SPARK wordmark, display headlines, big numerals | `--font-display` (Lafet) |
| All UI, body, Arabic + Latin | `--font-body` (IBM Plex Sans Arabic) |
| Formal Arabic editorial display | `--font-arabic-display` (Adobe Arabic) |

Scale tokens `--text-display-xl` … `--text-caption` live in `brand/tokens/typography.css`. Arabic and
Latin never mix inside one line of running copy — separate lines, with `dir` set correctly.

## 9. Don'ts

- Don't replace the orb with a star, bolt or any other glyph, and don't add a second glyph.
- Don't flatten the orb to a solid color, outline it, or give it a border.
- Don't centre the orb on the cap height — it is baseline-aligned.
- Don't change the blade angle or reverse its gradient direction.
- Don't put the SPARK mark and the Ministry lockup in the same lockup group.
- Don't set SPARK in any face other than Lafet; don't tighten the tracking to fit a space.
- Don't place either logo on a photo or on the gradient blob without a solid plate behind it.
- Don't translate "SPARK".
- Don't recolour, re-draw or mix the shape motifs' colours (§4).

## 10. Favicon / icons

`logos/favicon.svg` (navy rounded square, orb at 48%, corner radius 22%) plus ready PNGs in
`logos/icons/` at 32/64/180/192/512/1024. The navy plate is required — the orb alone on a light
browser chrome disappears.

---

## 11. Motion — the floating artifact system

Six site artifacts built from the four tiles and the orb, in
`components/floating-artifacts.css` + `FloatingArtifacts.jsx`. Pure CSS transforms.

| Artifact | Component | Use |
|---|---|---|
| Hero field — tiles drifting at 3 blur depths | `<MotifField items>` | one per page, behind hero only |
| Drifting tile | `<FloatingMotif motif size speed delay>` | accents beside headings/rows |
| Breathing orb + halo | `<BreathingOrb size>` | hero, loaders, empty states |
| Orbit ornament — tiles circling the orb, upright | `<OrbitOrnament size orb reverse>` | About / How-it-works, one max |
| Depth ring — 3D carousel, tiles on white plates | `<DepthRing radius plate>` | navy sections, 404/empty |
| Tilt glass card | `<TiltCard width delay>` | feature cards, ≤ 3 in view |
| Blade light sweep | `<BladeDivider height>` | dividers, merged-logo loading |

Rules: loops 12–52s ease-in-out; amplitudes ≤ 17px drift / ≤ 10° tilt / ≤ 4.5% breathe; stagger
siblings with negative `animation-delay`; global speed via `--de-motion-speed` (default 1);
shapes keep their §4 colours — depth is blur + opacity, never recolouring; motion never behind
body text; everything freezes under `prefers-reduced-motion` (handled in the CSS).

---

### Fonts & licensing

Lafet and Adobe Arabic are licensed faces supplied by the Digital Energy initiative — ship them
self-hosted from `brand/fonts/`, do not load from a public CDN, and do not redistribute outside
Ministry projects. IBM Plex Sans Arabic is OFL.
