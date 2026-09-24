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

1. **Hero (interactive "Orbit" — WebGL):** badge pill, h1 two lines, subcopy, paint-the-light swatches (Satin Red / Volt Blue / Pearl White), pill CTAs; behind it all a three.js studio — the owner-supplied **Lamborghini Temerario widebody** GLB (`storefront/public/models/lamborghini-temerario-widebody.glb`, ~394k tris, 2.4MB meshopt-compressed via gltfpack `-cc` — decoded with three's bundled MeshoptDecoder; authored materials — rendered as-is under our lights), tintable red rim spot + cool white rim + underglow, soft shadow on a dark floor, fog into `ink`. Scroll scrubs a pinned 520vh camera orbit (200°→340°, mid dolly-in, height dip); the mouse adds ±parallax; act copy (Style./Sound./Performance./Make it yours.) rides pinned windows with velocity skew; desktop HUD shows orbit degrees + scrub bar (hidden on mobile, where portrait framing pulls the camera back ×1.5 and FOV widens to 47). Preloader counter is wired to real model download progress (the veil also covers the parse window after the counter hits 100), lifts as a two-panel curtain, then the camera dollies in. Hand-off: pin ends into the **Studio Panel** (eclipse glow + dashboard analog: tab bar + 4 stat tiles — Builds 250+, **Google rating 4.3**, Cars wrapped 500+, Avg. gain +38 HP). Ghost: hero h1.
2. **Trust marquee:** microcopy line + uniform gray capability wordmarks, infinite drift, velocity-reactive. Ghost: none (subtle).
3. **Bento grid:** centered h2 + subcopy; 3 cards — ECU & Performance (Diesel Tronic ECU + Powertronic ECU rows), Interiors (dark interior image, no stat tile), red gradient feature tile. Ghost: h2.
4. **Our works:** centered h2 + subcopy; two alternating rows — glassy image panel left/right, copy + signal check list + text-link; "Fitted in-house" chips (no turnaround claims). Ghost: h2.
5. **CTA capture:** h2 left, email-style input + gradient pill button (submit deep-links WhatsApp), panel with signal glow underneath. Ghost: h2.
6. **Footer:** brand column + `Main Pages` / `Studio` / `Contact` link columns, copyright bar. Ghost: giant link column text.

## Motion spec

Global: preserve the current visual identity and content; this motion-only revision follows the owner's 2026-09-24 brief. Lenis keeps native touch momentum and is disabled when reduced motion is requested. Existing layout and assets remain authoritative; no extra horizontal sections or pins are introduced.

- Shared motion constants: `storefront/lib/motion.ts`. Micro-interactions 240ms, settle 450ms, reveals 850ms; transform/opacity only for continuous motion.
- Existing hero: desktop retains its orbit/pin; mobile uses a shorter stable-viewport scroll range, no pointer parallax. Time-based camera damping works across refresh rates. Render only while visible and changing; cached scene shadows update only when lighting/geometry changes.
- Loading does not lock navigation or impose a fake minimum wait. Keep server-rendered copy available; reveal the scene once ready. Failed imports, WebGL, model fetch or decoding fall back to an existing image without a tall empty pin.
- Reduced motion: static, fitted vehicle view rendered after model load and on tint/resize changes; all hero copy in document flow, no cinematic pin. Preference changes apply live.
- Section variety: accessible masked heading words, soft body entrances, directional image reveals followed by restrained desktop parallax. Revert split markup and GSAP contexts on unmount; no JavaScript means content stays visible.
- Primary buttons attract at most 5px; selected cards tilt at most 1.2 degrees with a soft pointer highlight. Fine pointers only, no effect on keyboard/click target behavior; reset on leave, blur, route change and reduced motion.
- Navbar retains its sticky position and mobile overlay; add active underline, focus handling and safe scroll-lock cleanup. Route entry is brief and never delays navigation, forms or browser history.
- Scroll ownership: while the mobile menu holds `data-nav-scroll-lock` nothing else measures or moves the page, and `ScrollTrigger.refresh()` restores the position it found (its own start-of-document measuring can otherwise snap an anchor jump back to the top). A fragment jump is only handed to Lenis while Lenis' own media condition still matches, and the landed section keeps focus after the jump.
- Verification uses real browser interactions, reduced-motion/error paths and desktop/mobile scroll captures. Performance is measured in the test environment; no triangle-count-based 60fps guarantee.

- **MOT-1 Ghost echo:** GhostLayer crossfades per section (rAF live measurement), slight 0.9→1 scale drift on the active ghost.
- **MOT-2 Entrances:** existing Rise wrappers coordinate desktop masked headline words, soft body copy, alternating image directions and small buffered image parallax. SplitText markup reverts on completion/unmount; touch/reduced-motion use visible static content. Route entry is a short opacity change from 0.94 to 1, never a navigation-blocking exit.
- **MOT-3 Marquee:** elapsed-time drift at 36px/s with a capped scroll-velocity boost; repeats at the measured offset between copies (including the gap). Stops offscreen, when the document is hidden, and on reduced-motion preference changes.
- **MOT-4 Cards and buttons:** existing product/bento cards receive fine-pointer tilt capped at 1.2° plus a subtle highlight. Primary CTA movement is capped at 5px with separate icon follow-through; card movement disengages over nested controls. Touch and reduced motion retain existing static controls.
- **MOT-5 Glow:** hero eclipse breathes (slow scale/opacity loop) behind the Studio Panel.
- **MOT-6 Reduced motion:** static page, ghosts hidden, marquee static, hero renders a single static studio angle with all copy stacked.
- **MOT-7 Orbit scrub:** existing camera path remains 200°→340° with a mid-orbit dolly and height dip; elapsed-time damping replaces fixed per-frame lerps. Desktop scroll range 520svh, tablet 360svh, phone 320svh. Reduced motion or a scene failure removes the pin and exposes all existing copy. Hero headings reveal through line masks, supporting copy follows at lower depth, and skew is restrained to ±1.2° on fine-pointer desktops. Invisible controls are inert. Only critical model bytes preload; shaders/model are rendered before the curtain releases, with no artificial minimum wait. WebGL work pauses while settled/offscreen/hidden; resources and aborted requests are disposed on navigation. The compressed model still has ~394k triangles; frame-rate depends on device/GPU and is not guaranteed by file size.

## Imagery

- Eclipse glow: pure CSS (layered radial gradients + blur), signal red.
- Studio Panel build image: hero sequence frame 01 (Thar in the bay).
- Service panels: real studio imagery on `surface`, rounded-2xl, object-cover.
- Product images: Medusa-served, 4:5 or square, rounded-xl.

## Shop (REQ-SHOP-1)

Quick-commerce patterns translated to the dark brand: sticky chrome (search field + scrollable category chips, `top-[72px] md:top-20`, `bg-ink/95` blur), 2-col mobile / 4-col desktop card grid (`surface` cards, square images, 11px category meta, 2-line clamped titles, price + bordered `ADD` button that fills signal on add), floating cart bar (`fixed inset-x-2 bottom-2`, signal fill, items · subtotal → Build List) rendered server-side from the cart cookie and refreshed after adds. Products filter client-side (title + category) for instant response.

## Layout

Card content max width 1200px, 24px gutters (16px mobile). Sections separated by generous rhythm (96–160px), hairline dividers only where the reference has them. Navbar: logo badge left, sentence-case links center-right, `Cart (n)` link, gradient pill `Book a Build →`. Mobile: full-screen rounded overlay menu with staggered links (Lenis stopped while open).
