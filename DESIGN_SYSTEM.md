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

Accent is used sparingly: one element per viewport max. Sharp corners (radius 0–4px) everywhere — performance-car aesthetic, no soft consumer rounding.

## Typography

- **Display:** Archivo (weight 800–900, uppercase, tracking -0.02em, expanded feel) — hero words, section headlines. Fluid: `clamp(2.75rem, 9vw, 8.5rem)`.
- **Eyebrow:** Archivo 600 uppercase, tracking +0.35em, 11–12px, `muted` or `signal`.
- **Body:** Inter 400/500, 16–18px, `muted` on `ink`.

Loaded via `next/font/google` subsets, `display: swap`.

## Motion spec

Global: Lenis `lerp: 0.1`, GSAP ScrollTrigger `scrub: 1` for pinned scenes, `power3.out` for entrances. All pinned scenes must have ≥200vh scroll distance per beat so motion reads cinematic, not twitchy.

- **MOT-1 Hero sequence (REQ-HERO-1/2):** 600vh pin. Frame index = `progress × (N−1)`, crossfade ±0.5 frame. Overlay windows (% of pinned progress):
  | Window | Copy |
  |---|---|
  | 0–12% | `AUTOMOTIVE CUSTOMIZATION · HYDERABAD` (eyebrow, fades in 0–4%) |
  | 18–34% | `STYLE.` |
  | 40–56% | `SOUND.` |
  | 62–78% | `PERFORMANCE.` |
  | 86–100% | CTA block: "MAKE IT YOURS" + buttons |
  Each word enters with translateY(60px)→0 + opacity, exits mirrored. Active word sits below-center-left, huge display type.
- **MOT-2 Section entrances:** headline lines revealed with clip-path inset animation + 40px rise, staggered 80ms per line, triggered at `top 75%`.
- **MOT-3 Pillars (REQ-SEC-2):** three panels, each pins briefly; index number `01/02/03` parallaxes at 0.5× scroll speed.
- **MOT-4 Product cards (REQ-SEC-3):** image scale 1.0→1.06 on hover, `signal` underline sweep on title.
- **MOT-5 Reduced motion (REQ-QUAL-4):** no pin, first hero frame static, all overlay copy stacked visible, entrances become simple opacity.

## Imagery

Hero frames: 16:9 WebP, target ≤180KB each, matte-black modified SUV in dark studio with red rim lighting (ADR-6). Section imagery: real-service close-ups generated in the same grade. Product images: on `surface` background, 4:5.

## Layout

Max content width 1440px, 24px gutters (16px mobile). Sections separated by `line` hairlines, generous vertical rhythm (120–200px). Navbar: fixed, transparent → `ink`/blur after first scroll, wordmark `CARTUNEZ` + links Experience / Upgrades / Visit / Shop.
