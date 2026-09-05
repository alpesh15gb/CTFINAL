// Adapter: Medusa v1 store API payloads -> local `Product` / `Category` types.
//
// Every product surface (shop listing, product detail, featured rail, cart)
// consumes the local types, so this is the single place where backend shape
// meets UI shape. Unknown/optional backend data degrades to neutral defaults
// (empty compatibility = fits all vehicles, no rating shown when there are
// no reviews) — never to dummy products.

import type { Category, Product } from "@/types";

/** Minimal structural view of a Medusa v1 store product. */
export interface MedusaMoneyAmount {
  amount: number;
  currency_code: string;
}

export interface MedusaStoreVariant {
  id: string;
  inventory_quantity?: number | null;
  allow_backorder?: boolean;
  prices?: MedusaMoneyAmount[];
}

export interface MedusaStoreImage {
  id: string;
  url: string;
}

export interface MedusaStoreCategory {
  id: string;
  name: string;
  handle: string;
}

export interface MedusaStoreCollection {
  id: string;
  title: string;
  handle: string;
}

export interface MedusaStoreProduct {
  id: string;
  title: string;
  handle: string;
  collection_id?: string | null;
  description?: string | null;
  thumbnail?: string | null;
  images?: MedusaStoreImage[];
  categories?: MedusaStoreCategory[];
  variants?: MedusaStoreVariant[];
  metadata?: Record<string, unknown> | null;
}

const CURRENCY_SYMBOLS: Record<string, string> = {
  inr: "₹",
  usd: "$",
  eur: "€",
  gbp: "£",
  aed: "د.إ ",
};

function currencySymbol(code?: string): string {
  if (!code) return "₹";
  return CURRENCY_SYMBOLS[code.toLowerCase()] ?? `${code.toUpperCase()} `;
}

/** Accepts a string array or a comma-separated string (Medusa metadata). */
function metaStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((v): v is string => typeof v === "string");
  }
  if (typeof value === "string") {
    return value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

export function adaptStoreProduct(p: MedusaStoreProduct): Product {
  const variants = p.variants ?? [];

  const allPrices = variants.flatMap((v) => v.prices ?? []);
  const cheapest = allPrices.reduce<MedusaMoneyAmount | null>(
    (best, cur) => (!best || cur.amount < best.amount ? cur : best),
    null
  );

  const imageUrls = [
    ...(p.thumbnail ? [p.thumbnail] : []),
    ...(p.images ?? []).map((img) => img.url).filter(Boolean),
  ].filter((url, idx, arr) => arr.indexOf(url) === idx);

  const meta = p.metadata ?? {};
  const primaryCategory = p.categories?.[0];

  return {
    id: p.id,
    slug: p.handle,
    name: p.title,
    category: primaryCategory?.name ?? "General",
    categorySlug: primaryCategory?.handle ?? "general",
    collectionId: p.collection_id ?? null,
    price: cheapest ? Math.round(cheapest.amount / 100) : 0,
    originalPrice: undefined,
    currency: currencySymbol(cheapest?.currency_code),
    rating: Number(meta.rating) || 0,
    reviewCount: Number(meta.reviewCount) || 0,
    // Empty compatibility = universal fit (backend carries no fitment info).
    compatibility: [
      ...metaStringArray(meta.compatibility),
      ...metaStringArray(meta.fitment),
    ],
    images: imageUrls,
    description: p.description ?? "",
    features: metaStringArray(meta.features),
    inStock:
      variants.length > 0 &&
      variants.some(
        (v) => (v.inventory_quantity ?? 1) > 0 || v.allow_backorder === true
      ),
    badge: typeof meta.badge === "string" ? meta.badge : undefined,
  };
}

export function adaptStoreCategory(c: MedusaStoreCategory): Category {
  return {
    id: c.id,
    name: c.name,
    slug: c.handle,
    description: "",
    image: "",
  };
}
