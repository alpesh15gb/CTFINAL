import { create } from "zustand";
import type { StoreCustomer, StoreOrder } from "@/types";
import {
  getCustomerSession,
  listCustomerOrders,
  loginCustomer,
  logoutCustomer,
  registerCustomer,
  updateCustomer,
} from "@/lib/medusa";
import { useCartStore } from "@/stores/cartStore";

interface CustomerState {
  customer: StoreCustomer | null;
  orders: StoreOrder[];
  initialized: boolean;
  loading: boolean;
  error: string | null;
  hydrate: () => Promise<void>;
  login: (email: string, password: string) => Promise<boolean>;
  register: (payload: { email: string; password: string; first_name: string; last_name: string }) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshOrders: () => Promise<void>;
  updateProfile: (payload: Record<string, unknown>) => Promise<boolean>;
}

function message(error: unknown) {
  if (error && typeof error === "object" && "message" in error) {
    return String((error as { message?: unknown }).message || "Account request failed");
  }
  return "Account request failed";
}

async function fetchOrdersSafely() {
  try {
    return await listCustomerOrders();
  } catch {
    return [];
  }
}

export const useCustomerStore = create<CustomerState>((set, get) => ({
  customer: null,
  orders: [],
  initialized: false,
  loading: false,
  error: null,

  hydrate: async () => {
    if (get().initialized || get().loading) return;
    set({ loading: true, error: null });
    const customer = await getCustomerSession();
    const orders = customer ? await fetchOrdersSafely() : [];

    if (customer) void useCartStore.getState().attachCustomer(customer);
    set({ customer, orders, initialized: true, loading: false });
  },

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const customer = await loginCustomer(email, password);
      await useCartStore.getState().attachCustomer(customer);
      const orders = await fetchOrdersSafely();
      set({ customer, orders, initialized: true, loading: false });
      return true;
    } catch (error) {
      set({ loading: false, error: message(error) });
      return false;
    }
  },

  register: async (payload) => {
    set({ loading: true, error: null });
    try {
      const customer = await registerCustomer(payload);
      await useCartStore.getState().attachCustomer(customer);
      set({ customer, orders: [], initialized: true, loading: false });
      return true;
    } catch (error) {
      set({ loading: false, error: message(error) });
      return false;
    }
  },

  logout: async () => {
    set({ loading: true, error: null });
    try {
      await logoutCustomer();
    } finally {
      await useCartStore.getState().detachCustomer();
      set({ customer: null, orders: [], initialized: true, loading: false });
    }
  },

  refreshOrders: async () => {
    if (!get().customer) return;
    set({ orders: await fetchOrdersSafely() });
  },

  updateProfile: async (payload) => {
    set({ loading: true, error: null });
    try {
      const customer = await updateCustomer(payload);
      set({ customer, loading: false });
      return true;
    } catch (error) {
      set({ loading: false, error: message(error) });
      return false;
    }
  },
}));
