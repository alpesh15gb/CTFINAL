"use client";

import { useState, type MouseEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Star, Check, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";
import { useVehicle } from "@/hooks/useVehicle";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  product: Product;
  featured?: boolean;
  wide?: boolean;
}

export function ProductCard({ product, featured = false, wide = false }: ProductCardProps) {
  const { selected } = useVehicle();
  const { addItem, loading: cartLoading } = useCart();
  const { isWishlisted, toggle } = useWishlist();
  const [added, setAdded] = useState(false);
  const [addFailed, setAddFailed] = useState(false);

  const wishlisted = isWishlisted(product.id);
  const fits = selected ? product.compatibility.includes(selected.slug) : null;
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const handleAdd = async (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (!product.inStock || !product.variantId) return;

    const ok = await addItem(product);
    setAddFailed(!ok);
    if (ok) {
      setAdded(true);
      window.setTimeout(() => setAdded(false), 1800);
    }
  };

  const handleWishlist = async (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    await toggle(product.id);
  };

  const quickAddLabel = !product.inStock
    ? "Out of stock"
    : addFailed
      ? "Try again"
      : added
        ? "Added"
        : "Quick Add";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-lg border border-border bg-raised transition-colors hover:border-cyan/40",
        wide && "md:flex-row"
      )}
    >
      <div
        className={cn(
          "relative overflow-hidden bg-surface",
          featured ? "aspect-[4/3]" : "aspect-square",
          wide && "md:w-1/2"
        )}
      >
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes={featured ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 50vw, 25vw"}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-raised/80 via-transparent to-transparent opacity-60" />
        <Link href={`/products/${product.slug}`} className="absolute inset-0 z-10" aria-label={`View ${product.name}`} />

        <div className="pointer-events-none absolute left-3 top-3 z-20 flex flex-wrap gap-2">
          {product.badge && <Badge className="bg-red text-xs text-white hover:bg-red-light">{product.badge}</Badge>}
          {discount ? <Badge className="bg-cyan text-xs text-black hover:bg-cyan-light">-{discount}%</Badge> : null}
          {fits === true && <Badge variant="outline" className="border-cyan/50 text-cyan">Fits your car</Badge>}
          {fits === false && <Badge variant="outline" className="border-silver/30 text-silver-muted">Check fitment</Badge>}
        </div>

        <button
          type="button"
          onClick={handleWishlist}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className={cn(
            "absolute right-3 top-3 z-30 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-raised/80 text-silver backdrop-blur transition-all hover:border-cyan hover:text-cyan focus-visible:ring-2 focus-visible:ring-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-raised",
            wishlisted && "border-red text-red hover:border-red-light hover:text-red-light"
          )}
        >
          <Heart className={cn("h-4 w-4", wishlisted && "fill-current")} />
        </button>

        <div className="absolute inset-x-0 bottom-0 z-30 hidden translate-y-full items-center justify-between p-4 transition-transform duration-300 group-hover:translate-y-0 group-focus-within:translate-y-0 md:flex">
          <Button
            size="sm"
            onClick={handleAdd}
            disabled={!product.inStock || cartLoading}
            className={cn(
              "gap-2 text-xs uppercase tracking-wider",
              added ? "bg-green-600 text-white" : "bg-cyan text-black hover:bg-cyan-light"
            )}
          >
            {added ? <Check className="h-3.5 w-3.5" /> : <ShoppingBag className="h-3.5 w-3.5" />}
            {quickAddLabel}
          </Button>
          <Link href={`/products/${product.slug}`} className="text-xs font-medium uppercase tracking-wider text-foreground hover:text-cyan">
            View Details <ArrowRight className="ml-1 inline h-3 w-3" />
          </Link>
        </div>
      </div>

      <div className={cn("flex flex-1 flex-col p-4", wide && "md:justify-center md:p-8")}>
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-silver-muted">{product.category}</p>
        <Link href={`/products/${product.slug}`}>
          <h3 className="mt-1 font-display text-xl font-semibold uppercase leading-tight text-foreground transition-colors group-hover:text-cyan md:text-2xl">
            {product.name}
          </h3>
        </Link>

        <div className="mt-2 flex items-center gap-2 text-xs text-silver-muted">
          <Star className="h-3.5 w-3.5 fill-cyan text-cyan" />
          <span className="text-foreground">{product.rating || "New"}</span>
          {product.reviewCount > 0 && <span>({product.reviewCount})</span>}
        </div>

        <div className="mt-auto flex items-center justify-between pt-4">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-xl font-semibold text-foreground">
              {product.currency}{product.price.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-silver-muted line-through">
                {product.currency}{product.originalPrice.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
              </span>
            )}
          </div>
          <span className={cn("text-[10px] font-medium uppercase tracking-wider", product.inStock ? "text-green-400" : "text-silver-muted")}>
            {product.inStock ? "In Stock" : "Out of Stock"}
          </span>
        </div>

        <Button
          size="sm"
          onClick={handleAdd}
          disabled={!product.inStock || cartLoading}
          className={cn("mt-3 w-full gap-2 md:hidden", added ? "bg-green-600 text-white" : "bg-cyan text-black hover:bg-cyan-light")}
        >
          {added ? <Check className="h-3.5 w-3.5" /> : <ShoppingBag className="h-3.5 w-3.5" />}
          {quickAddLabel}
        </Button>
      </div>
    </motion.div>
  );
}
