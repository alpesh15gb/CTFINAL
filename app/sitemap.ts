import type { MetadataRoute } from "next";

const BASE = "https://cartunez.in";

// Static routes only — product URLs are catalog-driven and resolved live.
const ROUTES = ["/", "/shop"];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return ROUTES.map((path) => ({
    url: `${BASE}${path}`,
    lastModified: now,
    changeFrequency: path === "/" || path === "/shop" ? "daily" : "monthly",
    priority: path === "/" ? 1 : path === "/shop" ? 0.9 : 0.6,
  }));
}
