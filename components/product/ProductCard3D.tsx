"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Check, Heart, ShoppingBag, Star, Sparkles, ShieldCheck, Gauge } from "lucide-react";
import { cn } from "@/lib/utils";
import { Product } from "@/types";
import { useVehicle } from "@/hooks/useVehicle";
import { useCart } from "@/hooks/useCart";
import { useTilt3D } from "@/hooks/useTilt3D";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ProductCard3DProps {
  product: Product;
  featured?: boolean;
  wide?: boolean;
}

export function ProductCard3D({ product, featured = false, wide = false }: ProductCard3DProps) {
  const { selected } = useVehicle();
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [showSpecDrawer, setShowSpecDrawer] = useState(false);
  const addedTimer = useRef<ReturnType<typeof setTimeout>>();

  const tilt = useTilt3D({ maxTilt: 8, scale: 1.02 });

  useEffect(() => {
    return () => {
      if (addedTimer.current) clearTimeout(addedTimer.current);
    };
  }, []);

  const fits = selected ? product.compatibility.includes(selected.slug) : null;
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.inStock) return;

    addItem(product);
    setAdded(true);
    if (addedTimer.current) clearTimeout(addedTimer.current);
    addedTimer.current = setTimeout(() => setAdded(false), 2000);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        ref={tilt.ref}
        onMouseMove={tilt.handleMouseMove}
        onMouseLeave={tilt.handleMouseLeave}
        className={cn(
          "group relative flex h-full flex-col overflow-hidden rounded-sm border border-white/10 bg-surface transition-all duration-500 hover:border-cyan/40 hover:shadow-[0_0_30px_rgba(49,207,255,0.12)]",
          wide && "md:flex-row",
          featured && "border-cyan/30"
        )}
        style={{
          perspective: 1000,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Visual Header / Image Container */}
        <div className={cn("relative shrink-0 overflow-hidden bg-raised", wide ? "md:w-1/2" : "aspect-square")}>
          <Link href={`/products/${product.slug}`} className="block h-full w-full">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            {/* Subtle Gradient Shadow */}
            <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent opacity-80" />
          </Link>

          {/* Top Badges */}
          <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
            {product.badge && (
              <Badge className="bg-cyan/90 font-mono text-[10px] text-black">
                {product.badge}
              </Badge>
            )}
            {discount && (
              <Badge variant="destructive" className="font-mono text-[10px]">
                -{discount}%
              </Badge>
            )}
            {fits !== null && (
              <Badge
                variant="outline"
                className={cn(
                  "font-mono text-[10px] backdrop-blur-md",
                  fits
                    ? "border-green-500/40 bg-green-950/40 text-green-400"
                    : "border-red-500/40 bg-red-950/40 text-red-400"
                )}
              >
                {fits ? "Fits Your Ride" : "Universal Fit"}
              </Badge>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setWishlisted(!wishlisted);
            }}
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-sm border border-white/10 bg-background/80 text-silver-muted backdrop-blur-md transition-colors hover:text-foreground"
          >
            <Heart className={cn("h-4 w-4", wishlisted && "fill-hyperRed text-hyperRed")} />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex flex-1 flex-col justify-between p-5">
          <div className="space-y-2">
            <div className="flex items-center justify-between font-mono text-[10px] text-silver-muted">
              <span className="uppercase tracking-widest">{product.category}</span>
              {product.rating && (
                <div className="flex items-center gap-1 text-amber">
                  <Star className="h-3 w-3 fill-amber" />
                  <span>{product.rating.toFixed(1)}</span>
                </div>
              )}
            </div>

            <Link href={`/products/${product.slug}`} className="group-hover:text-cyan transition-colors">
              <h3 className="font-display text-lg font-bold uppercase leading-snug tracking-wide text-foreground">
                {product.name}
              </h3>
            </Link>

            {product.features && product.features.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {product.features.slice(0, 3).map((feat, idx) => (
                  <span
                    key={idx}
                    className="rounded-xs border border-white/5 bg-raised px-2 py-0.5 font-mono text-[10px] text-silver-muted"
                  >
                    <strong className="text-foreground">{feat}</strong>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Pricing & CTA Row */}
          <div className="mt-5 flex items-center justify-between border-t border-white/5 pt-4">
            <div>
              <span className="font-mono text-[9px] uppercase tracking-wider text-silver-muted">Price / Unit</span>
              <div className="flex items-baseline gap-2">
                <span className="font-display text-xl font-bold uppercase text-foreground">
                  ₹{product.price.toLocaleString("en-IN")}
                </span>
                {product.originalPrice && (
                  <span className="font-mono text-xs text-silver-muted line-through">
                    ₹{product.originalPrice.toLocaleString("en-IN")}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                onClick={handleAdd}
                disabled={!product.inStock}
                size="sm"
                className="gap-1.5 font-mono text-xs"
              >
                {added ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-black" />
                    <span>Added</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="h-3.5 w-3.5" />
                    <span>Add to Spec</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
