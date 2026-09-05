"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { FilmGrain, MaskText, ScrollReveal } from "./primitives";

/**
 * THE MACHINE HAS EVOLVED — full-screen statement over a sticky night/taillight
 * sequence. Foreground type stable, background settles 1.08 → 1.
 */
export function FutureArrived() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const bgScale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [1.08, 1]);
  const bgY = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["4%", "-3%"]);
  const dim = useTransform(scrollYProgress, [0, 0.5, 1], [0.25, 0.45, 0.6]);

  return (
    <section ref={ref} className="relative h-[220vh] bg-[#020202]">
      <div className="sticky top-0 flex h-svh min-h-[620px] flex-col justify-center overflow-hidden">
        <motion.div style={{ scale: reduce ? 1 : bgScale, y: reduce ? 0 : bgY }} className="absolute inset-0 will-change-transform">
          <img
            src="https://images.unsplash.com/photo-1571607388263-1044f9ea01dd?q=80&w=2400&auto=format&fit=crop"
            alt="Black supercar rear with glowing taillights at dusk"
            loading="lazy"
            className="h-[125%] w-full object-cover brightness-[0.5] contrast-[1.15] saturate-[0.3]"
          />
        </motion.div>
        <motion.div style={{ opacity: dim }} className="absolute inset-0 bg-black" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-[#020202]/30 to-[#020202]/70" />

        <div className="site-container relative z-10">
          <MaskText
            className="campaign-title text-[clamp(4.5rem,11vw,12rem)]"
            lines={["The machine", <span key="h" className="text-white/90">has evolved.</span>]}
          />
          <ScrollReveal delay={0.2} className="mt-8 flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/60">
              Crafted without compromise
            </p>
            <Link
              href="/#vehicle-selector"
              className="group inline-flex w-fit items-center gap-4 rounded-full border border-white/25 bg-white/[0.04] py-4 pl-8 pr-6 font-mono text-[11px] font-bold uppercase tracking-[0.24em] text-white backdrop-blur-sm transition-colors duration-300 hover:border-white hover:bg-white hover:text-black"
            >
              Start your build
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
            </Link>
          </ScrollReveal>
        </div>
        <FilmGrain />
      </div>
    </section>
  );
}

/** Philosophy interlude — vast black canvas, line-by-line scroll reveal. */
export function Philosophy() {
  return (
    <section className="relative overflow-hidden bg-[#020202] py-32 md:py-52">
      <div className="site-container max-w-[1400px]">
        <MaskText
          className="campaign-title text-[clamp(3.8rem,9vw,10rem)]"
          lines={[
            <span key="w" className="text-white/70">We tune</span>,
            "the experience.",
          ]}
          stagger={0.12}
        />
      </div>
      <FilmGrain />
    </section>
  );
}

