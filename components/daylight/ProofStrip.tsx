"use client";

import { useEffect, useState } from "react";
import { listStoreCategories, listStoreCollections, listStoreProducts } from "@/lib/medusa";
import { CountUp, Reveal } from "./fx";

/**
 * Proof strip — live counts from Medusa. Every figure is real data;
 * the strip stays empty until the backend answers.
 */
export function ProofStrip() {
  const [figures, setFigures] = useState<
    { value: number; label: string }[] | null
  >(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [products, collections, categories] = await Promise.all([
          listStoreProducts({ limit: 100 }).catch(() => [] as unknown[]),
          listStoreCollections().catch(() => [] as unknown[]),
          listStoreCategories().catch(() => [] as unknown[]),
        ]);
        if (cancelled) return;
        setFigures([
          { value: collections.length, label: "Curated brands" },
          { value: (products as unknown[]).length, label: "Live upgrades" },
          { value: (categories as unknown[]).length, label: "Collections" },
        ]);
      } catch (error) {
        console.error("[proof] failed to load live counts:", error);
        if (!cancelled) setFigures([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!figures || figures.every((f) => f.value === 0)) return null;

  return (
    <section className="relative bg-background">
      <div className="site-container grid grid-cols-1 gap-px overflow-hidden py-14 sm:grid-cols-3 md:py-20">
        {figures.map((fig, i) => (
          <Reveal key={fig.label} delay={i * 0.08}>
            <div className="flex flex-col items-center gap-2 text-center">
              <CountUp
                to={fig.value}
                suffix="+"
                className="font-display text-5xl font-bold tracking-tight text-ink md:text-6xl"
              />
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-red-deep">
                {fig.label}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
