"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { FilmGrain, MaskText, SectionLabel } from "./primitives";
import { listStoreCollections, listStoreProducts } from "@/lib/medusa";
import {
  adaptStoreProduct,
  type MedusaStoreCollection,
  type MedusaStoreProduct,
} from "@/lib/store-adapter";

interface Brand {
  id: string;
  title: string;
  handle: string;
  count: number;
}

/** GET YOUR CAR ROLLING IN STYLE — live brand cards from Medusa collections. */
export function NumbersLightning() {
  return (
    <section className="relative overflow-hidden bg-[#020202] py-28 md:py-44">
      <div className="site-container relative">
        <SectionLabel>Cartunez / Brands</SectionLabel>
        <MaskText
          className="campaign-title mt-6 text-[clamp(4.5rem,10vw,11rem)]"
          lines={["Get your car", <span key="w" className="text-white/85">rolling in</span>, "style!"]}
        />
        <BrandGrid />
      </div>
      <FilmGrain />
    </section>
  );
}

function BrandGrid() {
  const [brands, setBrands] = useState<Brand[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [rawCollections, rawProducts] = await Promise.all([
          listStoreCollections().catch(() => [] as unknown[]),
          listStoreProducts({ limit: 100 }).catch(() => [] as unknown[]),
        ]);
        if (cancelled) return;
        const counts = new Map<string, number>();
        for (const raw of rawProducts as MedusaStoreProduct[]) {
          const cid = adaptStoreProduct(raw).collectionId;
          if (cid) counts.set(cid, (counts.get(cid) ?? 0) + 1);
        }
        setBrands(
          (rawCollections as MedusaStoreCollection[]).map((c) => ({
            id: c.id,
            title: c.title,
            handle: c.handle,
            count: counts.get(c.id) ?? 0,
          }))
        );
      } catch (error) {
        console.error("[brands] failed to load live collections:", error);
        if (!cancelled) setBrands([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // No collections in Medusa — show nothing rather than fake brands.
  if (brands !== null && brands.length === 0) return null;

  if (brands === null) {
    return (
      <div className="mt-16 grid grid-cols-2 border-t border-white/10 md:mt-24 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-44 animate-pulse border-b border-r border-white/10 last:border-r-0 md:h-56"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="mt-16 grid grid-cols-2 border-t border-white/10 md:mt-24 lg:grid-cols-4">
      {brands.map((brand, i) => (
        <Link
          key={brand.id}
          href={`/shop?collection=${brand.handle}`}
          className="group border-b border-r border-white/10 px-6 py-8 transition-colors last:border-r-0 hover:border-cyan/40 hover:bg-white/[0.02] md:py-12 lg:px-10 [&:nth-child(2)]:border-r-0 lg:[&:nth-child(2)]:border-r"
        >
          <p className="font-mono text-[10px] tracking-[0.3em] text-white/40 transition-colors group-hover:text-cyan">
            / {String(i + 1).padStart(2, "0")}
          </p>
          <h3 className="campaign-title mt-4 block text-[clamp(1.8rem,3.5vw,3.2rem)] uppercase leading-none transition-colors group-hover:text-cyan">
            {brand.title}
          </h3>
          <p className="mt-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-white/50">
            {brand.count} product{brand.count !== 1 ? "s" : ""}
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-cyan" />
          </p>
        </Link>
      ))}
    </div>
  );
}
