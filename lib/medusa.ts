import Medusa from "@medusajs/medusa-js";

const MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";

export const medusaClient = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL,
  maxRetries: 3,
});

// Product helpers
export async function getProducts(options?: {
  limit?: number;
  offset?: number;
  category?: string;
  search?: string;
}) {
  try {
    const res = await medusaClient.products.list({
      limit: options?.limit || 12,
      offset: options?.offset || 0,
    });
    return res.products;
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }
}

export async function getProductBySlug(slug: string) {
  try {
    const { products } = await medusaClient.products.list({
      handle: slug,
    });
    return products[0] || null;
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return null;
  }
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
