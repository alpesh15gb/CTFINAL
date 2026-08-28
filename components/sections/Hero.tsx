"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ChevronDown, Wrench } from "lucide-react";
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
    <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-raised">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-16 w-16 animate-pulse rounded-full border-2 border-cyan/20" />
      </div>
    </div>
  );
}

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Title enters quickly, holds, and exits gently (never collapses to a thin strip)
  const titleOpacity = useTransform(scrollYProgress, [0, 0.08, 0.8, 1], [0, 1, 1, 0]);
  const titleY = useTransform(scrollYProgress, [0, 0.08, 1], [80, 0, -60]);
  const titleScale = useTransform(scrollYProgress, [0, 0.08, 1], [0.9, 1, 0.98]);

  const eyebrowOpacity = useTransform(scrollYProgress, [0, 0.06, 0.85, 1], [0, 1, 1, 0]);
  const eyebrowY = useTransform(scrollYProgress, [0, 0.06], [20, 0]);

  const copyOpacity = useTransform(scrollYProgress, [0.05, 0.14, 0.75, 0.95], [0, 1, 1, 0]);
  const copyY = useTransform(scrollYProgress, [0.05, 0.14], [30, 0]);

  // Overlay only darkens in the final moment as the next section enters
  const overlayOpacity = useTransform(scrollYProgress, [0.9, 1], [0, 0.6]);
  const ctaOpacity = useTransform(scrollYProgress, [0.06, 0.18, 0.75, 0.95], [0, 1, 1, 0]);

  // Persistent atmospheric glow connecting hero to next section
  const glowOpacity = useTransform(scrollYProgress, [0, 0.3, 1], [0.4, 0.6, 0.8]);

  return (
    <section ref={containerRef} className="relative h-[130vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-background">
        {/* 3D Scene */}
        <HeroCanvas scrollProgress={scrollYProgress} reducedMotion={reducedMotion} />

        {/* Subtle atmospheric glow */}
        <motion.div
          style={{ opacity: reducedMotion ? 0.5 : glowOpacity }}
          className="atmo-glow pointer-events-none absolute inset-0 z-10"
        />

        {/* Dark gradient overlays for text legibility */}
        <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-background/60 via-transparent to-background/70" />
        <motion.div
          style={{ opacity: overlayOpacity }}
          className="pointer-events-none absolute inset-0 z-10 bg-background"
        />

        {/* Content */}
        <div className="relative z-20 flex h-full flex-col justify-between px-4 md:px-8">
          <div className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col justify-center pt-20">
            {/* Eyebrow */}
            <motion.div
              style={{ opacity: reducedMotion ? 1 : eyebrowOpacity, y: reducedMotion ? 0 : eyebrowY }}
              className="mb-4 flex items-center gap-3"
            >
              <span className="h-px w-8 bg-cyan" />
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan">
                Cartunez Performance Accessories
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              style={{
                opacity: titleOpacity,
                y: reducedMotion ? 0 : titleY,
                scale: reducedMotion ? 1 : titleScale,
              }}
              className="font-display text-[clamp(4rem,13vw,13rem)] font-bold uppercase leading-[0.85] tracking-tight text-foreground"
            >
              <span className="block">Tune</span>
              <span className="block text-silver">Your</span>
              <span className="block text-transparent" style={{ WebkitTextStroke: "1.5px rgba(242,242,242,0.85)" }}>
                Drive.
              </span>
            </motion.h1>

            {/* Supporting copy */}
            <motion.p
              style={{ opacity: reducedMotion ? 1 : copyOpacity, y: reducedMotion ? 0 : copyY }}
              className="mt-6 max-w-md text-base leading-relaxed text-silver-muted md:text-lg"
            >
              Premium accessories, styling and performance upgrades built around
              your ride.
            </motion.p>

            {/* CTAs */}
            <motion.div
              style={{ opacity: reducedMotion ? 1 : ctaOpacity }}
              className="mt-8 flex flex-wrap items-center gap-4"
            >
              <Button asChild size="lg" className="bg-cyan text-black hover:bg-cyan-light">
                <Link href="/shop" className="gap-2">
                  Find Accessories
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-border bg-transparent text-foreground hover:border-cyan hover:text-cyan"
              >
                <Link href="/builds" className="gap-2">
                  Explore Builds
                </Link>
              </Button>
            </motion.div>
          </div>

          {/* Bottom bar */}
          <div className="mx-auto flex w-full max-w-[1600px] items-end justify-between pb-8">
            <motion.div
              style={{ opacity: reducedMotion ? 1 : ctaOpacity }}
              className="hidden items-center gap-3 md:flex"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-cyan">
                <Wrench className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-silver-muted">
                  Fitment First
                </p>
                <p className="text-sm font-medium text-foreground">
                  Parts matched to your car
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.2, duration: 0.6 }}
              className="flex flex-col items-center gap-2 text-silver-muted"
            >
              <span className="text-[10px] uppercase tracking-[0.2em]">Scroll to tune</span>
              <ChevronDown className="h-4 w-4 animate-bounce" />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
