"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product/ProductCard";
import { products } from "@/data/products";
import { useVehicle } from "@/hooks/useVehicle";
import { staggerContainer, fadeInUp } from "@/lib/animations";

export function FeaturedProducts() {
  const { selected } = useVehicle();
  const featured = products[0];
  const secondary = products.slice(1, 5);

  return (
    <section className="section-space precision-grid relative z-20 overflow-hidden bg-background">
      <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-cyan/35 to-transparent" />
      <div className="site-container relative">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="mb-12 grid items-end gap-8 lg:mb-16 lg:grid-cols-12"
        >
          <div className="lg:col-span-8">
            <motion.p variants={fadeInUp} className="technical-label">
              03 / Curated performance
            </motion.p>
            <motion.h2
              variants={fadeInUp}
              className="mt-6 max-w-5xl font-display text-5xl font-bold uppercase leading-[0.84] tracking-[-0.035em] text-foreground sm:text-6xl md:text-8xl"
            >
              {selected ? (
                <>
                  Built for your
                  <span className="display-outline block">{selected.brand} {selected.model}</span>
                </>
              ) : (
                <>
                  Parts with
                  <span className="display-outline block">purpose.</span>
                </>
              )}
            </motion.h2>
          </div>

          <motion.div variants={fadeInUp} className="lg:col-span-4 lg:pb-2">
            <p className="max-w-md text-base leading-relaxed text-silver-muted md:text-lg">
              Considered upgrades for stance, sound, cabin and response—selected for finish, fit and everyday drivability.
            </p>
            <Button asChild variant="outline" className="mt-6">
              <Link href="/shop" className="gap-3">
                Explore all upgrades <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          <div className="md:col-span-2 lg:col-span-2 lg:row-span-2">
            <ProductCard product={featured} featured />
          </div>
          {secondary.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
