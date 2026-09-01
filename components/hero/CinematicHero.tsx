"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ShieldCheck, Gauge, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { HeroStudio } from "@/components/three/HeroStudio";
import { TEMPORARY_MACRO_ASSET } from "@/lib/heroConfig";

/**
 * Cinematic Hero: The "Ignition" Reveal Sequence (Pinned 160–200vh stage).
 *
 * Phase 1 (0% – 30%): Macro alloy close-up & specular ambient sweep.
 * Phase 2 (30% – 70%): Stance reveal with floating technical HUD specs (Forged T6061, PCD 5x112, 8.9kg).
 * Phase 3 (70% – 100%): Seamless expansion and dark transition into catalog / fitment.
 */
export function CinematicHero() {
  const containerRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const isInView = useInView(containerRef, { margin: "200px 0px" });
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Phase 1 (0% – 30%) — Macro Spoke & Minimal HUD
  const macroOpacity = useTransform(scrollYProgress, [0, 0.22, 0.32], [1, 0.85, 0]);
  const macroScale = useTransform(scrollYProgress, [0, 0.30], [1.12, 1.02]);
  const initialHudOpacity = useTransform(scrollYProgress, [0, 0.15, 0.28], [1, 1, 0]);

  // Phase 2 (30% – 70%) — Stance Reveal & Technical Telemetry
  const canvasOpacity = useTransform(scrollYProgress, [0.18, 0.30, 0.75, 0.88], [0, 1, 1, 0]);
  const campaignTextOpacity = useTransform(scrollYProgress, [0.28, 0.38, 0.64, 0.72], [0, 1, 1, 0]);
  const campaignTextY = useTransform(scrollYProgress, [0.28, 0.40], [28, 0]);

  // Technical HUD Telemetry Locks (Forged T6061, PCD 5x112, 8.9kg, ET38)
  const hudCard1Opacity = useTransform(scrollYProgress, [0.35, 0.42, 0.62, 0.70], [0, 1, 1, 0]);
  const hudCard2Opacity = useTransform(scrollYProgress, [0.40, 0.48, 0.62, 0.70], [0, 1, 1, 0]);
  const hudCard3Opacity = useTransform(scrollYProgress, [0.45, 0.52, 0.62, 0.70], [0, 1, 1, 0]);

  // Phase 3 (70% – 100%) — Storefront Feed Transition
  const detailApertureOpacity = useTransform(scrollYProgress, [0.72, 0.78, 0.90, 0.96], [0, 1, 1, 0]);
  const exitDarken = useTransform(scrollYProgress, [0.92, 1.0], [0, 0.85]);

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
              Vehicle-specific performance accessories & bespoke forged alloys engineered for exact fitment and aerospace-grade precision.
            </p>
            <div className="flex shrink-0 flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/#vehicle-selector">
                  Match My Vehicle <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/shop">Explore Catalog</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={containerRef} className="relative h-[180vh] bg-background">
      <div className="sticky top-0 h-svh min-h-[640px] overflow-hidden bg-background">
        {/* Phase 1: Macro Spoke Close-up on initial scroll */}
        <motion.div
          style={{ opacity: macroOpacity, scale: macroScale }}
          className="absolute inset-0 z-[8] pointer-events-none"
        >
          <Image
            src={TEMPORARY_MACRO_ASSET}
            alt="Aerospace forged alloy detail"
            fill
            sizes="100vw"
            priority
            className="object-cover object-[38%_50%] brightness-[0.70] contrast-[1.18]"
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_50%,transparent_20%,rgba(3,4,5,0.85)_95%)]" />
        </motion.div>

        {/* Phase 2: WebGL 3D Studio Reveal */}
        <motion.div style={{ opacity: canvasOpacity }} className="absolute inset-0 z-[5]">
          <HeroStudio
            scrollProgress={scrollYProgress}
            reducedMotion={reducedMotion}
            active={isInView}
          />
        </motion.div>

        {/* Ambient Photographic Vignette */}
        <div className="pointer-events-none absolute inset-0 z-[6] bg-[radial-gradient(circle_at_60%_50%,transparent_35%,rgba(3,4,5,0.75)_90%)]" />

        {/* Phase 3: Detail Aperture Handoff */}
        <motion.div
          style={{ opacity: detailApertureOpacity }}
          className="absolute inset-0 z-[12] pointer-events-none"
        >
          <Image
            src={TEMPORARY_MACRO_ASSET}
            alt="Forged wheel detail"
            fill
            sizes="100vw"
            className="object-cover object-[38%_50%] brightness-[0.65] contrast-[1.18]"
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_52%,transparent_25%,rgba(3,4,5,0.70)_95%)]" />
        </motion.div>

        {/* Phase 1 Initial HUD Badge */}
        <motion.div
          style={{ opacity: initialHudOpacity }}
          className="absolute left-6 top-24 z-20 md:left-12 md:top-28 pointer-events-none"
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-silver-muted">
            Cartunez / Ignition Phase 01
          </span>
          <p className="mt-1 font-display text-sm font-semibold uppercase tracking-wider text-white">
            6061-T6 Aerospace Forged
          </p>
        </motion.div>

        {/* Phase 2: Floating Telemetry HUD Cards */}
        <div className="pointer-events-none absolute right-6 top-24 z-20 flex flex-col gap-3 md:right-12 md:top-32">
          {/* HUD Item 1: Material Spec */}
          <motion.div
            style={{ opacity: hudCard1Opacity }}
            className="rounded-sm border border-white/10 bg-obsidian-surface/80 p-3 backdrop-blur-md"
          >
            <div className="flex items-center gap-2 text-cyan">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span className="font-mono text-[9px] uppercase tracking-widest text-silver-muted">Material Spec</span>
            </div>
            <p className="mt-0.5 font-mono text-xs font-semibold text-foreground">FORGED T6061-V2</p>
          </motion.div>

          {/* HUD Item 2: PCD & Offset */}
          <motion.div
            style={{ opacity: hudCard2Opacity }}
            className="rounded-sm border border-white/10 bg-obsidian-surface/80 p-3 backdrop-blur-md"
          >
            <div className="flex items-center gap-2 text-amber">
              <Gauge className="h-3.5 w-3.5" />
              <span className="font-mono text-[9px] uppercase tracking-widest text-silver-muted">Fitment Matrix</span>
            </div>
            <p className="mt-0.5 font-mono text-xs font-semibold text-foreground">PCD 5x112 / ET38</p>
          </motion.div>

          {/* HUD Item 3: Mass Reduction */}
          <motion.div
            style={{ opacity: hudCard3Opacity }}
            className="rounded-sm border border-white/10 bg-obsidian-surface/80 p-3 backdrop-blur-md"
          >
            <div className="flex items-center gap-2 text-hyperRed">
              <Zap className="h-3.5 w-3.5" />
              <span className="font-mono text-[9px] uppercase tracking-widest text-silver-muted">Rotational Mass</span>
            </div>
            <p className="mt-0.5 font-mono text-xs font-semibold text-foreground">8.9 KG (-28% vs Cast)</p>
          </motion.div>
        </div>

        {/* Phase 2: Campaign Statement */}
        <motion.div
          style={{ opacity: campaignTextOpacity, y: campaignTextY }}
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

        {/* Scroll Indicator */}
        <motion.div
          style={{ opacity: initialHudOpacity }}
          className="pointer-events-none absolute inset-x-0 bottom-8 z-20 flex flex-col items-center gap-2"
        >
          <span className="font-mono text-[9px] uppercase tracking-[0.32em] text-silver-muted">Ignition Scroll</span>
          <div className="h-8 w-px bg-gradient-to-b from-white/30 to-transparent" />
        </motion.div>

        {/* Dark Exit Transition into Bridge */}
        <motion.div
          style={{ opacity: exitDarken }}
          className="pointer-events-none absolute inset-0 z-30 bg-[#030405]"
        />
      </div>
    </section>
  );
}
