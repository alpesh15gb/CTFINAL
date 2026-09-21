# Cartunez Hyderabad — Cinematic Site + Headless Commerce

Premium scroll-driven marketing site and store for **Cartunez**, an automotive customization studio in Secunderabad, Hyderabad. The hero experience replicates the Scrollsequence "futuristic" reference: a pinned full-viewport canvas scrubbing an image sequence as you scroll, with headlines appearing at defined scroll boundaries.

**Brand:** Built around you. MAKE IT YOURS. NOT FOR EVERYONE.

## Stack

| Layer | Tech |
|---|---|
| Storefront | Next.js 15 (App Router), TypeScript, Tailwind CSS 4, GSAP ScrollTrigger, Lenis |
| Commerce | Medusa v2, PostgreSQL 16, Redis 7 |
| Payments | Razorpay (INR) |
| Media | Local filesystem storage (VPS disk, no S3) |
| Infra | Docker Compose behind system-level nginx on the VPS |

## Repo layout

```
medusa/        # Medusa v2 backend (admin, store API, /static uploads)
storefront/    # Next.js storefront incl. scrollsequence hero
infra/         # docker-compose.yml, nginx server blocks, deploy scripts
```

## Quickstart (local dev)

```bash
# 1. Infra (postgres + redis)
cd infra && docker compose up -d

# 2. Medusa (host, Node 24)
cd medusa && npm install
npx medusa db:migrate && npm run seed
npm run dev          # http://localhost:9000  (admin at /app)

# 3. Storefront
cd storefront && npm install
npm run dev          # http://localhost:3000
```

## Spec documents (read in this order)

Precedence: what → how → presentation → sequencing.

1. [PRD.md](PRD.md) — requirements `REQ-*`, locked decisions `D1–D3`
2. [ARCHITECTURE.md](ARCHITECTURE.md) — topology, `ADR-*`
3. [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) — palette, type, motion spec `MOT-*`
4. [TASKS.md](TASKS.md) — execution plan `T-*` with status
5. [AGENTS.md](AGENTS.md) — commands, env vars, verification gates

## Deployment

System nginx on the VPS routes `cartunez.in` → storefront container and `api.cartunez.in` → Medusa container. See `infra/nginx/` and ARCHITECTURE.md §Deploy.
