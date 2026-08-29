"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { categories } from "@/data/categories";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { cn } from "@/lib/utils";

const categoryLayout = [
  "lg:col-span-7 lg:row-span-2",
  "lg:col-span-5",
  "lg:col-span-5",
  "lg:col-span-3",
  "lg:col-span-3",
  "lg:col-span-3",
  "lg:col-span-3",
];

export function Categories() {
  return (
    <section className="relative z-20 overflow-hidden border-y border-border bg-raised py-24 md:py-32 lg:py-40">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_15%,rgba(49,207,255,0.055),transparent_28rem)]" />
      <div className="site-container relative">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="mb-12 grid gap-7 md:mb-16 lg:grid-cols-[1fr_0.55fr] lg:items-end"
        >
          <div>
            <motion.span variants={fadeInUp} className="technical-label mb-5">
              04 / Curated collections
            </motion.span>
            <motion.h2
              variants={fadeInUp}
              className="max-w-4xl font-display text-6xl font-bold uppercase leading-[0.8] tracking-[-0.04em] text-foreground md:text-8xl lg:text-9xl"
            >
              Upgrade by
              <br />
              <span className="display-outline">intent.</span>
            </motion.h2>
          </div>
          <motion.p variants={fadeInUp} className="max-w-md text-base leading-relaxed text-silver-muted lg:pb-2">
            From subtle factory-plus details to full performance transformations, every collection is selected around how you want your car to feel.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="grid gap-4 sm:grid-cols-2 lg:auto-rows-[17rem] lg:grid-cols-12"
        >
          {categories.map((category, index) => (
            <CategoryCard key={category.id} category={category} index={index} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function CategoryCard({
  category,
  index,
}: {
  category: (typeof categories)[number];
  index: number;
}) {
  const featured = index === 0;

  return (
    <motion.article
      variants={fadeInUp}
      className={cn(
        "edge-highlight group relative min-h-[20rem] overflow-hidden rounded-sm border border-border bg-surface",
        categoryLayout[index],
        featured && "sm:col-span-2 lg:min-h-0"
      )}
    >
      <Link href={`/shop?category=${category.slug}`} className="block h-full min-h-[20rem] focus-visible:outline-none lg:min-h-0">
        <Image
          src={category.image}
          alt={category.name}
          fill
          sizes={featured ? "(max-width: 1024px) 100vw, 58vw" : "(max-width: 768px) 100vw, 35vw"}
          className="object-cover saturate-[0.78] transition duration-1000 ease-out-expo group-hover:scale-[1.045] group-hover:saturate-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-black/5" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/35 via-transparent to-transparent" />

        <div className="absolute inset-0 flex flex-col justify-between p-5 md:p-7">
          <div className="flex items-start justify-between">
            <span className="font-mono text-[9px] font-bold tracking-[0.2em] text-cyan">
              / {String(index + 1).padStart(2, "0")}
            </span>
            <span className="flex h-11 w-11 items-center justify-center rounded-sm border border-white/20 bg-black/25 text-foreground backdrop-blur-md transition-all duration-300 group-hover:border-cyan group-hover:bg-cyan group-hover:text-black">
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </div>

          <div>
            <p className="mb-2 max-w-sm text-sm leading-relaxed text-silver opacity-90 md:text-base">
              {category.description}
            </p>
            <h3
              className={cn(
                "font-display font-semibold uppercase leading-none tracking-[-0.025em] text-white",
                featured ? "text-5xl md:text-7xl" : "text-4xl md:text-5xl"
              )}
            >
              {category.name}
            </h3>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
