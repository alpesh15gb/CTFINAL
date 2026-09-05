"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import type { Product } from "@/types";
import { listStoreProducts } from "@/lib/medusa";
import {
  adaptStoreProduct,
  type MedusaStoreProduct,
} from "@/lib/store-adapter";
import { MaskLines, Reveal } from "./fx";

/**
 * Shop preview — live Medusa products in the existing ProductCard.
 * Stays hidden until the backend answers (never placeholder stock).
 */
export function ShopPreview() {
  const [items, setItems] = useState<Product[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    listStoreProducts({ limit: 4 })
      .then((raw) => {
        if (!cancelled) {
          setItems((raw as MedusaStoreProduct[]).map(adaptStoreProduct));
        }
      })
      .catch((error) => {
        console.error("[shop-preview] failed to load live products:", error);
        if (!cancelled) setItems([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (items !== null && items.length === 0) return null;

  return (
    <section className="relative bg-surface py-24 md:py-36">
      <div className="site-container">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <Reveal>
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-red-deep">
                04 / Fresh stock
              </p>
            </Reveal>
            <MaskLines
              className="font-display mt-4 text-5xl font-bold uppercase leading-[0.9] tracking-tight text-ink md:text-8xl"
              lines={["Straight off", "the lift."]}
            />
          </div>
          <Reveal delay={0.15}>
            <Link
              href="/shop"
              className="inline-flex min-h-12 items-center gap-2 rounded-sm bg-ink px-6 font-mono text-xs font-bold uppercase tracking-[0.16em] text-paper transition hover:bg-red"
            >
              Explore all <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 md:mt-16">
          {items
            ? items.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            : [0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-[420px] animate-pulse rounded-sm bg-raised"
                />
              ))}
        </div>
      </div>
    </section>
  );
}
