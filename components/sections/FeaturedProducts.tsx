"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, PackageSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product/ProductCard";
import { useVehicle } from "@/hooks/useVehicle";
import { getProducts } from "@/lib/medusa";
import type { Product } from "@/types";
import { staggerContainer, fadeInUp } from "@/lib/animations";

export function FeaturedProducts() {
  const { selected } = useVehicle();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    void getProducts({ limit: 5 }).then((result) => {
      if (!active) return;
      setProducts(result);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  const heading = selected
    ? `Upgrades for your ${selected.brand} ${selected.model}`
    : "Engineered to fit.";

  const featured = products[0];
  const secondary = products.slice(1, 5);

  return (
    <section className="relative z-20 bg-background py-24 md:py-32">
      <div className="mx-auto max-w-[1600px] px-4 md:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end"
        >
          <div className="max-w-2xl">
            <motion.span variants={fadeInUp} className="mb-3 inline-block text-xs font-semibold uppercase tracking-[0.25em] text-cyan">
              03 / Featured Products
            </motion.span>
            <motion.h2 variants={fadeInUp} className="font-display text-5xl font-bold uppercase leading-[0.9] tracking-tight text-foreground md:text-7xl">
              {heading}
            </motion.h2>
            <motion.p variants={fadeInUp} className="mt-4 text-lg text-silver-muted">
              Live products from the Cartunez catalog, with pricing and stock managed in Medusa.
            </motion.p>
          </div>

          <motion.div variants={fadeInUp}>
            <Button asChild variant="outline" className="border-border bg-transparent text-foreground hover:border-cyan hover:text-cyan">
              <Link href="/shop" className="gap-2">
                Shop All <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="aspect-[4/3] animate-pulse rounded-lg border border-border bg-raised lg:col-span-2 lg:row-span-2" />
            {[0, 1, 2, 3].map((item) => (
              <div key={item} className="aspect-square animate-pulse rounded-lg border border-border bg-raised" />
            ))}
          </div>
        ) : !featured ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-raised px-6 py-16 text-center">
            <PackageSearch className="h-10 w-10 text-cyan" />
            <h3 className="mt-4 font-display text-2xl uppercase text-foreground">Catalog is ready for products</h3>
            <p className="mt-2 max-w-lg text-silver-muted">
              Add and publish products in Medusa Admin and they will appear here automatically.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="lg:col-span-2 lg:row-span-2">
              <ProductCard product={featured} featured />
            </div>
            {secondary.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
