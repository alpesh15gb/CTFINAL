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
  variantId: string;
  slug: string;
  name: string;
  category: string;
  categorySlug: string;
  price: number;
  originalPrice?: number;
  currency: string;
  currencyCode: string;
  rating: number;
  reviewCount: number;
  compatibility: string[];
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
  id: string;
  product: Product;
  quantity: number;
}

export interface StoreCustomer {
  id: string;
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  phone?: string | null;
  metadata?: Record<string, unknown> | null;
}

export interface StoreOrder {
  id: string;
  display_id: number;
  status?: string;
  fulfillment_status?: string;
  payment_status?: string;
  total: number;
  currency_code: string;
  created_at: string;
}
