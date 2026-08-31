"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { staggerContainer, fadeInUp } from "@/lib/animations";

const detailImages = [
  {
    src: "https://images.unsplash.com/photo-1611633859589-7990d2fbb56b?q=80&w=800&auto=format&fit=crop",
    label: "Wheel Finish",
    number: "01",
    tag: "FORGED",
  },
  {
    src: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=800&auto=format&fit=crop",
    label: "Carbon Fibre",
    number: "02",
    tag: "MACHINED",
  },
  {
    src: "https://images.unsplash.com/photo-1601673632676-12f89e430aa3?q=80&w=800&auto=format&fit=crop",
    label: "Interior Craft",
    number: "03",
    tag: "STITCHED",
  },
  {
    src: "https://images.unsplash.com/photo-1542282088-fe8426682b8f?q=80&w=800&auto=format&fit=crop",
    label: "LED Lighting",
    number: "04",
    tag: "TUNED",
  },
];

export function DetailsStory() {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], reducedMotion ? [0, 0] : [80, -80]);
  const y2 = useTransform(scrollYProgress, [0, 1], reducedMotion ? [0, 0] : [-50, 50]);

  return (
    <section
      ref={containerRef}
      className="relative z-20 overflow-hidden bg-background pt-24 pb-16 md:pt-32 md:pb-20"
    >
      <div className="mx-auto max-w-[1600px] px-4 md:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left copy */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.span
              variants={fadeInUp}
              className="mb-3 inline-block font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-cyan"
            >
              07 / Craft
            </motion.span>
            <motion.h2
              variants={fadeInUp}
              className="font-display text-[clamp(3rem,6vw,6rem)] font-bold uppercase leading-[0.85] tracking-[-0.04em] text-foreground"
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
              className="mt-10 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-white/[0.06] pt-8"
            >
              {[
                { value: "CNC", label: "Machined accents" },
                { value: "UV", label: "Protected coatings" },
                { value: "OEM+", label: "Factory-grade fit" },
                { value: "2yr", label: "Warranty" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="font-display text-3xl font-semibold text-cyan">{stat.value}</p>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-silver-muted">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right — parallax image grid with numbered labels */}
          <div className="relative grid grid-cols-2 gap-3 md:gap-4">
            <motion.div style={{ y: y1 }} className="space-y-3 pt-16 md:space-y-4 md:pt-20">
              <DetailCard image={detailImages[0]} />
              <DetailCard image={detailImages[1]} />
            </motion.div>
            <motion.div style={{ y: y2 }} className="space-y-3 md:space-y-4">
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
    <div className="group relative overflow-hidden border border-border bg-raised">
      <div className="relative aspect-[3/4] overflow-hidden">
        <Image
          src={image.src}
          alt={image.label}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover saturate-[0.8] transition duration-1000 ease-out-expo group-hover:scale-[1.05] group-hover:saturate-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        {/* Number badge */}
        <div className="absolute left-3 top-3 flex items-center gap-2">
          <span className="font-mono text-[9px] font-bold tracking-widest text-cyan">{image.number}</span>
          <span className="h-px w-4 bg-cyan/40" />
          <span className="font-mono text-[8px] uppercase tracking-[0.15em] text-white/60">{image.tag}</span>
        </div>
      </div>
      <p className="absolute bottom-3 left-3 font-display text-sm font-semibold uppercase tracking-wide text-foreground md:text-base">
        {image.label}
      </p>
    </div>
  );
}
