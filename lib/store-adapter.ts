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
  allow_backorder?: boolean | null;
  prices?: MedusaMoneyAmount[];
  metadata?: Record<string, unknown> | null;
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
function metaStringArray(value: unknown): string[] {  if (Array.isArray(value)) {
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

/**
 * Cap Shopify CDN originals to a bounded width (e.g. multi-MB `photo-output`
 * files become `_1600x` variants). Shopify serves these resized bytes
 * directly, so both the upstream fetch and the Next optimizer transform get
 * dramatically faster. Non-Shopify hosts and unrecognized shapes pass
 * through untouched.
 */
function boundedSourceImage(url: string, width = 1600): string {
  const match = String(url || "").match(
    /^(https:\/\/cdn\.shopify\.com\/\S+?)(?:_\d+x)?\.(jpg|jpeg|png|webp)(\?.*)?$/i
  );
  if (!match) return url;
  return `${match[1]}_${width}x.${match[2]}${match[3] ?? ""}`;
}

export function adaptStoreProduct(p: MedusaStoreProduct): Product {
  const variants = p.variants ?? [];

  // Cheapest priced variant wins the default price/variant (detail page can
  // override with an explicit variant selection).
  let cheapestVariant: MedusaStoreVariant | null = null;
  let cheapestAmount = Infinity;
  for (const v of variants) {
    for (const price of v.prices ?? []) {
      if (price.amount < cheapestAmount) {
        cheapestAmount = price.amount;
        cheapestVariant = v;
      }
    }
  }
  const cheapestPrice = cheapestVariant
    ? (cheapestVariant.prices ?? []).reduce<MedusaMoneyAmount | null>(
        (best, cur) => (!best || cur.amount < best.amount ? cur : best),
        null
      )
    : null;
  // Imports stamp the pre-discount MRP (paise) into variant metadata.
  const comparePaise = Number(
    (cheapestVariant?.metadata as Record<string, unknown> | undefined)
      ?.compare_at_price ?? 0
  );
  const compareRupees =
    Number.isFinite(comparePaise) && comparePaise > 0
      ? Math.round(comparePaise / 100)
      : undefined;
  const price = cheapestPrice ? Math.round(cheapestPrice.amount / 100) : 0;

  const imageUrls = [
    ...(p.thumbnail ? [p.thumbnail] : []),
    ...(p.images ?? []).map((img) => img.url).filter(Boolean),
  ]
    .map((url) => boundedSourceImage(url))
    .filter((url, idx, arr) => arr.indexOf(url) === idx);

  const meta = p.metadata ?? {};
  // Live join first; fall back to the category snapshot the import scripts
  // stamp into metadata (present on every imported product, create or update).
  const primaryCategory = p.categories?.[0];
  const categoryName =
    primaryCategory?.name ??
    (typeof meta.category === "string" ? meta.category : undefined) ??
    "General";
  const categorySlug =
    primaryCategory?.handle ??
    (typeof meta.category_slug === "string" ? meta.category_slug : undefined) ??
    "general";

  return {
    id: p.id,
    slug: p.handle,
    name: p.title,
    category: categoryName,
    categorySlug: categorySlug,
    collectionId: p.collection_id ?? null,
    price,
    originalPrice:
      compareRupees && compareRupees > price ? compareRupees : undefined,
    currency: currencySymbol(cheapestPrice?.currency_code),
    variantId: cheapestVariant?.id ?? null,
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
