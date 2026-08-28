import { Vehicle } from "@/types";

export const vehicles: Vehicle[] = [
  {
    id: "v1",
    brand: "Hyundai",
    model: "Creta",
    year: 2026,
    variant: "SX(O)",
    slug: "hyundai-creta-2026-sxo",
  },
  {
    id: "v2",
    brand: "Hyundai",
    model: "Creta",
    year: 2025,
    variant: "SX",
    slug: "hyundai-creta-2025-sx",
  },
  {
    id: "v3",
    brand: "Kia",
    model: "Seltos",
    year: 2026,
    variant: "GTX+",
    slug: "kia-seltos-2026-gtxplus",
  },
  {
    id: "v4",
    brand: "Tata",
    model: "Harrier",
    year: 2026,
    variant: "XZA+",
    slug: "tata-harrier-2026-xzaplus",
  },
  {
    id: "v5",
    brand: "Mahindra",
    model: "XUV700",
    year: 2026,
    variant: "AX7L",
    slug: "mahindra-xuv700-2026-ax7l",
  },
];

export const vehicleBrands = Array.from(new Set(vehicles.map((v) => v.brand)));

export function getModelsForBrand(brand: string) {
  return Array.from(new Set(vehicles.filter((v) => v.brand === brand).map((v) => v.model)));
}

export function getYearsForBrandAndModel(brand: string, model: string) {
  return Array.from(
    new Set(vehicles.filter((v) => v.brand === brand && v.model === model).map((v) => v.year))
  );
}

export function getVariantsForBrandModelYear(brand: string, model: string, year: number) {
  return vehicles
    .filter((v) => v.brand === brand && v.model === model && v.year === year)
    .map((v) => v.variant);
}

export function findVehicle(brand: string, model: string, year: number, variant: string) {
  return vehicles.find((v) => v.brand === brand && v.model === model && v.year === year && v.variant === variant);
}
