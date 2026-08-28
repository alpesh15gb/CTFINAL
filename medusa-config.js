const STORE_CORS = process.env.STORE_CORS || "http://localhost:3000,http://localhost:3015";
const ADMIN_CORS = process.env.ADMIN_CORS || "http://localhost:3000,http://localhost:3015";

module.exports = {
  projectConfig: {
    redis_url: process.env.REDIS_URL || "redis://localhost:6379",
    database_url: process.env.DATABASE_URL || "postgres://localhost/medusa",
    database_database: "medusa_cartunez",
    database_type: "postgres",
    jwt_secret: process.env.JWT_SECRET || "supersecret",
    cookie_secret: process.env.COOKIE_SECRET || "supersecret",
    store_cors: STORE_CORS,
    admin_cors: ADMIN_CORS,
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
      /** @type {import('@medusajs/admin').PluginOptions} */
      options: {
        serve: true,
        autoRebuild: false,
        path: "app",
        develop: {
          open: false,
        },
      },
    },
  ],
};
