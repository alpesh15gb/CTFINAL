import Medusa from "@medusajs/medusa-js";

export const MEDUSA_BACKEND_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";
export const MEDUSA_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "";

if (typeof window !== "undefined" && !MEDUSA_PUBLISHABLE_KEY) {
  // eslint-disable-next-line no-console
  console.warn(
    "[store] NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY is not set — live product fetches will fail."
  );
}

export const medusaClient = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL,
  maxRetries: 3,
  apiKey: MEDUSA_PUBLISHABLE_KEY || undefined,
});

// Product helpers (live Medusa store API — these throw on failure so callers
// can distinguish "backend unreachable" from "no products").
export async function listStoreProducts(options?: {
  limit?: number;
  offset?: number;
}) {
  const res = await medusaClient.products.list({
    limit: options?.limit ?? 100,
    offset: options?.offset ?? 0,
  });
  return (res?.products ?? []) as unknown[];
}

export async function getStoreProductByHandle(handle: string) {
  const { products } = await medusaClient.products.list({ handle });
  return ((products ?? [])[0] ?? null) as unknown | null;
}

export async function listStoreCategories() {
  const res = await medusaClient.productCategories.list({ limit: 100 });
  const raw = res as unknown as {
    product_categories?: unknown[];
    productCategories?: unknown[];
  };
  return (raw?.product_categories ?? raw?.productCategories ?? []) as unknown[];
}

export async function listStoreCollections() {
  const res = await medusaClient.collections.list({ limit: 100 });
  const raw = res as unknown as { collections?: unknown[] };
  return (raw?.collections ?? []) as unknown[];
}

// Cart helpers
export async function createCart() {
  try {
    const { cart } = await medusaClient.carts.create({});
    return cart;
  } catch (error) {
    console.error("Failed to create cart:", error);
    return null;
  }
}

export async function addToCart(cartId: string, variantId: string, quantity: number) {
  try {
    const { cart } = await medusaClient.carts.lineItems.create(cartId, {
      variant_id: variantId,
      quantity,
    });
    return cart;
  } catch (error) {
    console.error("Failed to add to cart:", error);
    return null;
  }
}

export async function updateCartLineItem(cartId: string, lineItemId: string, quantity: number) {
  try {
    const { cart } = await medusaClient.carts.lineItems.update(cartId, lineItemId, {
      quantity,
    });
    return cart;
  } catch (error) {
    console.error("Failed to update cart item:", error);
    return null;
  }
}

export async function removeCartLineItem(cartId: string, lineItemId: string) {
  try {
    const { cart } = await medusaClient.carts.lineItems.delete(cartId, lineItemId);
    return cart;
  } catch (error) {
    console.error("Failed to remove cart item:", error);
    return null;
  }
}
