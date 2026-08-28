"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { staggerContainer, fadeInUp } from "@/lib/animations";

const detailImages = [
  {
    src: "https://images.unsplash.com/photo-1611633859589-7990d2fbb56b?q=80&w=800&auto=format&fit=crop",
    label: "Wheel Finish",
  },
  {
    src: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=800&auto=format&fit=crop",
    label: "Carbon Fibre",
  },
  {
    src: "https://images.unsplash.com/photo-1601673632676-12f89e430aa3?q=80&w=800&auto=format&fit=crop",
    label: "Interior Craft",
  },
  {
    src: "https://images.unsplash.com/photo-1542282088-fe8426682b8f?q=80&w=800&auto=format&fit=crop",
    label: "LED Lighting",
  },
];

export function DetailsStory() {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], reducedMotion ? [0, 0] : [60, -60]);
  const y2 = useTransform(scrollYProgress, [0, 1], reducedMotion ? [0, 0] : [-40, 40]);

  return (
    <section
      ref={containerRef}
      className="relative z-20 overflow-hidden bg-background pt-24 pb-16 md:pt-32 md:pb-20"
    >
      <div className="mx-auto max-w-[1600px] px-4 md:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.span
              variants={fadeInUp}
              className="mb-3 inline-block text-xs font-semibold uppercase tracking-[0.25em] text-cyan"
            >
              07 / Craft
            </motion.span>
            <motion.h2
              variants={fadeInUp}
              className="font-display text-5xl font-bold uppercase leading-[0.9] tracking-tight text-foreground md:text-7xl"
            >
              Details
              <br />
              <span className="text-silver">Matter.</span>
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="mt-6 max-w-md text-lg leading-relaxed text-silver-muted"
            >
              We obsess over materials, fit and finish because the smallest details
              create the biggest presence on the road.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="mt-8 grid grid-cols-2 gap-6 border-t border-border pt-8"
            >
              {[
                { value: "CNC", label: "Machined accents" },
                { value: "UV", label: "Protected coatings" },
                { value: "OEM+", label: "Factory-grade fit" },
                { value: "2yr", label: "Warranty" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="font-display text-3xl font-semibold text-cyan">{stat.value}</p>
                  <p className="text-sm text-silver-muted">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          <div className="relative grid grid-cols-2 gap-4">
            <motion.div style={{ y: y1 }} className="space-y-4 pt-12">
              <DetailCard image={detailImages[0]} />
              <DetailCard image={detailImages[1]} />
            </motion.div>
            <motion.div style={{ y: y2 }} className="space-y-4">
              <DetailCard image={detailImages[2]} />
              <DetailCard image={detailImages[3]} />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function DetailCard({ image }: { image: (typeof detailImages)[number] }) {
  return (
    <div className="group relative overflow-hidden rounded-lg border border-border bg-raised">
      <div className="relative aspect-[3/4] overflow-hidden">
        <Image
          src={image.src}
          alt={image.label}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-raised via-transparent to-transparent" />
      </div>
      <p className="absolute bottom-4 left-4 text-xs font-semibold uppercase tracking-widest text-foreground">
        {image.label}
      </p>
    </div>
  );
}
