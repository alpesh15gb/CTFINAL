# Medusa Backend Setup for Cartunez

## Prerequisites

1. **PostgreSQL** - Install and running
   - Download from: https://www.postgresql.org/download/windows/
   - Or use Docker: `docker run --name medusa-db -e POSTGRES_PASSWORD=medusa -p 5432:5432 -d postgres`

2. **Redis** (optional but recommended)
   - Download from: https://redis.io/download
   - Or use Docker: `docker run --name medusa-redis -p 6379:6379 -d redis`

## Setup Steps

### 1. Install PostgreSQL and create database

```bash
# If using Docker
docker run --name medusa-db -e POSTGRES_PASSWORD=medusa -p 5432:5432 -d postgres

# Create database
psql -U postgres -h localhost
CREATE DATABASE medusa_cartunez;
```

### 2. Set up environment variables

Create `.env.local` in the project root:

```env
DATABASE_URL=postgres://postgres:medusa@localhost:5432/medusa_cartunez
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-super-secret-jwt-key-change-this
COOKIE_SECRET=your-super-secret-cookie-key-change-this
MEDUSA_BACKEND_URL=http://localhost:9000
```

### 3. Initialize Medusa database

```bash
# Install Medusa CLI globally
npm install -g @medusajs/medusa-cli

# Run migrations
medusa migrations run

# Create admin user
medusa user -e admin@cartunez.com -p supersecret

# Seed initial data (optional)
medusa seed --seed-file=./data/seed.json
```

### 4. Start Medusa server

```bash
# In a separate terminal
medusa develop
```

The Medusa admin will be available at: http://localhost:9000/admin

### 5. Login credentials

- Email: admin@cartunez.com
- Password: supersecret

## Features

Once set up, you'll have:

- **Product Management**: Add/edit/delete products, variants, images
- **Order Management**: View and process orders
- **Customer Management**: View customer details and order history
- **Shipping Management**: Configure shipping zones and rates
- **Payment Management**: Configure payment providers (Stripe, manual, etc.)
- **Discounts & Promotions**: Create discount codes and promotions

## Integration with Frontend

The frontend is configured to use the Medusa API at `http://localhost:9000`.

Update the API client in `lib/medusa.ts` if needed.

## Production Deployment

For production:
1. Use a managed PostgreSQL service (AWS RDS, Supabase, etc.)
2. Use a managed Redis service (Upstash, Redis Cloud, etc.)
3. Deploy Medusa to a service like Railway, Render, or AWS
4. Update `MEDUSA_BACKEND_URL` in your frontend environment variables
