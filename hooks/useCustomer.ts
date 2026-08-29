import { useEffect } from "react";
import { useCustomerStore } from "@/stores/customerStore";

export function useCustomer() {
  const customer = useCustomerStore((state) => state.customer);
  const orders = useCustomerStore((state) => state.orders);
  const initialized = useCustomerStore((state) => state.initialized);
  const loading = useCustomerStore((state) => state.loading);
  const error = useCustomerStore((state) => state.error);
  const hydrate = useCustomerStore((state) => state.hydrate);
  const login = useCustomerStore((state) => state.login);
  const register = useCustomerStore((state) => state.register);
  const logout = useCustomerStore((state) => state.logout);
  const refreshOrders = useCustomerStore((state) => state.refreshOrders);
  const updateProfile = useCustomerStore((state) => state.updateProfile);

  useEffect(() => {
    if (!initialized && !loading) void hydrate();
  }, [hydrate, initialized, loading]);

  return { customer, orders, initialized, loading, error, login, register, logout, refreshOrders, updateProfile };
}
