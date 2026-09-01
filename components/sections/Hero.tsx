"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { TEMPORARY_MACRO_ASSET } from "@/lib/heroConfig";

const HeroStudio = dynamic(
  () => import("@/components/three/HeroStudio").then((mod) => mod.HeroStudio),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_55%,rgba(220,225,230,0.03),transparent_30rem)]" />
    ),
  }
);

/**
 * Director's Cut V2 Visual Recovery — 160vh, 3 Photographic Moments:
 *   FRAME A (0.00–0.25): Dark Machine — minimal identity, pure machine focus
 *   FRAME B (0.25–0.70): Campaign Hero — restrained DOM typography (BUILT BEYOND / FACTORY.)
 *   FRAME C (0.70–1.00): Detail & Macro Handoff — dark aperture push into macro photography
 */
export function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const isInView = useInView(containerRef, { margin: "200px 0px" });
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // FRAME A (0.00–0.25) — Minimal identity & scroll cue
  const labelOpacity = useTransform(scrollYProgress, [0, 0.12, 0.22], [1, 1, 0]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.08, 0.16], [1, 1, 0]);

  // FRAME B (0.25–0.70) — Single cohesive campaign statement
  // Small tracked overline + bold FACTORY. statement positioned in negative space
  const heroTextOpacity = useTransform(scrollYProgress, [0.24, 0.34, 0.65, 0.74], [0, 1, 1, 0]);
  const heroTextY = useTransform(scrollYProgress, [0.24, 0.36], [28, 0]);

  // FRAME C (0.70–1.00) — Macro detail & aperture handoff
  const canvasOpacity = useTransform(scrollYProgress, [0.66, 0.76, 0.86], [1, 0.4, 0]);
  const macroOpacity = useTransform(scrollYProgress, [0.72, 0.78, 0.90, 0.96], [0, 1, 1, 0]);
  const macroScale = useTransform(scrollYProgress, [0.72, 0.96], [1.08, 1.01]);
  const macroMask = useTransform(scrollYProgress, (v: number) => {
    const t = Math.min(1, Math.max(0, (v - 0.72) / 0.16));
    const inner = 20 + t * 65;
    const outer = inner + 25;
    return `radial-gradient(circle at 35% 52%, rgba(0,0,0,1) ${inner}%, rgba(0,0,0,0) ${outer}%)`;
  });
  const copyOneOpacity = useTransform(scrollYProgress, [0.74, 0.80, 0.90, 0.96], [0, 1, 1, 0]);
  const copyTwoOpacity = useTransform(scrollYProgress, [0.76, 0.82, 0.90, 0.96], [0, 1, 1, 0]);

  // Dark exit fade into Bridge (predominantly black, NO white flash)
  const exitDarken = useTransform(scrollYProgress, [0.94, 1.0], [0, 0.75]);

  if (reducedMotion) {
    return (
      <section className="relative h-svh min-h-[680px] bg-background">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 z-[5]">
            <HeroStudio scrollProgress={scrollYProgress} reducedMotion={true} active={true} />
          </div>
          <div className="pointer-events-none absolute inset-0 z-[6] bg-[radial-gradient(circle_at_60%_50%,transparent_35%,rgba(3,4,5,0.85)_90%)]" />
        </div>
        <div className="site-container relative z-10 flex h-full flex-col justify-center pb-7 pt-24 lg:pt-32">
          <div className="max-w-[1200px]">
            <span className="font-mono text-xs uppercase tracking-[0.32em] text-silver-muted md:text-sm">
              Built Beyond
            </span>
            <h1 className="mt-2 font-display text-[clamp(4rem,10vw,10.5rem)] font-bold uppercase leading-[0.80] tracking-[-0.04em] text-foreground">
              FACTORY.
            </h1>
          </div>
          <div className="mt-8 flex max-w-2xl flex-col gap-6 md:flex-row md:items-end">
            <p className="max-w-md text-base leading-relaxed text-silver-muted md:text-lg">
              Vehicle-specific accessories and performance upgrades, selected for exact fitment and finished to feel factory—only better.
            </p>
            <div className="flex shrink-0 flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/#vehicle-selector">Match my vehicle <ArrowRight className="h-4 w-4" /></Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/builds">View builds</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={containerRef} className="relative h-[160vh] bg-background">
      <div className="sticky top-0 h-svh min-h-[640px] overflow-hidden bg-background">
        {/* WebGL studio */}
        <motion.div style={{ opacity: canvasOpacity }} className="absolute inset-0 z-[5]">
          <HeroStudio
            scrollProgress={scrollYProgress}
            reducedMotion={reducedMotion}
            active={isInView}
          />
        </motion.div>

        {/* Soft cinematic vignette */}
        <div className="pointer-events-none absolute inset-0 z-[6] bg-[radial-gradient(circle_at_60%_50%,transparent_35%,rgba(3,4,5,0.75)_90%)]" />

        {/* FRAME C — Macro detail photo with aperture mask & engineering color grade */}
        <motion.div
          style={{ opacity: macroOpacity, scale: macroScale }}
          className="absolute inset-0 z-[12]"
        >
          <motion.div style={{ WebkitMaskImage: macroMask, maskImage: macroMask }} className="absolute inset-0">
            <Image
              src={TEMPORARY_MACRO_ASSET}
              alt="Forged wheel and brake detail under studio light"
              fill
              sizes="100vw"
              className="object-cover object-[38%_50%] brightness-[0.68] contrast-[1.18]"
            />
            {/* Soft dark vignette over macro image */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_35%_52%,transparent_25%,rgba(3,4,5,0.70)_95%)]" />
            <div className="pointer-events-none absolute inset-0 bg-black/20" />
          </motion.div>
        </motion.div>

        {/* FRAME B — Single cohesive campaign statement in negative space */}
        <motion.div
          style={{ opacity: heroTextOpacity, y: heroTextY }}
          className="pointer-events-none absolute inset-x-0 bottom-[14%] z-[15] px-6 md:px-12"
        >
          <div className="mx-auto max-w-[1600px]">
            <div className="inline-block">
              <span className="font-mono text-xs uppercase tracking-[0.32em] text-silver-muted md:text-sm">
                Built Beyond
              </span>
              <p className="mt-1 font-display text-[clamp(3.5rem,8.5vw,9.5rem)] font-bold uppercase leading-[0.78] tracking-[-0.04em] text-foreground">
                FACTORY.
              </p>
            </div>
          </div>
        </motion.div>

        {/* FRAME A — Minimal identity */}
        <motion.div
          style={{ opacity: labelOpacity }}
          className="absolute left-6 top-24 z-20 md:left-12 md:top-28"
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.30em] text-silver-muted">
            Cartunez / Spec 01
          </span>
        </motion.div>

        <motion.div
          style={{ opacity: cueOpacity }}
          className="absolute inset-x-0 bottom-8 z-20 flex flex-col items-center gap-2"
        >
          <span className="font-mono text-[9px] uppercase tracking-[0.32em] text-silver-muted">Scroll</span>
          <div className="h-8 w-px bg-gradient-to-b from-white/30 to-transparent" />
        </motion.div>

        {/* FRAME C — Technical editorial callouts (crisp, high contrast) */}
        <motion.div
          style={{ opacity: copyOneOpacity }}
          className="absolute right-6 top-[30%] z-20 text-right md:right-12"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-white/75">01 / Fitment</p>
          <p className="mt-1 font-display text-lg font-bold uppercase tracking-wider text-white md:text-xl">
            OEM+ Precision
          </p>
          <div className="ml-auto mt-2 h-px w-20 bg-white/30" />
        </motion.div>

        <motion.div
          style={{ opacity: copyTwoOpacity }}
          className="absolute right-6 top-[48%] z-20 text-right md:right-12"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-white/75">02 / Material</p>
          <p className="mt-1 font-display text-lg font-bold uppercase tracking-wider text-white md:text-xl">
            Engineered Finish
          </p>
          <div className="ml-auto mt-2 h-px w-20 bg-white/30" />
        </motion.div>

        {/* Dark exit fade into Bridge (NO white blowout) */}
        <motion.div
          style={{ opacity: exitDarken }}
          className="pointer-events-none absolute inset-0 z-30 bg-[#030405]"
        />
      </div>
    </section>
  );
}
