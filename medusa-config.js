module.exports = {
  projectConfig: {
    redis_url: process.env.REDIS_URL || "redis://localhost:6379",
    database_url: process.env.DATABASE_URL || "postgres://localhost/medusa",
    database_database: "medusa_cartunez",
    database_type: "postgres",
    jwt_secret: process.env.JWT_SECRET || "supersecret",
    cookie_secret: process.env.COOKIE_SECRET || "supersecret",
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
