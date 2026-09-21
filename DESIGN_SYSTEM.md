# Design System — Cartunez

Presentation layer contract. Reference of record: `pinterestreference.mp4` (RedSun-style dark presentation — site inside a floating rounded card, giant dimmed ghost echoes behind). Implements PRD.md §3 as revised 2026-09-22. Motion IDs `MOT-*` are referenced from code comments.

## Presentation frame (REF-1)

The whole site presents as the reference does: a floating rounded card over an ink backdrop, with each section's key content echoed as a giant, dimmed "ghost" behind the card.

- Outer backdrop `#060607`. Page card: inset 16px (6px mobile), radius 28px, fill `#0D0D0F`, hairline `rgba(255,255,255,0.07)`. Implemented as a fixed bezel overlay that paints everything outside the card via giant box-shadow (StageFrame).
- Navbar is fixed to the card's top edge (same inset/radius), translucent blur.
- GhostLayer: fixed behind the card. Per section, its heading/price/shapes render at 2–4× scale, opacity ~0.07–0.12; crossfades as sections pass. Only the margins reveal it — exactly like the reference.

## Palette

| Token | Hex | Use |
|---|---|---|
| `backdrop` | `#060607` | outside the card |
| `stage` | `#0D0D0F` | card fill / page background |
| `surface` | `#141417` | cards, panels |
| `surface-2` | `#1B1B1F` | nested tiles, inputs |
| `line` | `rgba(255,255,255,0.07)` | hairlines (dark glass borders) |
| `paper` | `#F5F4F0` | primary text |
| `muted` | `#8A8A93` | secondary text |
| `signal` | `#E10600` | accent — CTAs, highlights, echoes |
| `signal-hot` | `#FF3B2E` | gradient end for CTAs |
| `volt` | `#02BBFC` | brand blue from cartunez-logo.png — logo contexts + one hero word only |

Buttons: pill radius-full. Primary = gradient `signal → signal-hot`, white text, soft glow shadow. Secondary = `surface-2` pill with hairline. Badge pills: `surface-2`/hairline with a signal dot.

## Typography

Reference is sentence-case, medium-weight, tight tracking — no uppercase display.

- **Display (h1):** Inter 600, `clamp(2.5rem, 4.5vw, 4rem)`, tracking -0.03em, sentence case, line-height 1.1.
- **Section (h2):** Inter 600, `clamp(1.75rem, 3vw, 2.75rem)`, tracking -0.02em.
- **Card (h3):** Inter 600, 1.25–1.5rem.
- **Body:** Inter 400, 15–16px, `muted`.
- **Micro/labels:** 12–13px, 500, `muted`; uppercase only inside pills where reference uses it.

Archivo remains only inside the logo asset. Loaded via `next/font/google`, `display: swap`.

## Page sections (home) — mapped 1:1 from the reference

1. **Hero (interactive "Orbit" — WebGL):** badge pill, h1 two lines, subcopy, paint-the-light swatches (Satin Red / Volt Blue / Pearl White), pill CTAs; behind it all a three.js studio — the owner-supplied **Lamborghini Temerario widebody** GLB (`storefront/public/models/lamborghini-temerario-widebody.glb`, ~394k tris, 12.9MB, authored materials — rendered as-is under our lights), tintable red rim spot + cool white rim + underglow, soft shadow on a dark floor, fog into `ink`. Scroll scrubs a pinned 520vh camera orbit (200°→340°, mid dolly-in, height dip); the mouse adds ±parallax; act copy (Style./Sound./Performance./Make it yours.) rides pinned windows with velocity skew; desktop HUD shows orbit degrees + scrub bar (hidden on mobile, where portrait framing pulls the camera back ×1.5 and FOV widens to 47). Preloader counter is wired to real model download progress (12.9MB — the veil also covers the parse window after the counter hits 100), lifts as a two-panel curtain, then the camera dollies in. Hand-off: pin ends into the Studio Panel section (eclipse glow + dashboard analog). Ghost: hero h1.
2. **Trust marquee:** microcopy line + uniform gray capability wordmarks, infinite drift, velocity-reactive. Ghost: none (subtle).
3. **Bento grid:** centered h2 + subcopy; 2 stat mini-cards + 1 gradient feature tile + 1 wide activity card. Ghost: h2.
4. **Capabilities:** centered h2 + subcopy; two alternating rows — glassy image panel left/right, copy + signal check list + text-link. Ghost: h2.
5. **Packages (pricing analog):** centered h2 + subcopy; 3 price cards, center highlighted with signal border + gradient CTA; feature check lists; live prices from Medusa by handle with static fallback. Ghost: giant `₹`.
6. **Recent builds:** 3 image cards with arrow chip + title overlay. Ghost: 3 rounded card silhouettes.
7. **CTA capture:** h2 left, email-style input + gradient pill button (submit deep-links WhatsApp), panel with signal glow underneath. Ghost: h2.
8. **Footer:** brand column + `Main Pages` / `Studio` / `Social` link columns, copyright bar. Ghost: giant link column text.

## Motion spec

Global: Lenis `lerp: 0.1`, entrances `power3.out`. Zero empty-black viewports; reduced-motion collapses all of the below to opacity-only or static.

- **MOT-1 Ghost echo:** GhostLayer crossfades per section (rAF live measurement), slight 0.9→1 scale drift on the active ghost.
- **MOT-2 Entrances:** sections rise 24px + fade at `top 80%`; no clip-path (reference is softer).
- **MOT-3 Marquee:** base drift 0.6px/frame + smoothed scroll velocity (max +4px/frame), wraps at half track.
- **MOT-4 Cards:** hover lift (translateY -4px) + image scale 1.0→1.05; arrow chip nudges diagonally.
- **MOT-5 Glow:** hero eclipse breathes (slow scale/opacity loop) behind the Studio Panel.
- **MOT-6 Reduced motion:** static page, ghosts hidden, marquee static, hero renders a single static studio angle with all copy stacked.
- **MOT-7 Orbit scrub:** hero pinned at 520vh; sticky stage + rAF live-measured progress (same pattern as MOT-1 originally). Camera: azimuth 200°→340°, radius `7.4 − 1.9·sin(pπ)` (×1.5 portrait), height dips mid-scrub, all lerped 0.09 for scrub feel; intro dolly mixes in after the preloader curtain. Velocity skew ±5° on act copy. Swatches dispatch `hero-tint` → rim spot + underglow recolor. three.js is dynamically imported so it never loads on server pages that don't need it; DPR capped (1.5 mobile / 2 desktop); model ≈3.3k triangles so 60fps holds on mobile hardware.

## Imagery

- Eclipse glow: pure CSS (layered radial gradients + blur), signal red.
- Studio Panel build image: hero sequence frame 01 (Thar in the bay).
- Service panels: real studio imagery on `surface`, rounded-2xl, object-cover.
- Product images: Medusa-served, 4:5 or square, rounded-xl.

## Layout

Card content max width 1200px, 24px gutters (16px mobile). Sections separated by generous rhythm (96–160px), hairline dividers only where the reference has them. Navbar: logo badge left, sentence-case links center-right, `Cart (n)` link, gradient pill `Book a Build →`. Mobile: full-screen rounded overlay menu with staggered links (Lenis stopped while open).
