import { useEffect } from "react";
import { useWishlistStore } from "@/stores/wishlistStore";
import { useCustomer } from "@/hooks/useCustomer";

export function useWishlist() {
  const { customer } = useCustomer();
  const ids = useWishlistStore((state) => state.ids);
  const syncing = useWishlistStore((state) => state.syncing);
  const error = useWishlistStore((state) => state.error);
  const toggleStore = useWishlistStore((state) => state.toggle);
  const syncWithCustomer = useWishlistStore((state) => state.syncWithCustomer);

  useEffect(() => {
    if (customer) void syncWithCustomer(customer);
  }, [customer?.id, syncWithCustomer]);

  return {
    ids,
    count: ids.length,
    syncing,
    error,
    isWishlisted: (productId: string) => ids.includes(productId),
    toggle: (productId: string) => toggleStore(productId, customer),
  };
}
