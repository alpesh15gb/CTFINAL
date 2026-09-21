import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  output: "standalone",
  // dev gets its own distDir so `next build` can never clobber a running dev server
  ...(process.env.NEXT_DEV ? { distDir: ".next-dev" } : {}),
  images: {
    remotePatterns: [
      { protocol: "http", hostname: "localhost", port: "9000" },
      { protocol: "http", hostname: "127.0.0.1", port: "9000" },
      { protocol: "https", hostname: "api.cartunez.in" },
    ],
  },
}

export default nextConfig
