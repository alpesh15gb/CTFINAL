"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { categories } from "@/data/categories";
import { staggerContainer, fadeInUp } from "@/lib/animations";
import { cn } from "@/lib/utils";

export function Categories() {
  return (
    <section className="relative z-20 bg-raised pt-24 pb-16 md:pt-32 md:pb-20">
      <div className="mx-auto max-w-[1600px] px-4 md:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="mb-12 md:mb-16"
        >
          <motion.span
            variants={fadeInUp}
            className="mb-3 inline-block text-xs font-semibold uppercase tracking-[0.25em] text-cyan"
          >
            04 / Categories
          </motion.span>
          <motion.h2
            variants={fadeInUp}
            className="font-display text-5xl font-bold uppercase leading-[0.9] tracking-tight text-foreground md:text-7xl"
          >
            Choose
            <br />
            <span className="text-silver">Your Upgrade.</span>
          </motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {categories.map((category, idx) => (
            <CategoryCard key={category.id} category={category} index={idx} />
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
  const large = index === 0 || index === 4;

  return (
    <motion.div
      variants={fadeInUp}
      className={cn(
        "group relative overflow-hidden rounded-lg border border-border bg-surface",
        large && "sm:col-span-2 lg:col-span-1"
      )}
    >
      <Link href={`/shop?category=${category.slug}`} className="block">
        <div className={cn("relative overflow-hidden", large ? "aspect-[16/10]" : "aspect-[4/3]")}>
          <Image
            src={category.image}
            alt={category.name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-raised via-raised/40 to-transparent" />
        </div>

        <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold text-cyan">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-1 font-display text-2xl font-semibold uppercase text-foreground md:text-3xl">
                {category.name}
              </h3>
              <p className="mt-1 max-w-xs text-sm text-silver-muted opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                {category.description}
              </p>
            </div>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border text-foreground transition-all group-hover:border-cyan group-hover:bg-cyan group-hover:text-black">
              <ArrowUpRight className="h-4 w-4" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
