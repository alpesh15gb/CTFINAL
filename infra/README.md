# Deploy runbook — cartunez.in (REQ-INF-*, TASKS G4)

One-time VPS setup:

```bash
# 1. DNS: A records cartunez.in, www.cartunez.in, api.cartunez.in -> VPS IP
# 2. Clone repo to /opt/cartunez and cd infra
cp .env.example .env   # fill every value (POSTGRES_PASSWORD, secrets, keys)

# 3. TLS
apt install nginx certbot python3-certbot-nginx
cp nginx/cartunez.conf /etc/nginx/sites-available/cartunez
ln -s /etc/nginx/sites-available/cartunez /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
certbot --nginx -d cartunez.in -d www.cartunez.in -d api.cartunez.in

# 4. Stack
docker compose up -d --build
docker compose exec medusa npx medusa user -e adnan@cartunez.in -p '<strong-password>'
docker compose exec medusa npm run seed    # first boot only; prints publishable key
# 5. Put the printed publishable key into .env (NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY),
#    then: docker compose up -d --build storefront
```

Every deploy (after `git push` from dev):

```bash
cd /opt/cartunez && git pull origin main
cd infra && docker compose up -d --build
```

## Razorpay go-live checklist

1. Razorpay dashboard → generate live keys → set `RAZORPAY_KEY_ID/SECRET` in `infra/.env`.
2. Dashboard → Webhooks → add `https://api.cartunez.in/hooks/payment/razorpay_razorpay`,
   events `order.paid` + `payment.failed`, secret → `RAZORPAY_WEBHOOK_SECRET`.
3. `docker compose up -d --build` (storefront build inlines the public key id).

## Backups

Postgres + uploads are the state (ADR-4):

```bash
docker compose exec postgres pg_dump -U cartunez medusa > medusa-$(date +%F).sql
docker run --rm -v infra_medusa-uploads:/v -v $PWD:/b alpine tar czf /b/uploads-$(date +%F).tgz -C /v .
```
