import { Category } from "@/types";

export const categories: Category[] = [
  {
    id: "exterior",
    name: "Exterior",
    slug: "exterior",
    description: "Body kits, spoilers, mirror caps and grille upgrades.",
    image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "interior",
    name: "Interior",
    slug: "interior",
    description: "Mats, steering wheels, ambient lighting and trims.",
    image: "https://images.unsplash.com/photo-1549064233-945d7063292f?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "lighting",
    name: "Lighting",
    slug: "lighting",
    description: "LED headlights, tail-lights, DRLs and ambient kits.",
    image: "https://images.unsplash.com/photo-1542282088-fe8426682b8f?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "wheels",
    name: "Wheels",
    slug: "wheels",
    description: "Forged alloys, finishes and performance tyres.",
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "performance",
    name: "Performance",
    slug: "performance",
    description: "Turbo, intake, exhaust and tuning upgrades.",
    image: "https://images.unsplash.com/photo-1527383418406-f85a3b146499?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "audio",
    name: "Audio",
    slug: "audio",
    description: "Premium speakers, infotainment and sound deadening.",
    image: "https://images.unsplash.com/photo-1645536729519-134e3b7e9e88?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "protection",
    name: "Protection",
    slug: "protection",
    description: "Ceramic coating, PPF and all-weather mats.",
    image: "https://images.unsplash.com/photo-1607860115477-7b3700e055b6?q=80&w=1200&auto=format&fit=crop",
  },
];

export const categorySlugs = categories.map((c) => c.slug);
