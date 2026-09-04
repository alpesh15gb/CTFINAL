"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight, Check, Heart, Package, ShoppingBag, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Product } from "@/types";
import { useVehicle } from "@/hooks/useVehicle";
import { useCart } from "@/hooks/useCart";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  product: Product;
  featured?: boolean;
  wide?: boolean;
}

export function ProductCard({ product, featured = false, wide = false }: ProductCardProps) {
  const { selected } = useVehicle();
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const addedTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    return () => {
      if (addedTimer.current) clearTimeout(addedTimer.current);
    };
  }, []);

  const fits = selected
    ? product.compatibility.length === 0 ||
      product.compatibility.includes(selected.slug)
    : null;
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const handleAdd = () => {
    if (!product.inStock) return;

    addItem(product);
    setAdded(true);
    if (addedTimer.current) clearTimeout(addedTimer.current);
    addedTimer.current = setTimeout(() => setAdded(false), 1800);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      className={cn(
        "premium-card edge-highlight group flex h-full flex-col overflow-hidden rounded-sm",
        wide && "md:flex-row"
      )}
    >
      <div className={cn("relative shrink-0 overflow-hidden bg-surface", wide && "md:w-1/2")}>
        <Link
          href={`/products/${product.slug}`}
          className={cn(
            "relative block overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cyan",
            featured ? "aspect-[5/4] lg:aspect-[16/11]" : "aspect-[5/4]"
          )}
          aria-label={`View ${product.name}`}
        >
          {product.images[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes={
                featured
                  ? "(max-width: 1024px) 100vw, 50vw"
                  : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              }
              className="object-cover saturate-[0.82] transition duration-700 ease-out group-hover:scale-[1.035] group-hover:saturate-100"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-surface text-silver-muted">
              <Package className="h-10 w-10" aria-hidden="true" />
              <span className="font-mono text-[11px] uppercase tracking-[0.18em]">
                No image
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/5 to-black/15" />

          <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3">
            <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/70">
              CTZ / {product.id.slice(-4)}
            </span>
            <span className="flex h-11 w-11 items-center justify-center border border-white/20 bg-black/35 text-white backdrop-blur-md transition group-hover:border-cyan/60 group-hover:text-cyan">
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </span>
          </div>
        </Link>

        <div className="pointer-events-none absolute left-4 top-4 z-10 flex max-w-[calc(100%-5rem)] flex-wrap gap-2">
          {product.badge && (
            <Badge className="rounded-sm bg-foreground font-mono text-[10px] uppercase tracking-wider text-background hover:bg-foreground">
              {product.badge}
            </Badge>
          )}
          {discount && (
            <Badge className="rounded-sm bg-cyan font-mono text-[10px] uppercase tracking-wider text-black hover:bg-cyan">
              Save {discount}%
            </Badge>
          )}
          {fits !== null && (
            <Badge
              variant="outline"
              className={cn(
                "rounded-sm bg-black/45 font-mono text-[10px] uppercase tracking-wider backdrop-blur-md",
                fits ? "border-cyan/50 text-cyan" : "border-white/20 text-white/70"
              )}
            >
              {fits ? "Verified fit" : "Check fitment"}
            </Badge>
          )}
        </div>

        <button
          type="button"
          onClick={() => setWishlisted((value) => !value)}
          aria-label={wishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          aria-pressed={wishlisted}
          className={cn(
            "absolute right-4 top-4 z-10 flex h-11 w-11 cursor-pointer items-center justify-center border border-white/20 bg-black/45 text-white backdrop-blur-md transition hover:border-cyan hover:text-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan",
            wishlisted && "border-cyan bg-cyan text-black hover:text-black"
          )}
        >
          <Heart className={cn("h-4 w-4", wishlisted && "fill-current")} aria-hidden="true" />
        </button>
      </div>

      <div className={cn("flex flex-1 flex-col p-5 md:p-6", wide && "md:justify-center md:p-8")}>
        <div className="flex items-center justify-between gap-3">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-cyan">
            {product.category}
          </p>
          {product.reviewCount > 0 && (
            <div className="flex items-center gap-1.5 font-mono text-[11px] text-silver-muted">
              <Star className="h-3.5 w-3.5 fill-cyan text-cyan" aria-hidden="true" />
              <span className="text-foreground">{product.rating}</span>
              <span>/{product.reviewCount}</span>
            </div>
          )}
        </div>

        <Link
          href={`/products/${product.slug}`}
          className="mt-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan"
        >
          <h3
            className={cn(
              "font-display text-2xl font-semibold uppercase leading-[0.95] tracking-tight text-foreground transition-colors group-hover:text-cyan",
              featured && "md:text-4xl"
            )}
          >
            {product.name}
          </h3>
        </Link>

        <div className="mt-auto flex items-end justify-between gap-4 pt-7">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-silver-muted">
              Price / INR
            </p>
            <div className="mt-1 flex flex-wrap items-baseline gap-x-2">
              <span className="font-display text-2xl font-semibold text-foreground">
                {product.currency}{product.price.toLocaleString("en-IN")}
              </span>
              {product.originalPrice && (
                <span className="font-mono text-xs text-silver-muted line-through">
                  {product.currency}{product.originalPrice.toLocaleString("en-IN")}
                </span>
              )}
            </div>
          </div>
          <span
            className={cn(
              "flex items-center gap-2 whitespace-nowrap font-mono text-[10px] uppercase tracking-wider",
              product.inStock ? "text-green-400" : "text-silver-muted"
            )}
          >
            <span
              className={cn("h-1.5 w-1.5 rounded-full", product.inStock ? "bg-green-400" : "bg-silver-muted")}
              aria-hidden="true"
            />
            {product.inStock ? "In stock" : "Sold out"}
          </span>
        </div>

        <Button
          onClick={handleAdd}
          disabled={!product.inStock}
          variant={added ? "outline" : "default"}
          className="mt-5 w-full justify-between"
          aria-live="polite"
        >
          <span>{added ? "Added to garage" : product.inStock ? "Quick add" : "Unavailable"}</span>
          {added ? <Check className="h-4 w-4" aria-hidden="true" /> : <ShoppingBag className="h-4 w-4" aria-hidden="true" />}
        </Button>
      </div>
    </motion.article>
  );
}
