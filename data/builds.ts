import { Build } from "@/types";

export const builds: Build[] = [
  {
    id: "b1",
    slug: "stealth-edition-creta",
    title: "Stealth Edition",
    vehicle: "Hyundai Creta",
    year: 2026,
    image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=1600&auto=format&fit=crop",
    detailImages: [
      "https://images.unsplash.com/photo-1542377281-73d08e3a10aa?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1542282088-fe8426682b8f?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1549064233-945d7063292f?q=80&w=1200&auto=format&fit=crop",
    ],
    upgrades: [
      "Forged Alloy Wheels — V01",
      "Aero Body Kit",
      "LED Headlight Upgrade",
      "Ambient Interior Lighting Kit",
      "Carbon Fibre Mirror Caps",
      "Rear Spoiler — Gloss Black",
      "Performance Steering Wheel",
      "Ceramic Protection Kit",
      "Premium All-Weather Floor Mats",
      "Roof Rails — Black",
      "Cold Air Intake System",
      "Infotainment Upgrade",
    ],
    upgradeCount: 12,
    story:
      "A city-driven Creta transformed into a street-dominating SUV. The Stealth Edition pairs satin black wheels with gloss black accents and a full aero kit for a look that means business after dark.",
    location: "Bengaluru",
    beforeImage: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=1200&auto=format&fit=crop",
    afterImage: "https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "b2",
    slug: "ice-edition-seltos",
    title: "ICE Edition",
    vehicle: "Kia Seltos",
    year: 2026,
    image: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=1600&auto=format&fit=crop",
    detailImages: [
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=1200&auto=format&fit=crop",
    ],
    upgrades: [
      "Forged Alloy Wheels — V01",
      "LED Headlight Upgrade",
      "Ambient Interior Lighting Kit",
      "Premium All-Weather Floor Mats",
      "Infotainment Upgrade",
      "Ceramic Protection Kit",
      "Roof Rails — Black",
    ],
    upgradeCount: 7,
    story:
      "Built for the premium daily driver, the ICE Edition adds cyan ambient lighting, forged wheels and a crisp audio upgrade to make every commute feel like an event.",
    location: "Mumbai",
  },
  {
    id: "b3",
    slug: "redline-harrier",
    title: "Redline Harrier",
    vehicle: "Tata Harrier",
    year: 2026,
    image: "https://images.unsplash.com/photo-1549064233-945d7063292f?q=80&w=1600&auto=format&fit=crop",
    detailImages: [
      "https://images.unsplash.com/photo-1542282088-fe8426682b8f?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1527383418406-f85a3b146499?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1551522435-a13afa10f103?q=80&w=1200&auto=format&fit=crop",
    ],
    upgrades: [
      "Forged Alloy Wheels — V01",
      "Performance Steering Wheel",
      "Premium All-Weather Floor Mats",
      "Ceramic Protection Kit",
      "Cold Air Intake System",
    ],
    upgradeCount: 5,
    story:
      "The Redline Harrier pushes the SUV's road presence further with performance wheels, a sport steering wheel and protected paintwork ready for highway miles.",
    location: "Delhi",
  },
];

export function getBuildBySlug(slug: string) {
  return builds.find((b) => b.slug === slug);
}
