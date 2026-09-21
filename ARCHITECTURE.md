# Architecture — Cartunez

Implements PRD.md. ADRs are numbered and final unless superseded in writing here.

## Topology (production)

```
browser
  │ 443 (system nginx on VPS host, certbot)
  ├── cartunez.in      → storefront container  :3000  (Next.js)
  └── api.cartunez.in  → medusa container      :9000
                            ├── /store/*  store API (publishable key, CORS = cartunez.in)
                            ├── /admin/*  admin API   (CORS = api.cartunez.in)
                            ├── /app      admin dashboard
                            └── /static/* uploads (docker volume, ADR-4)
medusa ──► postgres:5432 (container, volume pgdata)
medusa ──► redis:6379    (container, cache + events + workflows)
medusa ──► Razorpay API  (keys via env, REQ-INF-3)
```

Local dev differs only in that Medusa + Next.js run on the host (Node 24) for fast iteration; postgres/redis run in the same compose file. Storefront dev proxies nothing — it calls `http://localhost:9000`.

## ADRs

- **ADR-1 Scrollsequence via GSAP + canvas, not the WordPress plugin.** The reference is a WP plugin; our stack is Next.js. We re-implement the effect: Lenis smooth scroll + GSAP ScrollTrigger pinning a `<canvas>`; frames drawn with eased crossfade (REQ-HERO-1). Rationale: full control over overlay timing, preload strategy, and React integration.
- **ADR-2 Medusa v2 headless commerce.** Mature admin, INR region support, Razorpay via community provider, Docker-friendly. Storefront talks only to `/store` endpoints with a publishable API key.
- **ADR-3 Subdomain split (PRD D3).** `cartunez.in` storefront, `api.cartunez.in` Medusa. Clean CORS/cookie boundary; admin at `api.cartunez.in/app`. System nginx terminates TLS and proxies; Docker services listen on localhost ports only.
- **ADR-4 Local filesystem storage.** Medusa file provider = local, uploads on a named volume mounted at `/static` (REQ-DATA-2). No S3 — operator preference, simpler backup (tar the volume).
- **ADR-5 Razorpay for INR (PRD D2).** `medusa-payment-razorpay` community module; order flow: cart → payment collection → Razorpay order → capture webhook → Medusa order. Keys only in env.
- **ADR-6 AI-generated hero frames (PRD D1).** ~14 frames generated with a locked style prompt (matte-black modified SUV, dark studio, red rim light, 16:9). Orbit angles + detail macro shots; crossfade masks inter-frame variance. Frames live in `storefront/public/sequences/hero/*.webp` so a real shoot can replace them 1:1 later.

## Checkout data flow (REQ-SHOP-4)

1. Storefront creates Medusa cart (`POST /store/carts`), stores cart ID in cookie.
2. Address/shipping steps update the cart; shipping options from `/store/shipping-options`.
3. `POST /store/payment-collections` + payment session → provider `razorpay` returns order ID.
4. Storefront opens Razorpay checkout.js; on success, `POST /store/carts/:id/complete`.
5. Medusa verifies signature (webhook `api.cartunez.in/hooks/payment/razorpay`) and creates the order.
6. Confirmation page reads order from `/store/orders/:id`.

## Environments

| | Local dev | VPS prod |
|---|---|---|
| postgres/redis | compose | compose |
| medusa | host `npm run dev` :9000 | container :9000 |
| storefront | host `next dev` :3000 | container :3000 (`next start`) |
| nginx | none (direct ports) | system nginx, TLS, subdomains |
| secrets | `medusa/.env` | VPS env file, never committed |

## Failure modes

- Medusa down → marketing page still renders (REQ-SEC-3 featured grid degrades to static fallback data), /shop shows a maintenance state.
- Redis down → Medusa falls back per its module config; sessions degrade, catalog still serves.
- Razorpay webhook missed → admin can manually capture; order stays `pending` until verified.
