"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { FilmGrain, MaskText, SectionLabel } from "./primitives";

const MACHINES = [
  { name: "CTZ-R Nocturne", spec: "Black Series / 820 HP", img: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1800&auto=format&fit=crop" },
  { name: "GTX Blackline", spec: "Night / Front aero", img: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?q=80&w=1800&auto=format&fit=crop" },
  { name: "R8 Velocity", spec: "Rear / Track spec", img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1800&auto=format&fit=crop" },
  { name: "M4 RS/01", spec: "Bespoke commission", img: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=1800&auto=format&fit=crop" },
];

/**
 * SELECTED MACHINES — desktop: sticky horizontal travel; mobile: vertical stack.
 * Large image first, minimal metadata.
 */
export function SelectedMachines() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0.08, 0.92], reduce ? ["0%", "0%"] : ["2%", "-62%"]);

  return (
    <section ref={ref} className="relative bg-[#020202] md:h-[340vh]">
      <div className="md:sticky md:top-0 md:flex md:h-svh md:min-h-[620px] md:flex-col md:justify-center md:overflow-hidden">
        <div className="site-container pt-24 md:pt-0">
          <SectionLabel>Built by Cartunez</SectionLabel>
          <MaskText className="campaign-title mt-6 text-[clamp(4rem,9vw,10rem)]" lines={["Selected", <span key="m" className="text-white/85">machines.</span>]} />
        </div>

        {/* Mobile: vertical */}
        <div className="site-container mt-12 space-y-10 pb-24 md:hidden">
          {MACHINES.map((m) => (
            <Link key={m.name} href="/builds" className="group block">
              <span className="block overflow-hidden">
                <img src={m.img} alt={m.name} loading="lazy" className="aspect-[16/10] w-full object-cover brightness-[0.55] contrast-[1.12] saturate-[0.1]" />
              </span>
              <span className="mt-3 flex items-baseline justify-between">
                <span className="font-display text-2xl font-semibold uppercase tracking-tight text-white">{m.name}</span>
                <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/50">{m.spec}</span>
              </span>
            </Link>
          ))}
        </div>

        {/* Desktop: horizontal travel */}
        <motion.div style={{ x }} className="mt-14 hidden items-stretch gap-8 pl-[max(2rem,calc((100vw-1600px)/2+2.5rem))] md:flex">
          {MACHINES.map((m, i) => (
            <Link key={m.name} href="/builds" className="group w-[58vw] max-w-[860px] shrink-0 lg:w-[46vw]">
              <span className="block overflow-hidden">
                <img
                  src={m.img}
                  alt={m.name}
                  loading="lazy"
                  className="aspect-[16/9] w-full object-cover brightness-[0.55] contrast-[1.12] saturate-[0.1] transition-transform duration-[850ms] ease-out group-hover:scale-[1.03]"
                />
              </span>
              <span className="mt-4 flex items-baseline gap-6">
                <span className="font-mono text-[10px] tracking-[0.3em] text-white/40">0{i + 1}</span>
                <span className="font-display text-4xl font-semibold uppercase leading-none tracking-tight text-white/90 transition-colors group-hover:text-white lg:text-5xl">
                  {m.name}
                </span>
                <span className="ml-auto flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-white/50">
                  {m.spec}
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
                </span>
              </span>
            </Link>
          ))}
          <div className="w-[8vw] shrink-0" aria-hidden />
        </motion.div>
      </div>
      <FilmGrain />
    </section>
  );
}
