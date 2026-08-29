/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 390, 430, 768, 1024, 1280, 1440, 1920],
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "cartunez.in" },
      { protocol: "https", hostname: "www.cartunez.in" },
      { protocol: "http", hostname: "localhost", port: "9000" },
      { protocol: "https", hostname: "cdn.shopify.com" },
      { protocol: "https", hostname: "sahibacar.in" },
      { protocol: "https", hostname: "www.sahibacar.in" },
      { protocol: "https", hostname: "neowheels.com" },
      { protocol: "https", hostname: "www.neowheels.com" },
      { protocol: "https", hostname: "**.digitaloceanspaces.com" },
      { protocol: "https", hostname: "**.amazonaws.com" },
    ],
  },
};

export default nextConfig;
