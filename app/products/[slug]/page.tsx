"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Check,
  Heart,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Star,
  Truck,
  Wrench,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { listStoreProducts } from "@/lib/medusa";
import {
  adaptStoreProduct,
  type MedusaStoreProduct,
} from "@/lib/store-adapter";
import type { Product } from "@/types";
import { useVehicle } from "@/hooks/useVehicle";
import { useCart } from "@/hooks/useCart";
import { ProductCard } from "@/components/product/ProductCard";
import { staggerContainer, fadeInUp } from "@/lib/animations";

export const dynamic = "force-dynamic";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : "";

  // Live catalog from Medusa (single fetch serves detail + related).
  const [catalog, setCatalog] = useState<Product[] | null>(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const raw = await listStoreProducts({ limit: 100 });
        if (!cancelled) {
          setCatalog((raw as MedusaStoreProduct[]).map(adaptStoreProduct));
        }
      } catch (error) {
        console.error("[product] failed to load live catalog:", error);
        if (!cancelled) setLoadError(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const product = catalog?.find((p) => p.slug === slug) ?? null;

  const { selected } = useVehicle();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  if (!loadError && catalog === null) {
    return (
      <main className="min-h-screen bg-background pb-24 pt-28">
        <div className="mx-auto max-w-[1600px] px-4 md:px-8">
          <div className="h-6 w-32 animate-pulse rounded bg-raised" />
          <div className="mt-6 grid gap-10 lg:grid-cols-2">
            <div className="aspect-square animate-pulse rounded-xl bg-raised" />
            <div className="space-y-4">
              <div className="h-10 w-3/4 animate-pulse rounded bg-raised" />
              <div className="h-6 w-1/3 animate-pulse rounded bg-raised" />
              <div className="h-24 w-full animate-pulse rounded bg-raised" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (loadError) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background pt-20">
        <div className="text-center">
          <h1 className="font-display text-4xl uppercase text-foreground">
            Store Unavailable
          </h1>
          <p className="mt-2 text-silver-muted">
            We couldn&apos;t reach the live catalog.
          </p>
          <Button asChild className="mt-6 bg-cyan text-black hover:bg-cyan-light">
            <Link href="/shop">Back to Shop</Link>
          </Button>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background pt-20">
        <div className="text-center">
          <h1 className="font-display text-4xl uppercase text-foreground">
            Product Not Found
          </h1>
          <Button asChild className="mt-6 bg-cyan text-black hover:bg-cyan-light">
            <Link href="/shop">Back to Shop</Link>
          </Button>
        </div>
      </main>
    );
  }

  const fits = selected
    ? product.compatibility.length === 0 ||
      product.compatibility.includes(selected.slug)
    : null;
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const related = (catalog ?? [])
    .filter(
      (p) =>
        p.categorySlug === product.categorySlug && p.id !== product.id
    )
    .slice(0, 3);

  const gallery = product.images;
  const activeSrc = gallery[Math.min(activeImage, gallery.length - 1)];

  const handleAdd = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product);
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <main className="min-h-screen bg-background pb-24 pt-28">
      <div className="mx-auto max-w-[1600px] px-4 md:px-8">
        <Link
          href="/shop"
          className="mb-6 inline-flex items-center gap-2 text-sm text-silver-muted transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to shop
        </Link>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="grid gap-10 lg:grid-cols-2"
        >
          {/* Gallery */}
          <motion.div variants={fadeInUp} className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-xl border border-border bg-raised">
              {activeSrc ? (
                <Image
                  src={activeSrc}
                  alt={product.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-silver-muted">
                  <Wrench className="h-10 w-10" aria-hidden="true" />
                  <span className="font-mono text-xs uppercase tracking-[0.2em]">
                    No image
                  </span>
                </div>
              )}
              {product.badge && (
                <Badge className="absolute left-4 top-4 bg-red text-white">
                  {product.badge}
                </Badge>
              )}
            </div>
            <div className="flex gap-3">
              {gallery.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`relative h-20 w-20 overflow-hidden rounded-md border ${
                    activeImage === idx
                      ? "border-cyan-deep"
                      : "border-border hover:border-silver"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.name} view ${idx + 1}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Details */}
          <motion.div variants={fadeInUp} className="space-y-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-deep">
                {product.category}
              </p>
              <h1 className="mt-2 font-display text-4xl font-bold uppercase leading-tight text-foreground md:text-5xl">
                {product.name}
              </h1>
              <div className="mt-3 flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-cyan text-cyan-deep" />
                  <span className="text-sm font-medium text-foreground">
                    {product.rating}
                  </span>
                </div>
                <span className="text-sm text-silver-muted">
                  ({product.reviewCount} reviews)
                </span>
              </div>
            </div>

            {/* Fitment */}
            <div
              className={`rounded-lg border p-4 ${
                fits === true
                  ? "border-cyan-deep/40 bg-cyan/10"
                  : fits === false
                  ? "border-red/40 bg-red/10"
                  : "border-border bg-raised"
              }`}
            >
              <div className="flex items-start gap-3">
                {fits === true ? (
                  <Check className="h-5 w-5 text-cyan-deep" />
                ) : fits === false ? (
                  <X className="h-5 w-5 text-red" />
                ) : (
                  <Wrench className="h-5 w-5 text-silver-muted" />
                )}
                <div>
                  <p className="font-medium text-foreground">
                    {fits === true
                      ? `Fits your ${selected?.brand} ${selected?.model}`
                      : fits === false
                      ? "May not fit your vehicle"
                      : "Check vehicle compatibility"}
                  </p>
                  <p className="text-sm text-silver-muted">
                    {selected
                      ? `${selected.year} ${selected.brand} ${selected.model} ${selected.variant}`
                      : "Select your car on the homepage to confirm fitment."}
                  </p>
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="font-display text-4xl font-semibold text-foreground">
                {product.currency}
                {product.price.toLocaleString("en-IN")}
              </span>
              {product.originalPrice && (
                <span className="text-xl text-silver-muted line-through">
                  {product.currency}
                  {product.originalPrice.toLocaleString("en-IN")}
                </span>
              )}
              {discount && (
                <Badge className="bg-cyan text-black">-{discount}%</Badge>
              )}
            </div>

            <p className="leading-relaxed text-silver-muted">
              {product.description}
            </p>

            {/* Quantity + Add */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center rounded-md border border-border bg-raised">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="flex h-11 w-11 items-center justify-center text-foreground hover:text-cyan-deep"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-10 text-center font-medium text-foreground">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="flex h-11 w-11 items-center justify-center text-foreground hover:text-cyan-deep"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <Button
                size="lg"
                onClick={handleAdd}
                className={`flex-1 gap-2 text-base uppercase tracking-wider ${
                  added
                    ? "bg-green-600 text-white hover:bg-green-600"
                    : "bg-cyan text-black hover:bg-cyan-light"
                }`}
              >
                {added ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <ShoppingBag className="h-5 w-5" />
                )}
                {added ? "Added to Cart" : "Add to Cart"}
              </Button>

              <Button
                size="icon"
                variant="outline"
                className="h-12 w-12 border-border bg-transparent text-foreground hover:border-cyan-deep hover:text-cyan-deep"
              >
                <Heart className="h-5 w-5" />
              </Button>
            </div>

            <Separator className="bg-border" />

            {/* Features */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-foreground">
                What&apos;s Included
              </h3>
              <ul className="grid gap-2 sm:grid-cols-2">
                {product.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2 text-sm text-silver-muted"
                  >
                    <Check className="h-3.5 w-3.5 text-cyan-deep" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-silver-muted">
              <span className="inline-flex items-center gap-2">
                <Truck className="h-4 w-4 text-cyan-deep" /> Free shipping over ₹5,000
              </span>
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-cyan-deep" /> 2-year warranty
              </span>
            </div>
          </motion.div>
        </motion.div>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-24">
            <h2 className="mb-8 font-display text-3xl uppercase text-foreground">
              Related Products
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
