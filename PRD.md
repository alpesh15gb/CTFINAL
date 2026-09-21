# PRD — Cartunez Hyderabad Site + Commerce

Status: **agreed** (scope aligned 2026-09-22). Governs all implementation. If an instruction contradicts this file, surface the conflict before building.

## 1. Context

Cartunez is a premium car customization studio — Shop 12 & 13, S.P. Road, Secunderabad, Hyderabad 500003. WhatsApp/phone +91 99496 95030, email adnan@cartunez.in. Current site cartunez.in is a static brochure. Services: upholstery & floor mats, audio/infotainment (DSP, Android screens, dashcams), ambient & exterior lighting, alloy wheels, ECU remapping.

**Reference:** pinterest pin 759560293404708588 → Scrollsequence "Futuristic Web Design" — a pinned full-viewport canvas that scrubs an image sequence with scroll; text overlays fade/slide at defined scroll-percentage boundaries; dark futuristic aesthetic.

## 2. Locked decisions

| ID | Decision | Chosen |
|---|---|---|
| D1 | Hero frame source | AI-generated sequence (~14 frames, 16:9, dark studio + red rim light), swappable for real footage later |
| D2 | Commerce model | Full checkout with Razorpay (INR) on Medusa — not WhatsApp-only |
| D3 | URL topology | `cartunez.in` storefront, `api.cartunez.in` Medusa (subdomain split) |

## 3. Requirements

### Hero + marketing sections (single page — hero direction: WebGL orbit per owner, 2026-09-22; overall presentation: pinterestreference.mp4)
- **REQ-HERO-1** Hero: WebGL orbit — pinned 520vh scrub drives a three.js camera around an owner-supplied Lamborghini Temerario widebody GLB in a rim-lit dark studio; mouse parallax; act copy windows with velocity skew; preloader counter → curtain → camera dolly; paint-the-light swatches recolor the rim/underglow live; HUD on desktop; mobile runs the same scrub with portrait framing; reduced-motion renders one static angle. Hand-off into the Studio Panel (badge pill, headline CTAs live in the intro act).
- **REQ-HERO-2** Site presents as a floating rounded card over an ink backdrop; each section's key content echoes as a giant dimmed ghost behind the card, crossfading per section (DESIGN_SYSTEM REF-1 / MOT-1).
- **REQ-SEC-1** Trust marquee: uniform gray capability wordmarks, velocity-reactive drift.
- **REQ-SEC-2** Bento grid: ECU & Performance card (Diesel Tronic + Powertronic ECU rows), Interiors card with dark interior imagery, red gradient feature tile.
- **REQ-SEC-3** "Our works": alternating glassy image rows with check lists + text links (no turnaround claims).
- **REQ-SEC-4** Capture CTA: input + gradient pill, submit deep-links WhatsApp. Studio address/hours/contact live in the footer. (Signature-packages and recent-builds sections removed per owner, 2026-09-22.)

### Commerce
- **REQ-SHOP-1** /shop: product listing filterable by category.
- **REQ-SHOP-2** PDP: gallery, description, INR price, add-to-cart.
- **REQ-SHOP-3** Cart: line management, persisted via Medusa cart ID cookie.
- **REQ-SHOP-4** Checkout: address → shipping → Razorpay payment (INR) → order placed in Medusa.
- **REQ-SHOP-5** Confirmation page with order ID; WhatsApp fallback CTA.

### Backend & data
- **REQ-ADM-1** Medusa admin for catalog/orders/customers (admin user for owner).
- **REQ-DATA-1** Region India (INR), seeded categories: Audio & Infotainment, Comfort & Cabin, Lighting & Exterior, Wheels, Performance; ≥12 realistic products with INR pricing.
- **REQ-DATA-2** Uploads on local filesystem, served at `/static` (ADR-4).

### Infra
- **REQ-INF-1** All services dockerized; one compose file brings up the stack.
- **REQ-INF-2** System nginx server blocks for cartunez.in and api.cartunez.in (ADR-3).
- **REQ-INF-3** Razorpay keys via env only, never committed.

### Quality gates
- **REQ-QUAL-1** Zero empty-black viewports at any scroll position.
- **REQ-QUAL-2** Screenshot-based visual acceptance before handoff (golden path + edge scroll positions).
- **REQ-QUAL-3** Responsive: mobile hero falls back gracefully (fewer frames, same copy).
- **REQ-QUAL-4** `prefers-reduced-motion`: sequence becomes static hero image, overlays all visible.

## 4. Non-goals

S3/cloud storage, multi-region/multi-currency, blog/CMS pages, customer accounts UI (Medusa supports it; UI deferred), i18n.
