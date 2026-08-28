import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Vehicle } from "@/types";

interface VehicleState {
  selected: Vehicle | null;
  setVehicle: (vehicle: Vehicle | null) => void;
  clearVehicle: () => void;
}

export const useVehicleStore = create<VehicleState>()(
  persist(
    (set) => ({
      selected: null,
      setVehicle: (vehicle) => set({ selected: vehicle }),
      clearVehicle: () => set({ selected: null }),
    }),
    {
      name: "cartunez-vehicle",
    }
  )
);
