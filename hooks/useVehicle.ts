import { useVehicleStore } from "@/stores/vehicleStore";

export function useVehicle() {
  const selected = useVehicleStore((state) => state.selected);
  const setVehicle = useVehicleStore((state) => state.setVehicle);
  const clearVehicle = useVehicleStore((state) => state.clearVehicle);

  return { selected, setVehicle, clearVehicle };
}
