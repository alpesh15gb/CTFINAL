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

  const heading = selected
    ? `Upgrades for your ${selected.brand} ${selected.model}`
    : "Engineered to fit.";

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
            <motion.span
              variants={fadeInUp}
              className="mb-3 inline-block text-xs font-semibold uppercase tracking-[0.25em] text-cyan"
            >
              03 / Featured Products
            </motion.span>
            <motion.h2
              variants={fadeInUp}
              className="font-display text-5xl font-bold uppercase leading-[0.9] tracking-tight text-foreground md:text-7xl"
            >
              {heading}
            </motion.h2>
            <motion.p variants={fadeInUp} className="mt-4 text-lg text-silver-muted">
              Hand-picked upgrades that transform the way your car looks, feels and drives.
            </motion.p>
          </div>

          <motion.div variants={fadeInUp}>
            <Button
              asChild
              variant="outline"
              className="border-border bg-transparent text-foreground hover:border-cyan hover:text-cyan"
            >
              <Link href="/shop" className="gap-2">
                Shop All <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>

        {/* Bento grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2 lg:row-span-2">
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
