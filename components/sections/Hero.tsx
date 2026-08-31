"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const HeroCanvas = dynamic(
  () => import("@/components/three/HeroCanvas").then((mod) => mod.HeroCanvas),
  {
    ssr: false,
    loading: () => <HeroFallback />,
  }
);

function HeroFallback() {
  return (
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_65%_45%,rgba(49,207,255,0.08),transparent_28rem)]" />
  );
}

export function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const isInView = useInView(containerRef, { margin: "200px 0px" });
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Phase-based opacity/transforms driven by scroll progress
  const introOpacity = useTransform(scrollYProgress, [0, 0.08, 0.18], [1, 1, 0]);
  const scrollPromptOpacity = useTransform(scrollYProgress, [0, 0.05, 0.12], [0, 1, 0]);

  const headlineOpacity = useTransform(scrollYProgress, [0.1, 0.2, 0.55, 0.7], [0, 1, 1, 0]);
  const headlineY = useTransform(scrollYProgress, [0.1, 0.25], [60, 0]);

  // Background type appears AFTER darkness lifts, fades before exit
  const bgTypeOpacity = useTransform(scrollYProgress, [0.15, 0.25, 0.6, 0.75], [0, 0.06, 0.06, 0]);
  const bgTypeScale = useTransform(scrollYProgress, [0.15, 0.4], [0.92, 1]);

  const fgTypeOpacity = useTransform(scrollYProgress, [0.28, 0.38, 0.6, 0.72], [0, 1, 1, 0]);
  const fgTypeY = useTransform(scrollYProgress, [0.28, 0.48], [40, 0]);

  const subCopyOpacity = useTransform(scrollYProgress, [0.32, 0.42, 0.6, 0.72], [0, 1, 1, 0]);
  const ctaOpacity = useTransform(scrollYProgress, [0.36, 0.46, 0.6, 0.72], [0, 1, 1, 0]);

  const techAnnotationsOpacity = useTransform(scrollYProgress, [0.42, 0.52, 0.65, 0.75], [0, 1, 1, 0]);

  const shadeOpacity = useTransform(scrollYProgress, [0.82, 1], [0, 1]);
  // Darkness starts heavy, lifts as user scrolls
  const lightReveal = useTransform(scrollYProgress, [0, 0.12, 0.3], [0.92, 0.5, 0]);

  if (reducedMotion) {
    return (
      <section className="relative h-svh min-h-[680px] bg-background">
        <div className="absolute inset-0 overflow-hidden">
          <HeroCanvas
            scrollProgress={scrollYProgress}
            reducedMotion={true}
            active={true}
          />
          <div className="pointer-events-none absolute inset-0 z-[3] bg-gradient-to-b from-black/50 via-transparent to-background" />
        </div>
        <div className="site-container relative z-10 flex h-full flex-col justify-center pb-7 pt-24 lg:pt-32">
          <h1 className="max-w-[1260px] font-display text-[clamp(4.5rem,12vw,12.5rem)] font-bold uppercase leading-[0.73] tracking-[-0.045em] text-foreground">
            <span className="block">Built</span>
            <span className="block pl-[8vw] text-silver">Beyond</span>
            <span className="display-outline block">Factory.</span>
          </h1>
          <div className="mt-8 flex max-w-2xl flex-col gap-7 md:ml-[8vw] md:flex-row md:items-end">
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
    <section ref={containerRef} className="relative h-[280vh] bg-background">
      {/* Sticky visual stage */}
      <div className="sticky top-0 h-svh min-h-[680px] overflow-hidden bg-background">
        {/* === Z-INDEX MAP ===
            z-[1]: precision-grid texture
            z-[2]: noise texture
            z-[3]: atmospheric gradients (vignette + top-to-bottom)
            z-[4]: background typography BUILT BEYOND (BEHIND transparent canvas)
            z-[5]: WebGL canvas (transparent — car occludes bg type naturally)
            z-[6]: darkness reveal overlay (above canvas)
            z-[7]: exit shade overlay (above canvas)
            z-10: main headline
            z-[12]: foreground FACTORY typography (IN FRONT of car)
            z-20: UI elements (intro, CTAs, annotations, side panel)
        */}

        {/* Atmospheric overlays — below everything */}
        <div className="precision-grid pointer-events-none absolute inset-0 z-[1] opacity-70" />
        <div className="noise-overlay pointer-events-none absolute inset-0 z-[2] opacity-[0.025]" />
        <div className="pointer-events-none absolute inset-0 z-[3] bg-[radial-gradient(circle_at_66%_46%,transparent_0%,rgba(3,4,5,0.08)_26%,rgba(3,4,5,0.8)_78%)]" />
        <div className="pointer-events-none absolute inset-0 z-[3] bg-gradient-to-b from-black/50 via-transparent to-background" />

        {/* BACKGROUND TYPOGRAPHY — behind the transparent canvas so the car occludes it */}
        <motion.div
          style={{ opacity: bgTypeOpacity, scale: bgTypeScale }}
          className="pointer-events-none absolute inset-0 z-[4] flex items-center justify-center overflow-hidden"
        >
          <div className="whitespace-nowrap font-display text-[clamp(8rem,22vw,28rem)] font-bold uppercase leading-[0.7] tracking-[-0.06em] text-white/[0.07]">
            BUILT BEYOND
          </div>
        </motion.div>

        {/* 3D Canvas — transparent, sits above bg typography */}
        <HeroCanvas
          scrollProgress={scrollYProgress}
          reducedMotion={reducedMotion}
          active={isInView}
        />

        {/* Darkness overlay — above canvas, fades out as scroll begins */}
        <motion.div
          style={{ opacity: lightReveal }}
          className="pointer-events-none absolute inset-0 z-[6] bg-background"
        />

        {/* Exit shade — above canvas */}
        <motion.div
          style={{ opacity: shadeOpacity }}
          className="pointer-events-none absolute inset-0 z-[7] bg-background"
        />

        {/* === INTRO OVERLAY (visible at rest, fades on scroll) === */}
        <motion.div
          style={{ opacity: introOpacity }}
          className="absolute inset-0 z-20 flex flex-col items-center justify-center"
        >
          <span className="technical-label mb-6">Cartunez / Automotive Performance</span>
          <h2 className="font-display text-[clamp(2rem,5vw,4.5rem)] font-bold uppercase leading-[0.85] tracking-[-0.03em] text-foreground">
            Unveil The Machine
          </h2>
        </motion.div>

        {/* Scroll prompt */}
        <motion.div
          style={{ opacity: scrollPromptOpacity }}
          className="absolute inset-x-0 bottom-12 z-20 flex flex-col items-center gap-3"
        >
          <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-silver-muted">
            Scroll to unveil
          </span>
          <div className="h-12 w-px bg-gradient-to-b from-cyan/60 to-transparent" />
        </motion.div>

        {/* === MAIN HEADLINE LAYER === */}
        <motion.div
          style={{ opacity: headlineOpacity, y: headlineY }}
          className="site-container absolute inset-0 z-10 flex flex-col justify-center pt-16 lg:pt-20"
        >
          <div className="flex items-center justify-between border-b border-white/[0.09] pb-4">
            <span className="technical-label">Automotive performance / India</span>
            <span className="hidden font-mono text-[9px] uppercase tracking-[0.2em] text-silver-muted md:block">
              Bespoke fitment system / CYZ-01
            </span>
          </div>

          <div className="flex flex-1 items-center py-8 lg:py-4">
            <h1 className="max-w-[1260px] font-display text-[clamp(4.5rem,12vw,12.5rem)] font-bold uppercase leading-[0.73] tracking-[-0.045em] text-foreground">
              <span className="block">Built</span>
              <span className="block pl-[8vw] text-silver">Beyond</span>
              <span className="display-outline block">Factory.</span>
            </h1>
          </div>
        </motion.div>

        {/* === FOREGROUND TYPOGRAPHY LAYER (in front of car) === */}
        <motion.div
          style={{ opacity: fgTypeOpacity, y: fgTypeY }}
          className="pointer-events-none absolute inset-x-0 bottom-[18%] z-[12] px-4 md:px-8"
        >
          <div className="mx-auto max-w-[1600px]">
            <p className="font-display text-[clamp(3rem,8vw,9rem)] font-bold uppercase leading-[0.75] tracking-[-0.04em] text-white/90">
              FACTORY.
            </p>
          </div>
        </motion.div>

        {/* === SUB-COPY + CTA === */}
        <motion.div
          style={{ opacity: subCopyOpacity }}
          className="absolute bottom-24 left-0 z-20 px-4 md:bottom-28 md:px-8 lg:left-[8vw]"
        >
          <p className="max-w-md text-base leading-relaxed text-silver-muted md:text-lg">
            Vehicle-specific accessories and performance upgrades, selected for exact fitment and finished to feel factory—only better.
          </p>
        </motion.div>

        <motion.div
          style={{ opacity: ctaOpacity }}
          className="absolute bottom-10 left-0 z-20 flex flex-wrap gap-3 px-4 md:bottom-12 md:px-8 lg:left-[8vw]"
        >
          <Button asChild size="lg">
            <Link href="/#vehicle-selector">
              Match my vehicle <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/builds">View builds</Link>
          </Button>
        </motion.div>

        {/* === TECHNICAL ANNOTATIONS === */}
        <motion.div
          style={{ opacity: techAnnotationsOpacity }}
          className="pointer-events-none absolute right-6 top-1/3 z-20 hidden flex-col gap-6 xl:flex"
        >
          {[
            { label: "CHASSIS", value: "OEM+" },
            { label: "POWERTRAIN", value: "TUNED" },
            { label: "AERO", value: "CFD" },
          ].map((item) => (
            <div key={item.label} className="text-right">
              <p className="font-mono text-[8px] uppercase tracking-[0.22em] text-cyan">{item.label}</p>
              <p className="font-display text-lg font-semibold text-foreground">{item.value}</p>
            </div>
          ))}
        </motion.div>

        {/* Side panel — glass info card */}
        <motion.aside
          style={{ opacity: subCopyOpacity }}
          className="glass-panel absolute bottom-10 right-10 z-20 hidden w-64 rounded-sm p-5 xl:block"
        >
          <div className="flex items-center justify-between font-mono text-[8px] uppercase tracking-[0.18em] text-silver-muted">
            <span>Live fitment engine</span>
            <span className="h-1.5 w-1.5 rounded-full bg-cyan shadow-[0_0_12px_var(--cyan)]" />
          </div>
          <div className="my-5 h-px bg-border" />
          <p className="font-display text-3xl font-semibold uppercase leading-none text-foreground">Precision first.</p>
          <p className="mt-3 text-sm leading-relaxed text-silver-muted">
            Select your exact make, model, year and variant before you shop.
          </p>
        </motion.aside>
      </div>
    </section>
  );
}
