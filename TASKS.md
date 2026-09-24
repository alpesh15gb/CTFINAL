# Tasks — Cartunez build

Sequencing layer. Implements PRD.md requirements per ARCHITECTURE.md + DESIGN_SYSTEM.md. Status legend: `[ ]` pending · `[~]` in progress · `[x]` done.

| ID | Task | Implements | Status |
|---|---|---|---|
| T-1 | Scaffold monorepo + compose infra (postgres, redis) | REQ-INF-1 | [x] |
| T-2 | Install + configure Medusa v2: INR region, local storage, Razorpay module, admin user, publishable key, seed Cartunez catalog | REQ-ADM-1, REQ-DATA-1, REQ-DATA-2, ADR-2/4/5 | [x] |
| T-3 | Generate 14 hero frames + 5 section images (locked style prompt) | REQ-HERO-1, ADR-6 | [x] |
| T-4 | Storefront: Lenis+GSAP shell, scrollsequence hero (MOT-1), sections REQ-SEC-1..6, navbar, footer | REQ-HERO-*, REQ-SEC-* | [x] |
| T-5 | /shop: listing, PDP, cart, Razorpay checkout, confirmation | REQ-SHOP-* | [x] |
| T-6 | Prod Dockerfiles, compose services, nginx blocks, env templates, deploy runbook; end-to-end run + screenshot acceptance | REQ-INF-*, REQ-QUAL-* | [x] |

## Motion enhancement — 2026-09-24

- [x] Audit existing motion and preserve current presentation/content.
- [x] Implement on-demand hero rendering, accessible loading/reduced motion, section reveals, subtle magnetic/card interaction, and navigation lifecycle fixes.
- [x] Rehearse desktop/mobile, route history, menu/anchors, shopping actions and failed assets; run production build.
  - 33 headless-browser assertions green (desktop + mobile + landscape + reduced motion + no-JS + blocked-model), production build clean.
  - Gate: `storefront/.env.local` must hold a live `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` and the Medusa API must be up (`cd medusa && npm run dev`), or `/shop` renders its error state and the commerce assertions fail.

## Verification gates

- G1 (T-2): **passed** — `/store/products` returns 14 seeded products with the Cartunez publishable key; payment providers `pp_razorpay_razorpay` + `pp_system_default` enabled on the India region; uploads serve at `/static` (200).
- G2 (T-4): **passed** — screenshots at hero progress 5/26/48/93% + Philosophy, Pillars, featured grid (live Medusa images), conversion banner, Visit. Overlays verified programmatically per MOT-1 window. Zero empty-black viewports. Fixed en route: CTA terminal window holds (MOT-1), live-measured hero progress, Lenis anchor navigation.
- G3 (T-5): **partial** — full order mechanics verified end-to-end via API (cart → address → shipping → payment session → order `order_01M32SC6V3WWA4YBXXQN89Y4RT` created, confirmation page 200). Browser golden path verified to the Razorpay modal. **Blocked link:** live Razorpay authorization needs real keys (external dependency — owner creates the Razorpay account). Provider signature logic = written + compiled, not live-tested.
- G4 (T-6): **partial** — `next build` + `medusa build` validated locally; Docker image builds and `nginx -t` happen on the VPS (runbook: infra/README.md).

## Cross-references

Spec precedence (README §Spec documents): PRD → ARCHITECTURE → DESIGN_SYSTEM → this file. Change to a requirement = edit PRD first, then cascade.
