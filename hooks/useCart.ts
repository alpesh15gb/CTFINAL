import { useEffect } from "react";
import { useCartStore } from "@/stores/cartStore";

export function useCart() {
  const items = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clearCart = useCartStore((state) => state.clearCart);
  const totalItems = useCartStore((state) => state.totalItems);
  const subtotal = useCartStore((state) => state.subtotal);
  const hydrate = useCartStore((state) => state.hydrate);
  const initialized = useCartStore((state) => state.initialized);
  const loading = useCartStore((state) => state.loading);
  const error = useCartStore((state) => state.error);

  useEffect(() => {
    if (!initialized && !loading) void hydrate();
  }, [hydrate, initialized, loading]);

  return {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    totalItems,
    subtotal,
    loading,
    error,
  };
}
