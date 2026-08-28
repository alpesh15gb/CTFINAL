"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Instagram } from "lucide-react";
import { staggerContainer, fadeInUp } from "@/lib/animations";

const communityImages = [
  "https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1549064233-945d7063292f?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1542282088-fe8426682b8f?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1542377281-73d08e3a10aa?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?q=80&w=600&auto=format&fit=crop",
];

export function Community() {
  return (
    <section className="relative z-20 overflow-hidden bg-background py-24 md:py-32">
      <div className="mx-auto max-w-[1600px] px-4 md:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="mb-10 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end"
        >
          <div>
            <motion.span
              variants={fadeInUp}
              className="mb-3 inline-block text-xs font-semibold uppercase tracking-[0.25em] text-cyan"
            >
              09 / Community
            </motion.span>
            <motion.h2
              variants={fadeInUp}
              className="font-display text-5xl font-bold uppercase leading-[0.9] tracking-tight text-foreground md:text-7xl"
            >
              @Cartunez_Hyd
            </motion.h2>
          </div>
          <motion.a
            variants={fadeInUp}
            href="https://instagram.com/cartunez_hyd"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium uppercase tracking-wider text-foreground transition-colors hover:border-cyan hover:text-cyan"
          >
            <Instagram className="h-4 w-4" /> Follow Us
          </motion.a>
        </motion.div>
      </div>

      {/* Scrolling gallery */}
      <div className="no-scrollbar flex gap-4 overflow-x-auto px-4 pb-4 md:px-8">
        {communityImages.map((src, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.05, duration: 0.5 }}
            className={
              "group relative shrink-0 overflow-hidden rounded-lg border border-border bg-raised " +
              (idx % 3 === 0 ? "aspect-[3/4] w-64" : "aspect-square w-56")
            }
          >
            <Image
              src={src}
              alt={`Community build ${idx + 1}`}
              fill
              sizes="256px"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-raised/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
