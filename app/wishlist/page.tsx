"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Heart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product/ProductCard";
import { useWishlist } from "@/hooks/useWishlist";
import { getProducts } from "@/lib/medusa";
import type { Product } from "@/types";

export default function WishlistPage() {
  const { ids, syncing } = useWishlist();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    void getProducts({ limit: 100 }).then((catalog) => {
      if (!active) return;
      setProducts(catalog);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  const saved = useMemo(() => products.filter((product) => ids.includes(product.id)), [products, ids]);

  return (
    <main className="min-h-screen bg-background pb-24 pt-28">
      <div className="mx-auto max-w-[1600px] px-4 md:px-8">
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan">Saved Products</p>
          <h1 className="mt-2 font-display text-5xl font-bold uppercase text-foreground">Wishlist</h1>
          <p className="mt-3 max-w-xl text-silver-muted">Saved locally for guests and synchronized to Medusa customer metadata after sign in.</p>
        </div>

        {loading ? (
          <div className="flex items-center gap-3 text-silver-muted"><Loader2 className="h-5 w-5 animate-spin text-cyan" /> Loading Medusa products…</div>
        ) : saved.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-raised py-20 text-center">
            <Heart className="h-12 w-12 text-silver-muted" />
            <h2 className="mt-4 font-display text-2xl uppercase text-foreground">Your wishlist is empty</h2>
            <p className="mt-2 text-silver-muted">Tap the heart on a product to save it.</p>
            <Button asChild className="mt-6 bg-cyan text-black hover:bg-cyan-light"><Link href="/shop">Browse Products</Link></Button>
          </div>
        ) : (
          <><div className="mb-4 text-sm text-silver-muted">{saved.length} saved product{saved.length === 1 ? "" : "s"}{syncing ? " · syncing…" : ""}</div><div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{saved.map((product) => <ProductCard key={product.id} product={product} />)}</div></>
        )}
      </div>
    </main>
  );
}
