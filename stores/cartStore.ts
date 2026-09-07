import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem, Product } from "@/types";

/** Stable identity for a cart line: same product, different variant = lines. */
export function cartLineKey(product: Pick<Product, "id" | "variantId">) {
  return `${product.id}::${product.variantId ?? ""}`;
}

export function cartItemKey(item: CartItem) {
  return cartLineKey(item.product);
}

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (lineKey: string) => void;
  updateQuantity: (lineKey: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  subtotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantity = 1) => {
        const key = cartLineKey(product);
        const existing = get().items.find(
          (i) => cartItemKey(i) === key
        );
        if (existing) {
          set({
            items: get().items.map((i) =>
              cartItemKey(i) === key
                ? { ...i, quantity: i.quantity + quantity }
                : i
            ),
          });
        } else {
          set({ items: [...get().items, { product, quantity }] });
        }
      },
      removeItem: (lineKey) => {
        set({
          items: get().items.filter((i) => cartItemKey(i) !== lineKey),
        });
      },
      updateQuantity: (lineKey, quantity) => {
        if (quantity < 1) {
          get().removeItem(lineKey);
          return;
        }
        set({
          items: get().items.map((i) =>
            cartItemKey(i) === lineKey ? { ...i, quantity } : i
          ),
        });
      },
      clearCart: () => set({ items: [] }),
      totalItems: () => get().items.reduce((acc, i) => acc + i.quantity, 0),
      subtotal: () =>
        get().items.reduce((acc, i) => acc + i.product.price * i.quantity, 0),
    }),
    {
      name: "cartunez-cart",
    }
  )
);

// Keep tabs in sync: another tab editing the cart rehydrates this one instead
// of silently diverging and overwriting on next write.
if (typeof window !== "undefined") {
  window.addEventListener("storage", (event) => {
    if (event.key === "cartunez-cart") {
      void useCartStore.persist.rehydrate();
    }
  });
}
