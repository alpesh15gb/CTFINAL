import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { StoreCustomer } from "@/types";
import { updateCustomer } from "@/lib/medusa";

const WISHLIST_KEY = "cartunez_wishlist";

interface WishlistState {
  ids: string[];
  syncing: boolean;
  error: string | null;
  toggle: (productId: string, customer: StoreCustomer | null) => Promise<void>;
  syncWithCustomer: (customer: StoreCustomer) => Promise<void>;
}

function remoteIds(customer: StoreCustomer) {
  const value = customer.metadata?.[WISHLIST_KEY];
  return Array.isArray(value) ? value.filter((id): id is string => typeof id === "string") : [];
}

async function persistRemote(customer: StoreCustomer, ids: string[]) {
  await updateCustomer({
    metadata: {
      ...(customer.metadata || {}),
      [WISHLIST_KEY]: ids,
    },
  });
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      ids: [],
      syncing: false,
      error: null,

      toggle: async (productId, customer) => {
        const exists = get().ids.includes(productId);
        const ids = exists ? get().ids.filter((id) => id !== productId) : [...get().ids, productId];
        set({ ids, error: null });

        if (!customer) return;
        set({ syncing: true });
        try {
          await persistRemote(customer, ids);
          set({ syncing: false });
        } catch (error) {
          set({ syncing: false, error: error instanceof Error ? error.message : "Wishlist sync failed" });
        }
      },

      syncWithCustomer: async (customer) => {
        if (get().syncing) return;

        const remote = remoteIds(customer);
        const merged = Array.from(new Set([...remote, ...get().ids]));
        set({ ids: merged, syncing: true, error: null });

        try {
          if (merged.length !== remote.length || merged.some((id) => !remote.includes(id))) {
            await persistRemote(customer, merged);
          }
          set({ syncing: false });
        } catch (error) {
          set({ syncing: false, error: error instanceof Error ? error.message : "Wishlist sync failed" });
        }
      },
    }),
    {
      name: "cartunez-wishlist",
      partialize: (state) => ({ ids: state.ids }),
    }
  )
);
