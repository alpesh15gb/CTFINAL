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

### Hero scroll experience
- **REQ-HERO-1** Pinned full-viewport canvas scrubbing an image sequence bound to scroll progress; eased crossfade between frames; `object-fit: cover` behavior on any viewport.
- **REQ-HERO-2** Text overlays at scroll boundaries: `AUTOMOTIVE CUSTOMIZATION · HYDERABAD` → `STYLE.` → `SOUND.` → `PERFORMANCE.` → CTA ("Build Yours" → /shop + WhatsApp). Windows defined in DESIGN_SYSTEM.md `MOT-1`.
- **REQ-HERO-3** Frames preloaded with progressive reveal — first frame paints immediately, sequence refines as frames arrive. Never a black empty viewport (REQ-QUAL-1).

### Marketing sections (single page)
- **REQ-SEC-1** Philosophy: "A car gets you there. Character makes it yours."
- **REQ-SEC-2** Three pillars: The Personal Space / The Sensory Experience / The Driving Character.
- **REQ-SEC-3** "SMALL DETAILS. BIG DIFFERENCE." — featured products fetched live from Medusa store API.
- **REQ-SEC-4** Services grid: upholstery, audio/infotainment, lighting, alloys, ECU remap.
- **REQ-SEC-5** Conversion banner: "GOOD TASTE. GREAT DRIVES. START HERE." → WhatsApp deep link + /shop CTA.
- **REQ-SEC-6** Visit: address, hours, map embed, contact.

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
