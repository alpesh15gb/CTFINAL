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

  const featured = products[0];
  const secondary = products.slice(1, 5);

  return (
    <section className="section-space precision-grid relative z-20 overflow-hidden bg-background">
      <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-cyan/35 to-transparent" />
      <div className="site-container relative">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="mb-12 grid items-end gap-8 lg:mb-16 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <motion.p variants={fadeInUp} className="technical-label">03 / Curated performance</motion.p>
            <motion.h2 variants={fadeInUp} className="mt-6 max-w-5xl font-display text-5xl font-bold uppercase leading-[0.84] tracking-[-0.035em] text-foreground sm:text-6xl md:text-8xl">
              {selected ? <>Built for your<span className="display-outline block">{selected.brand} {selected.model}</span></> : <>Parts with<span className="display-outline block">purpose.</span></>}
            </motion.h2>
          </div>
          <motion.div variants={fadeInUp} className="lg:col-span-4 lg:pb-2">
            <p className="max-w-md text-base leading-relaxed text-silver-muted md:text-lg">Considered upgrades for stance, sound, cabin and response—selected for finish, fit and everyday drivability.</p>
            <Button asChild variant="outline" className="mt-6"><Link href="/shop" className="gap-3">Explore all upgrades <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link></Button>
          </motion.div>
        </motion.div>

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 lg:gap-5">
            <div className="aspect-[5/4] animate-pulse rounded-sm border border-border bg-raised md:col-span-2 lg:row-span-2" />
            {[0, 1, 2, 3].map((item) => <div key={item} className="aspect-[5/4] animate-pulse rounded-sm border border-border bg-raised" />)}
          </div>
        ) : !featured ? (
          <div className="glass-panel flex flex-col items-center justify-center px-6 py-16 text-center"><PackageSearch className="h-10 w-10 text-cyan" /><h3 className="mt-4 font-display text-2xl uppercase text-foreground">Catalog is ready for products</h3><p className="mt-2 max-w-lg text-silver-muted">Add and publish products in Medusa Admin and they will appear here automatically.</p></div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 lg:gap-5">
            <div className="md:col-span-2 lg:col-span-2 lg:row-span-2"><ProductCard product={featured} featured /></div>
            {secondary.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        )}
      </div>
    </section>
  );
}
