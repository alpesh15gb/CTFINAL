# AGENTS.md — Working agreements for this repo

Read the spec set first (README §Spec documents). PRD is the contract; surface conflicts instead of building against it.

## Commands

```bash
cd infra && docker compose up -d          # postgres :5432, redis :6379
cd medusa && npm run dev                  # API :9000, admin /app
cd medusa && npm run seed                 # reseed catalog (idempotent script)
cd storefront && npm run dev              # site :3000
```

## Environment variables

`medusa/.env` — `DATABASE_URL`, `REDIS_URL`, `JWT_SECRET`, `COOKIE_SECRET`, `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`, `STORE_CORS`, `ADMIN_CORS`.
`storefront/.env.local` — `NEXT_PUBLIC_MEDUSA_BACKEND_URL`, `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`, `NEXT_PUBLIC_RAZORPAY_KEY_ID`, `NEXT_PUBLIC_WHATSAPP_NUMBER`.
Never commit secrets (REQ-INF-3). `.env.example` files are the template of record.

## Verification culture

- Claims must be labeled: written / compiled / tested / seen-on-screen.
- Visual work is accepted via screenshots at multiple scroll positions (REQ-QUAL-2); never ship "should look right".
- Zero empty-black viewports anywhere in the scroll journey (REQ-QUAL-1).

## Conventions

- TypeScript strict, Tailwind tokens map to DESIGN_SYSTEM.md palette (no ad-hoc hex in components).
- Motion code references MOT-* IDs in comments when deviating from defaults.
- Medusa customizations live in `medusa/src/` (modules, api routes, jobs, links) — never patch `node_modules`.
- Commits: conventional style; task is done when pushed to origin/main, followed by VPS pull/deploy commands for the operator.

## Deployment

VPS: system nginx + `infra/docker-compose.yml` (+ prod overrides). Uploads and postgres data are named volumes — back them up together. Runbook: `infra/README.md` (T-6).
