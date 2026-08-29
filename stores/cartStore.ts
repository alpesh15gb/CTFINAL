import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, Product, StoreCustomer } from "@/types";
import {
  addToCart,
  attachCartToCustomer,
  createCart,
  mapMedusaCart,
  removeCartLineItem,
  retrieveCart,
  updateCartLineItem,
} from "@/lib/medusa";

interface CartState {
  cartId: string | null;
  items: CartItem[];
  subtotalValue: number;
  totalValue: number;
  initialized: boolean;
  loading: boolean;
  error: string | null;
  customer: StoreCustomer | null;
  hydrate: () => Promise<void>;
  addItem: (product: Product, quantity?: number) => Promise<boolean>;
  removeItem: (lineItemId: string) => Promise<boolean>;
  updateQuantity: (lineItemId: string, quantity: number) => Promise<boolean>;
  clearCart: () => Promise<boolean>;
  attachCustomer: (customer: StoreCustomer) => Promise<void>;
  detachCustomer: () => Promise<void>;
  totalItems: () => number;
  subtotal: () => number;
}

function errorMessage(error: unknown) {
  if (error && typeof error === "object" && "message" in error) {
    return String((error as { message?: unknown }).message || "Cart request failed");
  }
  return "Cart request failed";
}

function cartPatch(cart: any) {
  const mapped = mapMedusaCart(cart);
  return {
    cartId: mapped.id,
    items: mapped.items,
    subtotalValue: mapped.subtotal,
    totalValue: mapped.total,
    initialized: true,
    error: null,
  };
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cartId: null,
      items: [],
      subtotalValue: 0,
      totalValue: 0,
      initialized: false,
      loading: false,
      error: null,
      customer: null,

      hydrate: async () => {
        if (get().initialized || get().loading) return;
        set({ loading: true, error: null });

        try {
          let cart: any;
          if (get().cartId) {
            try {
              cart = await retrieveCart(get().cartId as string);
            } catch {
              cart = await createCart();
            }
          } else {
            cart = await createCart();
          }

          if (get().customer) {
            cart = await attachCartToCustomer(cart.id, get().customer as StoreCustomer);
          }

          set({ ...cartPatch(cart), loading: false });
        } catch (error) {
          set({ initialized: true, loading: false, error: errorMessage(error) });
        }
      },

      addItem: async (product, quantity = 1) => {
        if (!product.variantId) {
          set({ error: "This Medusa product has no purchasable variant." });
          return false;
        }

        set({ loading: true, error: null });
        try {
          let cartId = get().cartId;
          if (!cartId) {
            let cart = await createCart();
            if (get().customer) cart = await attachCartToCustomer(cart.id, get().customer as StoreCustomer);
            set(cartPatch(cart));
            cartId = cart.id;
          }

          const cart = await addToCart(cartId, product.variantId, Math.max(1, quantity));
          set({ ...cartPatch(cart), loading: false });
          return true;
        } catch (error) {
          set({ loading: false, error: errorMessage(error) });
          return false;
        }
      },

      removeItem: async (lineItemId) => {
        if (!get().cartId) return false;
        set({ loading: true, error: null });
        try {
          const cart = await removeCartLineItem(get().cartId as string, lineItemId);
          set({ ...cartPatch(cart), loading: false });
          return true;
        } catch (error) {
          set({ loading: false, error: errorMessage(error) });
          return false;
        }
      },

      updateQuantity: async (lineItemId, quantity) => {
        if (quantity < 1) return get().removeItem(lineItemId);
        if (!get().cartId) return false;

        set({ loading: true, error: null });
        try {
          const cart = await updateCartLineItem(get().cartId as string, lineItemId, quantity);
          set({ ...cartPatch(cart), loading: false });
          return true;
        } catch (error) {
          set({ loading: false, error: errorMessage(error) });
          return false;
        }
      },

      clearCart: async () => {
        set({ loading: true, error: null });
        try {
          let cart = await createCart();
          if (get().customer) cart = await attachCartToCustomer(cart.id, get().customer as StoreCustomer);
          set({ ...cartPatch(cart), loading: false });
          return true;
        } catch (error) {
          set({ loading: false, error: errorMessage(error) });
          return false;
        }
      },

      attachCustomer: async (customer) => {
        set({ customer, loading: true, error: null });
        try {
          let cart: any;
          if (get().cartId) {
            cart = await attachCartToCustomer(get().cartId as string, customer);
          } else {
            const freshCart = await createCart();
            cart = await attachCartToCustomer(freshCart.id, customer);
          }
          set({ ...cartPatch(cart), customer, loading: false });
        } catch (error) {
          set({ loading: false, error: errorMessage(error) });
        }
      },

      detachCustomer: async () => {
        set({ customer: null });
        await get().clearCart();
      },

      totalItems: () => get().items.reduce((total, item) => total + item.quantity, 0),
      subtotal: () => get().subtotalValue || get().items.reduce((total, item) => total + item.product.price * item.quantity, 0),
    }),
    {
      name: "cartunez-medusa-cart",
      partialize: (state) => ({
        cartId: state.cartId,
        items: state.items,
        subtotalValue: state.subtotalValue,
        totalValue: state.totalValue,
      }),
    }
  )
);
