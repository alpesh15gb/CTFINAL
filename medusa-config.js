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
  plugins: [
    {
      resolve: `medusa-fulfillment-manual`,
      options: {},
    },
    {
      resolve: `medusa-payment-manual`,
      options: {},
    },
    {
      resolve: `@medusajs/admin`,
      options: {
        develop: {
          open: false,
        },
        path: `/admin`,
      },
    },
  ],
};
