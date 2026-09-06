// Skip the Admin UI plugin when running catalog import scripts.
// Those scripts bootstrap Medusa via loaders() on hosts without an
// admin build, where @medusajs/admin would otherwise log
// "Could not find the admin UI build files" and exit the process.
const isImport = process.argv.some((arg) => String(arg).includes("import-"));

module.exports = {
  projectConfig: {
    redis_url: process.env.REDIS_URL || "redis://localhost:6379",
    database_url: process.env.DATABASE_URL || "postgres://localhost/medusa",
    database_database: "medusa_cartunez",
    database_type: "postgres",
    jwt_secret: process.env.JWT_SECRET || "supersecret",
    cookie_secret: process.env.COOKIE_SECRET || "supersecret",
    store_cors: process.env.STORE_CORS || "http://localhost:8000",
    admin_cors:
      process.env.ADMIN_CORS || "http://localhost:7000,http://localhost:7001",
  },
  modules: {
    eventBus: {
      resolve: "@medusajs/event-bus-local",
      options: {},
    },
    cacheService: {
      resolve: "@medusajs/cache-inmemory",
      options: {},
    },
  },
  featureFlags: {
    // Required by scripts/import-*.js (categories + sales channels).
    // product_categories defaults to false in Medusa v1; without this,
    // productCategoryService / Store.default_sales_channel metadata breaks.
    sales_channels: true,
    product_categories: true,
    publishable_api_keys: true,
    order_editing: true,
  },
  plugins: [
    {
      resolve: `medusa-fulfillment-manual`,
      options: {},
    },
    {
      resolve: `medusa-payment-manual`,
      options: {},
    },
    // Admin UI is not needed for imports and breaks them when unbuilt.
    ...(isImport
      ? []
      : [
          {
            resolve: `@medusajs/admin`,
            options: {
              develop: {
                open: false,
              },
              // NOTE: must NOT be `/admin` — the admin API lives under
              // `/admin/*` and the plugin's `GET <path>/*` SPA fallback is
              // mounted before the core API routes, so serving the UI at
              // `/admin` returns index.html for every admin API GET
              // (login POST works, session check never does).
              path: `/app`,
            },
          },
        ]),
  ],
};
