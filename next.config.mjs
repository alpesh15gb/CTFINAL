/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  images: {
    formats: ["image/avif", "image/webp"],
    // Cache optimized images for a day (default is 60s) — supplier
    // originals are slow to refetch, so repeat views must not re-transform.
    minimumCacheTTL: 86400,
    deviceSizes: [360, 390, 430, 640, 750, 768, 828, 1024, 1080, 1200, 1280, 1440, 1920],
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "images.pexels.com" },
      // Live supplier catalogs (Medusa imports hotlink source images).
      // Without these, next/image answers 400 and no product photo renders.
      { protocol: "https", hostname: "cdn.shopify.com" },
      { protocol: "https", hostname: "sahibacar.in" },
      { protocol: "https", hostname: "*.sahibacar.in" },
      { protocol: "https", hostname: "neowheels.com" },
      { protocol: "https", hostname: "*.neowheels.com" },
    ],
  },
};

export default nextConfig;
