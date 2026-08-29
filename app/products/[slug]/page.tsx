"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, Check, Heart, Minus, Plus, ShieldCheck, ShoppingBag, Star, Truck, Wrench, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getProductBySlug, getProducts } from "@/lib/medusa";
import { useVehicle } from "@/hooks/useVehicle";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { ProductCard } from "@/components/product/ProductCard";
import type { Product } from "@/types";
import { staggerContainer, fadeInUp } from "@/lib/animations";

export const dynamic = "force-dynamic";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : "";
  const { selected } = useVehicle();
  const { addItem, loading: cartLoading, error: cartError } = useCart();
  const { isWishlisted, toggle } = useWishlist();
  const [product, setProduct] = useState<Product | null>(null);
  const [catalog, setCatalog] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    if (!slug) return;
    let active = true;
    setLoading(true);
    setActiveImage(0);
    void Promise.all([getProductBySlug(slug), getProducts({ limit: 100 })]).then(([found, products]) => {
      if (!active) return;
      setProduct(found);
      setCatalog(products);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [slug]);

  const related = useMemo(() => {
    if (!product) return [];
    return catalog.filter((item) => item.categorySlug === product.categorySlug && item.id !== product.id).slice(0, 3);
  }, [catalog, product]);

  if (loading) {
    return (
      <main className="min-h-screen bg-background pb-24 pt-28">
        <div className="mx-auto grid max-w-[1600px] gap-10 px-4 md:px-8 lg:grid-cols-2">
          <div className="aspect-square animate-pulse rounded-xl bg-raised" />
          <div className="space-y-5 pt-8"><div className="h-5 w-28 animate-pulse rounded bg-raised" /><div className="h-20 animate-pulse rounded bg-raised" /><div className="h-12 w-48 animate-pulse rounded bg-raised" /><div className="h-32 animate-pulse rounded bg-raised" /></div>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background pt-20">
        <div className="text-center">
          <h1 className="font-display text-4xl uppercase text-foreground">Product Not Found</h1>
          <p className="mt-2 text-silver-muted">This product is no longer available in the Medusa catalog.</p>
          <Button asChild className="mt-6 bg-cyan text-black hover:bg-cyan-light"><Link href="/shop">Back to Shop</Link></Button>
        </div>
      </main>
    );
  }

  const fits = selected ? product.compatibility.includes(selected.slug) : null;
  const wishlisted = isWishlisted(product.id);
  const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : null;

  const handleAdd = async () => {
    const ok = await addItem(product, quantity);
    if (ok) {
      setAdded(true);
      window.setTimeout(() => setAdded(false), 1800);
    }
  };

  return (
    <main className="min-h-screen bg-background pb-24 pt-28">
      <div className="mx-auto max-w-[1600px] px-4 md:px-8">
        <Link href="/shop" className="mb-6 inline-flex items-center gap-2 text-sm text-silver-muted transition-colors hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Back to shop</Link>

        <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="grid gap-10 lg:grid-cols-2">
          <motion.div variants={fadeInUp} className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-xl border border-border bg-raised">
              <Image src={product.images[activeImage] || product.images[0]} alt={product.name} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" priority />
              {product.badge && <Badge className="absolute left-4 top-4 bg-red text-white">{product.badge}</Badge>}
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {product.images.map((image, index) => (
                  <button key={`${image}-${index}`} onClick={() => setActiveImage(index)} className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-md border ${activeImage === index ? "border-cyan" : "border-border hover:border-silver"}`}>
                    <Image src={image} alt={`${product.name} view ${index + 1}`} fill className="object-cover" sizes="80px" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div variants={fadeInUp} className="space-y-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan">{product.category}</p>
              <h1 className="mt-2 font-display text-4xl font-bold uppercase leading-tight text-foreground md:text-5xl">{product.name}</h1>
              <div className="mt-3 flex items-center gap-3">
                <div className="flex items-center gap-1"><Star className="h-4 w-4 fill-cyan text-cyan" /><span className="text-sm font-medium text-foreground">{product.rating || "New"}</span></div>
                {product.reviewCount > 0 && <span className="text-sm text-silver-muted">({product.reviewCount} reviews)</span>}
              </div>
            </div>

            <div className={`rounded-lg border p-4 ${fits === true ? "border-cyan/40 bg-cyan/10" : fits === false ? "border-red/40 bg-red/10" : "border-border bg-raised"}`}>
              <div className="flex items-start gap-3">
                {fits === true ? <Check className="h-5 w-5 text-cyan" /> : fits === false ? <X className="h-5 w-5 text-red" /> : <Wrench className="h-5 w-5 text-silver-muted" />}
                <div>
                  <p className="font-medium text-foreground">{fits === true ? `Fits your ${selected?.brand} ${selected?.model}` : fits === false ? "May not fit your vehicle" : "Check vehicle compatibility"}</p>
                  <p className="text-sm text-silver-muted">{selected ? `${selected.year} ${selected.brand} ${selected.model} ${selected.variant}` : product.compatibility.length ? "Select your car on the homepage to confirm fitment." : "Fitment information can be managed in Medusa product metadata."}</p>
                </div>
              </div>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="font-display text-4xl font-semibold text-foreground">{product.currency}{product.price.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</span>
              {product.originalPrice && <span className="text-xl text-silver-muted line-through">{product.currency}{product.originalPrice.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</span>}
              {discount ? <Badge className="bg-cyan text-black">-{discount}%</Badge> : null}
            </div>

            <p className="leading-relaxed text-silver-muted">{product.description || "Product details are managed from Medusa Admin."}</p>

            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center rounded-md border border-border bg-raised">
                <button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))} className="flex h-11 w-11 items-center justify-center text-foreground hover:text-cyan"><Minus className="h-4 w-4" /></button>
                <span className="w-10 text-center font-medium text-foreground">{quantity}</span>
                <button type="button" onClick={() => setQuantity((value) => value + 1)} className="flex h-11 w-11 items-center justify-center text-foreground hover:text-cyan"><Plus className="h-4 w-4" /></button>
              </div>

              <Button size="lg" onClick={handleAdd} disabled={!product.inStock || !product.variantId || cartLoading} className={`flex-1 gap-2 text-base uppercase tracking-wider ${added ? "bg-green-600 text-white hover:bg-green-600" : "bg-cyan text-black hover:bg-cyan-light"}`}>
                {added ? <Check className="h-5 w-5" /> : <ShoppingBag className="h-5 w-5" />}
                {!product.inStock ? "Out of Stock" : added ? "Added to Cart" : "Add to Cart"}
              </Button>

              <Button size="icon" variant="outline" onClick={() => void toggle(product.id)} aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"} className={`h-12 w-12 border-border bg-transparent hover:border-cyan hover:text-cyan ${wishlisted ? "text-red" : "text-foreground"}`}>
                <Heart className={`h-5 w-5 ${wishlisted ? "fill-current" : ""}`} />
              </Button>
            </div>
            {cartError && <p className="text-sm text-red">{cartError}</p>}

            <Separator className="bg-border" />

            {product.features.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-foreground">What&apos;s Included</h3>
                <ul className="grid gap-2 sm:grid-cols-2">
                  {product.features.map((feature) => <li key={feature} className="flex items-center gap-2 text-sm text-silver-muted"><Check className="h-3.5 w-3.5 text-cyan" />{feature}</li>)}
                </ul>
              </div>
            )}

            <div className="flex flex-wrap gap-4 text-sm text-silver-muted">
              <span className="inline-flex items-center gap-2"><Truck className="h-4 w-4 text-cyan" /> Shipping calculated by Medusa at checkout</span>
              <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-cyan" /> Secure cart session</span>
            </div>
          </motion.div>
        </motion.div>

        {related.length > 0 && (
          <section className="mt-24">
            <h2 className="mb-8 font-display text-3xl uppercase text-foreground">Related Products</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{related.map((item) => <ProductCard key={item.id} product={item} />)}</div>
          </section>
        )}
      </div>
    </main>
  );
}
