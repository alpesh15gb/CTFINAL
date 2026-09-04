"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { FilmGrain, SectionLabel } from "./primitives";

/**
 * Giant model moment — colossal CTZ with the machine intersecting it.
 * Layering: background → giant type → vehicle → foreground metadata.
 */
export function GiantMark() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const typeX = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["4%", "-4%"]);
  const imgY = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["6%", "-6%"]);

  return (
    <section ref={ref} className="relative flex min-h-[110vh] flex-col justify-center overflow-hidden bg-[#020202] py-24">
      <div className="site-container relative z-10">
        <SectionLabel>CTZ / Black Series</SectionLabel>
      </div>

      <div className="relative mt-4">
        {/* Giant type behind */}
        <motion.div style={{ x: reduce ? 0 : typeX }} aria-hidden className="pointer-events-none relative z-[1] select-none">
          <p className="campaign-title whitespace-nowrap text-center text-[clamp(9rem,30vw,32rem)] leading-[0.78] text-white/[0.13]">
            CTZ
          </p>
        </motion.div>

        {/* Vehicle intersecting the mark */}
        <motion.div style={{ y: reduce ? 0 : imgY }} className="relative z-[2] mx-auto -mt-[10vw] w-[92%] max-w-[1400px] md:-mt-[8vw]">
          <div className="relative aspect-[21/9] overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=2400&auto=format&fit=crop"
              alt="Grey performance coupe on a dark road intersecting the CTZ mark"
              fill
              sizes="100vw"
              loading="lazy"
              className="object-cover object-center brightness-[0.5] contrast-[1.15] saturate-[0.1]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-transparent to-[#020202]/70" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#020202]/60 via-transparent to-[#020202]/60" />
          </div>
        </motion.div>

        {/* Foreground metadata */}
        <div className="site-container relative z-[3] -mt-6 flex items-end justify-between md:-mt-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/55">01 / Exterior</p>
          <p className="text-right font-mono text-[10px] uppercase tracking-[0.3em] text-white/55">
            Performance
            <br className="md:hidden" /> configuration
          </p>
        </div>
      </div>
      <FilmGrain />
    </section>
  );
}
