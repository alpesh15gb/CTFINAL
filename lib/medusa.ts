import Medusa from "@medusajs/medusa-js";
import type { CartItem, Product, StoreCustomer, StoreOrder } from "@/types";

const FALLBACK_BACKEND_URL = "http://localhost:9000";
const ZERO_DECIMAL_CURRENCIES = new Set(["bif", "clp", "djf", "gnf", "jpy", "kmf", "krw", "mga", "pyg", "rwf", "ugx", "vnd", "vuv", "xaf", "xof", "xpf"]);

function resolveBackendUrl() {
  const configured = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL;

  if (typeof window !== "undefined") {
    if (!configured || configured.includes("cartunez-medusa")) {
      return window.location.origin;
    }
    return configured;
  }

  return process.env.MEDUSA_BACKEND_URL || configured || FALLBACK_BACKEND_URL;
}

export const medusaClient = new Medusa({
  baseUrl: resolveBackendUrl(),
  maxRetries: 3,
});

function toArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string");
  }
  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function minorToMajor(amount: number | null | undefined, currencyCode = "inr") {
  if (typeof amount !== "number") return 0;
  return ZERO_DECIMAL_CURRENCIES.has(currencyCode.toLowerCase()) ? amount : amount / 100;
}

function currencySymbol(currencyCode: string) {
  switch (currencyCode.toLowerCase()) {
    case "inr":
      return "₹";
    case "usd":
      return "$";
    case "eur":
      return "€";
    case "gbp":
      return "£";
    default:
      return `${currencyCode.toUpperCase()} `;
  }
}

function firstVariant(raw: any) {
  return raw?.variants?.[0] || null;
}

function getVariantPrice(variant: any) {
  if (!variant) return { amount: 0, originalAmount: undefined as number | undefined, currencyCode: "inr" };

  const preferredPrice =
    variant.prices?.find((price: any) => String(price?.currency_code || "").toLowerCase() === "inr") ||
    variant.prices?.[0];

  const currencyCode = String(preferredPrice?.currency_code || "inr").toLowerCase();
  const calculated = typeof variant.calculated_price === "number" ? variant.calculated_price : preferredPrice?.amount;
  const original = typeof variant.original_price === "number" ? variant.original_price : undefined;

  return {
    amount: minorToMajor(calculated || 0, currencyCode),
    originalAmount: typeof original === "number" ? minorToMajor(original, currencyCode) : undefined,
    currencyCode,
  };
}

export function mapMedusaProduct(raw: any): Product {
  const metadata = (raw?.metadata || {}) as Record<string, unknown>;
  const variant = firstVariant(raw);
  const price = getVariantPrice(variant);
  const category =
    String(metadata.category || "") ||
    raw?.categories?.[0]?.name ||
    raw?.type?.value ||
    raw?.collection?.title ||
    "Performance";
  const categorySlug =
    String(metadata.category_slug || "") ||
    raw?.categories?.[0]?.handle ||
    raw?.collection?.handle ||
    slugify(category);

  const imageUrls = [
    raw?.thumbnail,
    ...(Array.isArray(raw?.images) ? raw.images.map((image: any) => image?.url) : []),
  ].filter((url): url is string => typeof url === "string" && url.length > 0);

  const images = Array.from(new Set(imageUrls));
  const managedInventory = Boolean(variant?.manage_inventory);
  const inventoryQuantity = Number(variant?.inventory_quantity || 0);
  const inStock =
    typeof metadata.in_stock === "boolean"
      ? metadata.in_stock
      : Boolean(variant?.allow_backorder || !managedInventory || inventoryQuantity > 0);

  const originalPrice =
    price.originalAmount && price.originalAmount > price.amount ? price.originalAmount : undefined;

  return {
    id: String(raw?.id || ""),
    variantId: String(variant?.id || ""),
    slug: String(raw?.handle || raw?.id || "product"),
    name: String(raw?.title || "Untitled Product"),
    category,
    categorySlug,
    price: price.amount,
    originalPrice,
    currency: currencySymbol(price.currencyCode),
    currencyCode: price.currencyCode,
    rating: Number(metadata.rating || 0),
    reviewCount: Number(metadata.review_count || metadata.reviewCount || 0),
    compatibility: toArray(metadata.compatibility),
    images: images.length ? images : ["/logo/cartunez-logo.png"],
    description: String(raw?.description || metadata.description || ""),
    features: toArray(metadata.features),
    inStock,
    badge: typeof metadata.badge === "string" ? metadata.badge : undefined,
  };
}

export function mapMedusaCart(cart: any) {
  const currencyCode = String(cart?.region?.currency_code || "inr").toLowerCase();
  const items: CartItem[] = (cart?.items || []).map((line: any) => {
    const rawProduct = line?.variant?.product || {
      id: line?.variant?.product_id || line?.id,
      handle: line?.variant?.product?.handle || line?.variant?.sku || line?.id,
      title: line?.title,
      thumbnail: line?.thumbnail,
      description: line?.description,
      metadata: line?.metadata || {},
      variants: [
        {
          ...(line?.variant || {}),
          id: line?.variant_id || line?.variant?.id,
          calculated_price: line?.unit_price,
          prices: [{ amount: line?.unit_price, currency_code: currencyCode }],
        },
      ],
    };

    const product = mapMedusaProduct(rawProduct);
    product.price = minorToMajor(line?.unit_price, currencyCode);
    product.currencyCode = currencyCode;
    product.currency = currencySymbol(currencyCode);
    product.variantId = String(line?.variant_id || line?.variant?.id || product.variantId);

    return {
      id: String(line?.id || product.variantId),
      product,
      quantity: Number(line?.quantity || 1),
    };
  });

  return {
    id: String(cart?.id || ""),
    items,
    subtotal: minorToMajor(cart?.subtotal, currencyCode),
    total: minorToMajor(cart?.total, currencyCode),
    currencyCode,
  };
}

export async function getProducts(options?: {
  limit?: number;
  offset?: number;
  category?: string;
  search?: string;
}) {
  try {
    const query: Record<string, unknown> = {
      limit: options?.limit || 100,
      offset: options?.offset || 0,
    };

    if (options?.search) query.q = options.search;

    const res = await medusaClient.products.list(query as any);
    let products = (res.products || []).map(mapMedusaProduct);

    if (options?.category) {
      products = products.filter((product) => product.categorySlug === options.category);
    }

    return products;
  } catch (error) {
    console.error("Failed to fetch Medusa products:", error);
    return [];
  }
}

export async function getProductBySlug(slug: string) {
  try {
    const { products } = await medusaClient.products.list({ handle: slug } as any);
    return products?.[0] ? mapMedusaProduct(products[0]) : null;
  } catch (error) {
    console.error("Failed to fetch Medusa product:", error);
    return null;
  }
}

export async function createCart() {
  const regionId = process.env.NEXT_PUBLIC_MEDUSA_REGION_ID;
  const salesChannelId = process.env.NEXT_PUBLIC_MEDUSA_SALES_CHANNEL_ID;
  const payload: Record<string, string> = {};

  if (regionId) payload.region_id = regionId;
  if (salesChannelId) payload.sales_channel_id = salesChannelId;

  if (!payload.region_id) {
    try {
      const { regions } = await medusaClient.regions.list();
      if (regions?.[0]?.id) payload.region_id = regions[0].id;
    } catch (error) {
      console.warn("Could not resolve a Medusa region before creating cart:", error);
    }
  }

  const { cart } = await medusaClient.carts.create(payload as any);
  return cart;
}

export async function retrieveCart(cartId: string) {
  const { cart } = await medusaClient.carts.retrieve(cartId);
  return cart;
}

export async function addToCart(cartId: string, variantId: string, quantity: number) {
  const { cart } = await medusaClient.carts.lineItems.create(cartId, {
    variant_id: variantId,
    quantity,
  });
  return cart;
}

export async function updateCartLineItem(cartId: string, lineItemId: string, quantity: number) {
  const { cart } = await medusaClient.carts.lineItems.update(cartId, lineItemId, { quantity });
  return cart;
}

export async function removeCartLineItem(cartId: string, lineItemId: string) {
  const { cart } = await medusaClient.carts.lineItems.delete(cartId, lineItemId);
  return cart;
}

export async function attachCartToCustomer(cartId: string, customer: StoreCustomer) {
  const { cart } = await medusaClient.carts.update(
    cartId,
    { customer_id: customer.id, email: customer.email } as any
  );
  return cart;
}

export async function getCustomerSession(): Promise<StoreCustomer | null> {
  try {
    const { customer } = await medusaClient.auth.getSession();
    return customer as StoreCustomer;
  } catch {
    return null;
  }
}

export async function loginCustomer(email: string, password: string) {
  const { customer } = await medusaClient.auth.authenticate({ email, password });
  return customer as StoreCustomer;
}

export async function registerCustomer(payload: {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}) {
  await medusaClient.customers.create(payload as any);
  return loginCustomer(payload.email, payload.password);
}

export async function logoutCustomer() {
  await medusaClient.auth.deleteSession();
}

export async function updateCustomer(payload: Record<string, unknown>) {
  const { customer } = await medusaClient.customers.update(payload as any);
  return customer as StoreCustomer;
}

export async function listCustomerOrders() {
  const response = await medusaClient.customers.listOrders({ limit: 50 } as any);
  return (response.orders || []) as StoreOrder[];
}
