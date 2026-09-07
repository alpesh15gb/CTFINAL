export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  variant: string;
  slug: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  categorySlug: string;
  collectionId: string | null; // medusa collection (brand) id
  price: number;
  originalPrice?: number;
  currency: string;
  // Cheapest purchasable Medusa variant — required to build a store cart.
  // Null for legacy cached items; those must be re-added from the shop.
  variantId: string | null;
  // Human-readable spec of the selected variant (size / PCD / options).
  variantLabel?: string;
  rating: number;
  reviewCount: number;
  compatibility: string[]; // vehicle slugs
  images: string[];
  description: string;
  features: string[];
  inStock: boolean;
  badge?: string;
}

export interface Build {
  id: string;
  slug: string;
  title: string;
  vehicle: string;
  year: number;
  image: string;
  detailImages: string[];
  upgrades: string[];
  upgradeCount: number;
  story: string;
  location: string;
  beforeImage?: string;
  afterImage?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
