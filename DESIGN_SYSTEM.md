# Design System — Cartunez

Presentation layer contract. Implements PRD.md §3 (REQ-HERO-*, REQ-SEC-*, REQ-QUAL-*). Motion IDs `MOT-*` are referenced from code comments.

## Palette

| Token | Hex | Use |
|---|---|---|
| `ink` | `#0A0A0B` | page background |
| `surface` | `#131316` | cards, panels |
| `line` | `#232329` | hairline borders |
| `paper` | `#F5F4F0` | primary text |
| `muted` | `#8A8A93` | secondary text |
| `signal` | `#E10600` | accent — CTAs, rim-light echo, single-word highlights |
| `volt` | `#02BBFC` | brand blue sampled from cartunez-logo.png — used only for the `SOUND.` hero word and logo contexts; never for CTAs |

Accent is used sparingly: one element per viewport max. Sharp corners (radius 0–4px) everywhere — performance-car aesthetic, no soft consumer rounding.

## Typography

- **Display:** Archivo (weight 800–900, uppercase, tracking -0.02em, expanded feel) — hero words, section headlines. Fluid: `clamp(2.75rem, 9vw, 8.5rem)`.
- **Eyebrow:** Archivo 600 uppercase, tracking +0.35em, 11–12px, `muted` or `signal`.
- **Body:** Inter 400/500, 16–18px, `muted` on `ink`.

Loaded via `next/font/google` subsets, `display: swap`.

## Motion spec

Global: Lenis `lerp: 0.1`, GSAP ScrollTrigger `scrub: 1` for pinned scenes, `power3.out` for entrances. All pinned scenes must have ≥200vh scroll distance per beat so motion reads cinematic, not twitchy.

- **MOT-1 Hero sequence (REQ-HERO-1/2):** 600vh pin. Frame index = `progress × (N−1)`. Each cut pushes the outgoing frame in (zoom 1→1.035) while the incoming frame settles back — a continuous forward camera move. Canvas camera: slow dolly `scale 1→1.07` + slight vertical drift across the pin; scroll-velocity skew (±4° max, eased decay) on an oversized `inset -8%` wrapper so no edge ever shows. Canvas grade: `saturate(1.1) contrast(1.05) brightness(0.98)`. Overlay windows (% of pinned progress):
  | Window | Copy |
  |---|---|
  | 0–12% | `AUTOMOTIVE CUSTOMIZATION · HYDERABAD` (eyebrow; signal rule line scales in 0–10%) |
  | 18–34% | `STYLE.` (paper) |
  | 40–56% | `SOUND.` (volt) |
  | 62–78% | `PERFORMANCE.` (paper) |
  | 86–100% | CTA block: "MAKE IT YOURS" + buttons (buttons trail the headline; holds to pin end) |
  Hero words enter as per-character masked cascades (translateY 1.15em→0 + ≤6° rotate, overflow-hidden line masks, stagger compressed so long words finish before exit) and exit upward as one block. CTA headline cascades per word. HUD right-center: frame readout `01 / 14` + signal scrub bar. Scroll cue fades out by 4.5%. Zero empty-black viewports: vignette + bottom fade to `ink` under the pinned canvas.
- **MOT-2 Section entrances:** headline lines revealed with clip-path inset animation + 40px rise, staggered 80ms per line, triggered at `top 75%`.
- **MOT-3 Pillars (REQ-SEC-2):** three panels, each pins briefly; index number `01/02/03` parallaxes at 0.5× scroll speed.
- **MOT-4 Product cards (REQ-SEC-3):** image scale 1.0→1.06 on hover, `signal` underline sweep on title.
- **MOT-5 Reduced motion (REQ-QUAL-4):** no pin, first hero frame static, all overlay copy stacked visible, entrances become simple opacity. Film grain freezes.
- **MOT-6 Marquee:** infinite capability strip between Featured Products and Services; base drift 0.6px/frame accelerated by smoothed scroll velocity (max +4px/frame), wraps at half track width. Alternating solid `paper/90` and outline-stroke display type with signal diamonds.
- **MOT-7 Film grain:** fixed full-viewport `feTurbulence` layer, opacity ~0.055, GPU-only `steps(5)` transform jitter — sits at z-45 under the navbar.

## Imagery

Hero frames: 16:9 WebP, target ≤180KB each, matte-black modified SUV in dark studio with red rim lighting (ADR-6). Section imagery: real-service close-ups generated in the same grade. Product images: on `surface` background, 4:5.

## Layout

Max content width 1440px, 24px gutters (16px mobile). Sections separated by `line` hairlines, generous vertical rhythm (120–200px). Navbar: fixed, transparent → `ink`/blur after first scroll, cartunez-logo.png badge (`mix-blend-mode: screen` — logo's black ground disappears on `ink`) + links Experience / Upgrades / Visit / Shop; mobile gets a full-screen menu overlay with staggered display-type links (Lenis stopped while open).
