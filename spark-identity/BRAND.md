# SPARK — brand & identity handoff

SPARK is the Ministry of Energy's private, self-hosted AI experimentation platform, built under the
**Digital Energy (طاقتنا رقمية)** initiative. This folder is the complete visual identity: logos,
type, color tokens, the parent Digital Energy and Ministry of Energy marks, and ready-to-use code.

Drop the whole `spark-identity/` folder into the repo (e.g. `src/brand/`) and follow this file.

---

## 1. Folder map

```
spark-identity/
  BRAND.md                     ← this file
  logos/
    spark-glyph.svg            the spark alone, gradient (primary glyph)
    spark-glyph-white.svg      1-color white (dark backgrounds, small sizes, print)
    spark-glyph-navy.svg       1-color navy
    spark-lockup-navy.svg      glyph + SPARK wordmark, light backgrounds
    spark-lockup-white.svg     glyph + SPARK wordmark, dark backgrounds
    spark-blade.svg            the gradient "/" blade used in the merged mark
    favicon.svg                64px rounded-square app mark
    spark-glyph-512.png        glyph raster, transparent
    spark-lockup-navy.png      raster, transparent bg, Lafet already outlined
    spark-lockup-white.png
    spark-de-lockup-navy.png   merged SPARK / طاقتنا رقمية mark, raster
    spark-de-lockup-white.png
    icons/app-icon-{32,64,180,192,512,1024}.png
  components/
    SparkLogo.jsx              <SparkGlyph>, <SparkLockup>, <SparkDigitalEnergyLockup>
    spark-logo.css             composition rules (gaps, offsets, clearspace)
  brand/
    tokens/colors.css          Digital Energy color tokens (--de-*, semantic aliases)
    tokens/typography.css      type scale + font stacks
    tokens/spacing.css         spacing scale
    tokens/gradients.css       the signature blurred gradient-blob motif
    tokens/fonts.css           @font-face declarations (expects ../fonts/)
    styles.css                 Digital Energy base component styles
    fonts/                     Lafet, IBM Plex Sans Arabic, Adobe Arabic
    logos/                     Digital Energy + Ministry of Energy official marks
    motifs/                    DE glow motif tiles
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

**Concept.** A four-point spark — the moment an idea ignites — set in the Digital Energy warm
accent gradient (orange → gold), paired with the wordmark in **Lafet**, the initiative's Latin
display face. The glyph carries the product; the wordmark carries the name.

| Rule | Value |
|---|---|
| Wordmark font | Lafet Regular — the initiative's high-contrast Didone display face (`--font-display`) |
| Tracking | `0.055em` — never tighter, never looser |
| Case | Always all-caps `SPARK`. Never "Spark", never "SPaRK" |
| Glyph size | `0.8 × wordmark font-size` |
| Glyph–wordmark gap | `0.38 × wordmark font-size` |
| Minimum size | 20px wordmark cap size / 16px glyph alone |
| Clearspace | ≥ the glyph's height on all four sides |

Wordmark color: `--text-primary` (#081631 navy) on light, `#ffffff` on dark. The glyph keeps its
gradient on both. Below 20px, or in one-color print, swap the glyph for
`spark-glyph-navy.svg` / `spark-glyph-white.svg`.

**Optional sub-label** (not part of the mark; set separately):
`A DIGITAL ENERGY PRODUCT` — IBM Plex Sans Arabic 600, 9.5–11px, `letter-spacing: .26em`,
`--text-secondary`. Arabic equivalent: `مساحة آمنة لتجارب الذكاء الاصطناعي`.

```jsx
import { SparkLockup, SparkGlyph } from "./components/SparkLogo";

<SparkLockup size={40} />              // light background
<SparkLockup size={40} inverse />      // dark background
<SparkGlyph size={24} />               // glyph only
<SparkGlyph size={16} mono="#fff" />   // 1-color
```

---

## 3. The merged mark (product site)

The site mark is **two identities in one**: the SPARK lockup and the Digital Energy wordmark
(طاقتنا رقمية), split by a tapered blade at `/`. The blade's gradient runs
**orange (SPARK) → teal → green (Digital Energy)** — the cut *is* the handoff between the two
brands. The two halves are optically offset around it: SPARK sits `-0.22em`, the DE wordmark
`+0.22em`.

```jsx
import { SparkDigitalEnergyLockup } from "./components/SparkLogo";

<SparkDigitalEnergyLockup size={40} />            // header
<SparkDigitalEnergyLockup size={64} inverse />    // hero, dark
```

| Rule | Value |
|---|---|
| Blade width | `0.24em`, height `2.32em` (em = SPARK font-size) |
| Gaps | `0.34em` either side of the blade |
| DE wordmark height | `1.56em` |
| Minimum size | 28px SPARK cap size — below that use `SparkLockup` alone |

Never rebuild the Arabic طاقتنا رقمية wordmark in live text — always use the supplied
`brand/logos/de-wordmark-*.png`.

For places that can't compose the mark in code (email, PDF, slides, README), use the flattened
rasters `logos/spark-de-lockup-navy.png` / `-white.png` — transparent background, wordmark
already outlined, so no font dependency.

---

## 4. Ministry of Energy endorsement

The Ministry lockup (`وزارة الطاقة` / MINISTRY OF ENERGY + palm emblem) is a **separate
endorsement**, never merged into the SPARK mark and never recolored.

- Site header: right-aligned, opposite the merged mark, 32–36px tall.
- Footer / documents: centered with the label `AN INITIATIVE OF` (IBM Plex Sans Arabic 500,
  9.5px, `letter-spacing: .18em`, `--de-gray-400`), lockup 40–48px tall.
- Use `brand/logos/moe-lockup-color.png` on light backgrounds. On navy, use
  `moe-wordmark-white.png` + `moe-emblem.png` side by side — the emblem's gradient stays as-is.
- Minimum lockup height 28px; clearspace ≥ the emblem's width.

---

## 5. Color

Use the tokens, not hex literals. Full set in `brand/tokens/colors.css`.

| Role | Token | Value |
|---|---|---|
| Brand surface / primary text | `--de-navy-950` | `#081631` |
| SPARK accent (glyph) | `--de-orange-500` → `--de-gold-300` | `#ff734a` → `#dfc28c` |
| Blade mid / secondary action | `--de-teal-500` / `--de-teal-700` | `#0b8f92` / `#00646a` |
| DE green (blade end) | `--de-green-500` | `#00ac29` |
| Link / info | `--de-blue-500` | `#0080e8` |
| Page, canvas, card | `--surface-page` / `--surface-canvas` / `--surface-card` | `#fff` / `#f5f7fa` / `#fff` |
| Body text | `--text-secondary` | `#454f65` |

Backgrounds: max two per surface — white/`--de-gray-50` for light UI, `--de-navy-950` for dark
sections. The blurred gradient blob (`--gradient-blob-primary`, `filter: blur(40–50px)`,
opacity ≤ .45) is the only decorative background treatment; never behind body text.

## 6. Type

| Use | Token |
|---|---|
| SPARK wordmark, display headlines, big numerals | `--font-display` (Lafet) |
| All UI, body, Arabic + Latin | `--font-body` (IBM Plex Sans Arabic) |
| Formal Arabic editorial display | `--font-arabic-display` (Adobe Arabic) |

Scale tokens `--text-display-xl` … `--text-caption` are in `brand/tokens/typography.css`.
Arabic and Latin never mix inside one line of running copy — separate lines with `dir` set
correctly.

## 7. Don'ts

- Don't rotate, outline, stretch, or drop-shadow the spark glyph.
- Don't recolor the glyph outside the orange→gold gradient or a single navy/white.
- Don't change the blade angle, or reverse the blade gradient direction.
- Don't put the SPARK mark and the Ministry lockup in the same lockup group.
- Don't set SPARK in any face other than Lafet; don't tighten the tracking to fit a space.
- Don't place either logo on a photo or on the gradient blob without a solid plate behind it.
- Don't translate "SPARK".

## 8. Favicon / icons

`logos/favicon.svg` (navy rounded square, glyph at 62%, corner radius 22.5%) plus ready PNGs in
`logos/icons/` at 32/64/180/192/512/1024. The navy plate is required — the gradient glyph alone
loses legibility at 16px.

---

### Fonts & licensing

Lafet and Adobe Arabic are licensed faces supplied by the Digital Energy initiative — ship them
self-hosted from `brand/fonts/`, do not load from a public CDN, and do not redistribute outside
Ministry projects. IBM Plex Sans Arabic is OFL.
