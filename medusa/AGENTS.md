# AGENTS.md — cartunez-medusa (backend)

This directory is the Medusa v2 backend only (flattened from the create-medusa-app
turborepo — the starter storefront was dropped; the real storefront lives in
`../storefront`). The repo-level spec set at `../README.md` governs.

## Commands (npm, from this directory)

```bash
npm run dev        # medusa develop — API :9000, admin at /app
npm run migrate    # medusa db:migrate
npm run seed       # idempotent Cartunez catalog seed (src/scripts/seed.ts)
npm run build      # medusa build (production bundle in .medusa/)
npm start          # medusa start (production)
npx medusa user -e <email> -p <password>   # create admin user
```

## Layout

- `medusa-config.ts` — modules: caching-redis, event-bus-redis, workflow-engine-redis,
  file-local (uploads at `/static`, ADR-4), custom Razorpay payment provider (ADR-5).
  Project `.env` is force-loaded over machine-level env vars — keep it that way.
- `src/modules/payment-razorpay/` — custom provider (community plugin is Medusa v1-only).
  Provider id: `pp_razorpay_razorpay`; webhook: `/hooks/payment/razorpay_razorpay`.
- `src/scripts/seed.ts` — India/INR region, Cartunez categories/products, staged images
  from `uploads-seed/`. Safe to re-run (sales-channel guard).
- `uploads-seed/` — seed product imagery (committed, used at seed time).
- `static/` — runtime uploads volume (not committed).

## Gotchas learned

- Medusa product listing needs `region_id` for `calculated_price`.
- Category expansion in store API: `fields=+categories.*` (not `+categories.name`).
- Razorpay session re-creation: provider reuses the paid order when session data
  already contains `razorpay_payment_id` — see `service.ts` comments.
