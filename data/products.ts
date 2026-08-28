import { Product } from "@/types";

export const products: Product[] = [
  {
    id: "p1",
    slug: "forged-alloy-wheels-v01",
    name: "Forged Alloy Wheels — V01",
    category: "Wheels",
    categorySlug: "wheels",
    price: 28999,
    originalPrice: 34999,
    currency: "₹",
    rating: 4.8,
    reviewCount: 124,
    compatibility: ["hyundai-creta-2026-sxo", "kia-seltos-2026-gtxplus", "tata-harrier-2026-xzaplus"],
    images: [
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1542377281-73d08e3a10aa?q=80&w=1200&auto=format&fit=crop",
    ],
    description:
      "Lightweight forged alloy wheels engineered for street performance and show-ready stance. Satin black finish with machined accents.",
    features: ["18-inch fitment", "Flow-formed construction", "Satin black finish", "Includes lug nuts"],
    inStock: true,
    badge: "Best Seller",
  },
  {
    id: "p2",
    slug: "ambient-interior-lighting-kit",
    name: "Ambient Interior Lighting Kit",
    category: "Interior",
    categorySlug: "interior",
    price: 8499,
    currency: "₹",
    rating: 4.6,
    reviewCount: 89,
    compatibility: ["hyundai-creta-2026-sxo", "hyundai-creta-2025-sx", "kia-seltos-2026-gtxplus"],
    images: [
      "https://images.unsplash.com/photo-1549064233-945d7063292f?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?q=80&w=1200&auto=format&fit=crop",
    ],
    description:
      "App-controlled ambient lighting with 64 colors, music sync and dedicated zone control for footwells, dash and doors.",
    features: ["64-color palette", "Music sync mode", "App + remote control", "Plug-and-play harness"],
    inStock: true,
  },
  {
    id: "p3",
    slug: "carbon-fibre-mirror-caps",
    name: "Carbon Fibre Mirror Caps",
    category: "Exterior",
    categorySlug: "exterior",
    price: 4999,
    currency: "₹",
    rating: 4.5,
    reviewCount: 62,
    compatibility: ["hyundai-creta-2026-sxo", "hyundai-creta-2025-sx"],
    images: [
      "https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=1200&auto=format&fit=crop",
    ],
    description:
      "Real carbon fibre mirror caps with UV-resistant clear coat. Direct OEM replacement for a factory-fit finish.",
    features: ["Dry carbon weave", "OEM replacement fit", "UV clear coat", "Pair included"],
    inStock: true,
  },
  {
    id: "p4",
    slug: "premium-all-weather-floor-mats",
    name: "Premium All-Weather Floor Mats",
    category: "Interior",
    categorySlug: "interior",
    price: 3999,
    originalPrice: 4599,
    currency: "₹",
    rating: 4.7,
    reviewCount: 210,
    compatibility: ["hyundai-creta-2026-sxo", "hyundai-creta-2025-sx", "kia-seltos-2026-gtxplus", "tata-harrier-2026-xzaplus", "mahindra-xuv700-2026-ax7l"],
    images: [
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1200&auto=format&fit=crop",
    ],
    description:
      "3D-scanned floor mats with raised edges and anti-slip backing. Built to trap mud, water and road grime.",
    features: ["3D-scanned fit", "Raised edges", "Anti-slip backing", "Easy to clean"],
    inStock: true,
  },
  {
    id: "p5",
    slug: "led-headlight-upgrade",
    name: "LED Headlight Upgrade",
    category: "Lighting",
    categorySlug: "lighting",
    price: 12999,
    currency: "₹",
    rating: 4.9,
    reviewCount: 156,
    compatibility: ["hyundai-creta-2026-sxo", "hyundai-creta-2025-sx", "kia-seltos-2026-gtxplus"],
    images: [
      "https://images.unsplash.com/photo-1542282088-fe8426682b8f?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1200&auto=format&fit=crop",
    ],
    description:
      "High-output LED projector upgrade with integrated DRL and sequential indicators. DOT-compliant beam pattern.",
    features: ["Projector LED", "Sequential DRL", "CAN-bus friendly", "2-year warranty"],
    inStock: true,
    badge: "Top Rated",
  },
  {
    id: "p6",
    slug: "performance-steering-wheel",
    name: "Performance Steering Wheel",
    category: "Interior",
    categorySlug: "interior",
    price: 15999,
    currency: "₹",
    rating: 4.7,
    reviewCount: 74,
    compatibility: ["hyundai-creta-2026-sxo", "kia-seltos-2026-gtxplus", "mahindra-xuv700-2026-ax7l"],
    images: [
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1553818501-e9926ea1ea8f?q=80&w=1200&auto=format&fit=crop",
    ],
    description:
      "Flat-bottom steering wheel with perforated leather, carbon accents and integrated shift paddles. Retains all controls.",
    features: ["Perforated leather", "Flat-bottom design", "Carbon trim", "OEM control retention"],
    inStock: true,
  },
  {
    id: "p7",
    slug: "rear-spoiler-gloss-black",
    name: "Rear Spoiler — Gloss Black",
    category: "Exterior",
    categorySlug: "exterior",
    price: 6999,
    currency: "₹",
    rating: 4.4,
    reviewCount: 48,
    compatibility: ["hyundai-creta-2026-sxo", "hyundai-creta-2025-sx"],
    images: [
      "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=1200&auto=format&fit=crop",
    ],
    description:
      "Sport rear spoiler in gloss black with pre-applied 3M tape. Adds downforce-ready style without drilling.",
    features: ["Gloss black finish", "3M adhesive backing", "No drilling", "OEM-style profile"],
    inStock: true,
  },
  {
    id: "p8",
    slug: "ceramic-protection-kit",
    name: "Ceramic Protection Kit",
    category: "Protection",
    categorySlug: "protection",
    price: 5499,
    originalPrice: 6499,
    currency: "₹",
    rating: 4.8,
    reviewCount: 132,
    compatibility: ["hyundai-creta-2026-sxo", "kia-seltos-2026-gtxplus", "tata-harrier-2026-xzaplus", "mahindra-xuv700-2026-ax7l"],
    images: [
      "https://images.unsplash.com/photo-1551522435-a13afa10f103?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1605515298946-d062f2e9da53?q=80&w=1200&auto=format&fit=crop",
    ],
    description:
      "SiO2 ceramic coating kit with prep, coating and maintenance products. Up to 2 years of hydrophobic protection.",
    features: ["SiO2 formula", "Hydrophobic finish", "UV protection", "DIY application kit"],
    inStock: true,
  },
  {
    id: "p9",
    slug: "aero-body-kit",
    name: "Aero Body Kit",
    category: "Exterior",
    categorySlug: "exterior",
    price: 45999,
    currency: "₹",
    rating: 4.6,
    reviewCount: 31,
    compatibility: ["hyundai-creta-2026-sxo"],
    images: [
      "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=1200&auto=format&fit=crop",
    ],
    description:
      "Complete aero package with front splitter, side skirts and rear diffuser. Paint-ready primer finish.",
    features: ["Front splitter", "Side skirts", "Rear diffuser", "PP material"],
    inStock: true,
  },
  {
    id: "p10",
    slug: "roof-rails-black",
    name: "Roof Rails — Black",
    category: "Exterior",
    categorySlug: "exterior",
    price: 5999,
    currency: "₹",
    rating: 4.3,
    reviewCount: 57,
    compatibility: ["hyundai-creta-2026-sxo", "hyundai-creta-2025-sx", "kia-seltos-2026-gtxplus"],
    images: [
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1601574481104-ca1d64b7f535?q=80&w=1200&auto=format&fit=crop",
    ],
    description:
      "Aluminium roof rails with matte black powder coat. Adds utility and a rugged SUV stance.",
    features: ["Aluminium construction", "Matte black finish", "Load rated", "OEM mounting points"],
    inStock: true,
  },
  {
    id: "p11",
    slug: "infotainment-upgrade-android-auto",
    name: "Infotainment Upgrade",
    category: "Audio",
    categorySlug: "audio",
    price: 22999,
    currency: "₹",
    rating: 4.5,
    reviewCount: 95,
    compatibility: ["hyundai-creta-2025-sx", "kia-seltos-2026-gtxplus", "tata-harrier-2026-xzaplus"],
    images: [
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1200&auto=format&fit=crop",
    ],
    description:
      "Large-format touchscreen with wireless Apple CarPlay, Android Auto and 360-camera input support.",
    features: ["10.1-inch display", "Wireless CarPlay", "Android Auto", "360-camera input"],
    inStock: true,
  },
  {
    id: "p12",
    slug: "cold-air-intake-system",
    name: "Cold Air Intake System",
    category: "Performance",
    categorySlug: "performance",
    price: 18999,
    currency: "₹",
    rating: 4.7,
    reviewCount: 42,
    compatibility: ["hyundai-creta-2026-sxo", "kia-seltos-2026-gtxplus"],
    images: [
      "https://images.unsplash.com/photo-1527383418406-f85a3b146499?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1552656967-7a0991a13906?q=80&w=1200&auto=format&fit=crop",
    ],
    description:
      "High-flow intake with heat shield and reusable filter. Engineered for improved throttle response.",
    features: ["Mandrel-bent tubing", "Reusable filter", "Heat shield", "Bolt-on install"],
    inStock: true,
    badge: "Performance",
  },
];

export function getProductBySlug(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(categorySlug: string) {
  return products.filter((p) => p.categorySlug === categorySlug);
}

export function getCompatibleProducts(vehicleSlug: string) {
  return products.filter((p) => p.compatibility.includes(vehicleSlug));
}
