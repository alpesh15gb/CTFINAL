"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { listStoreCollections } from "@/lib/medusa";
import type { MedusaStoreCollection } from "@/lib/store-adapter";
import { Marquee } from "./fx";

/**
 * Brand ticker — live Medusa collections scrolling on an ink ribbon.
 * Nothing to show until the backend answers (no placeholder brands).
 */
export function BrandTicker() {
  const [brands, setBrands] = useState<MedusaStoreCollection[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    listStoreCollections()
      .then((raw) => {
        if (!cancelled) setBrands(raw as MedusaStoreCollection[]);
      })
      .catch((error) => {
        console.error("[ticker] failed to load live collections:", error);
        if (!cancelled) setBrands([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!brands || brands.length === 0) return null;

  return (
    <div className="relative z-10 border-y border-ink bg-ink py-4 text-paper">
      <Marquee duration={36}>
        {brands.map((brand) => (
          <Link
            key={brand.id}
            href={`/shop?collection=${brand.handle}`}
            className="mx-7 flex items-center gap-7 whitespace-nowrap font-display text-sm font-bold uppercase tracking-[0.14em] transition-colors hover:text-red-light"
          >
            {brand.title}
            <span
              aria-hidden
              className="inline-block h-2 w-2 rotate-45 bg-red"
            />
          </Link>
        ))}
      </Marquee>
    </div>
  );
}
