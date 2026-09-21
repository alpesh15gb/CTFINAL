FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

FROM node:22-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx medusa build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/.medusa ./.medusa
COPY medusa-config.ts package.json tsconfig.json ./
COPY src ./src
RUN mkdir -p /app/static
EXPOSE 9000
# Migrate then serve; uploads persist on the named volume at /app/static
CMD ["sh", "-c", "npx medusa db:migrate && npx medusa start"]
