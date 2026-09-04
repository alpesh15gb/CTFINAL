"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { FilmGrain, MaskText, ScrollReveal } from "@/components/cinematic/primitives";

/** READY TO BUILD YOURS? — full-screen cinematic ending over taillights. */
export function FinalCTA() {
  const containerRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"] });

  const y = useTransform(scrollYProgress, [0, 1], reducedMotion ? ["0%", "0%"] : ["5%", "-4%"]);
  const scale = useTransform(scrollYProgress, [0, 1], reducedMotion ? [1, 1] : [1.08, 1]);

  return (
    <section ref={containerRef} className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden bg-[#020202]">
      <motion.div style={{ y: reducedMotion ? 0 : y, scale: reducedMotion ? 1 : scale }} className="absolute inset-x-0 top-0 h-[125%] will-change-transform">
        <Image
          src="https://images.unsplash.com/photo-1571607388263-1044f9ea01dd?q=80&w=2400&h=1300&auto=format&fit=crop&crop=top"
          alt="Rear taillights of a black supercar glowing at dusk"
          fill
          className="object-cover brightness-[0.7] contrast-[1.15] saturate-[0.7]"
          sizes="100vw"
        />
      </motion.div>
      <div className="absolute inset-0 bg-black/35" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-[#020202]/30 to-[#020202]/70" />

      <div className="site-container relative z-10 pb-[10vh]">
        <MaskText
          className="campaign-title text-[clamp(5rem,12vw,13rem)]"
          lines={["Ready", "to build", <span key="y" className="text-white/85">yours?</span>]}
        />
        <ScrollReveal delay={0.15} className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
          <Link
            href="/#vehicle-selector"
            className="group inline-flex w-fit items-center gap-4 rounded-full bg-white py-4 pl-8 pr-6 font-mono text-[11px] font-bold uppercase tracking-[0.24em] text-black transition-colors duration-300 hover:bg-white/85"
          >
            Start your build
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
          </Link>
          <Link
            href="/contact"
            className="inline-flex w-fit items-center gap-3 px-2 py-4 font-mono text-[11px] font-bold uppercase tracking-[0.24em] text-white/70 transition-colors hover:text-white"
          >
            Talk to Cartunez
          </Link>
        </ScrollReveal>
      </div>
      <FilmGrain />
    </section>
  );
}
