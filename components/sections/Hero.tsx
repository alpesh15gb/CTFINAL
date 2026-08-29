"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
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

  const contentY = useTransform(scrollYProgress, [0, 1], [0, -72]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.76, 1], [1, 1, 0]);
  const contentScale = useTransform(scrollYProgress, [0, 1], [1, 0.97]);
  const panelX = useTransform(scrollYProgress, [0, 1], [0, 56]);
  const panelOpacity = useTransform(scrollYProgress, [0, 0.7, 1], [1, 1, 0]);
  const shadeOpacity = useTransform(scrollYProgress, [0.76, 1], [0, 0.82]);

  return (
    <section ref={containerRef} className="relative h-[145svh] min-h-[900px] bg-background">
      <div className="sticky top-0 h-svh min-h-[680px] overflow-hidden bg-background">
        <HeroCanvas
          scrollProgress={scrollYProgress}
          reducedMotion={reducedMotion}
          active={isInView}
        />

        <div className="precision-grid pointer-events-none absolute inset-0 z-[1] opacity-70" />
        <div className="noise-overlay pointer-events-none absolute inset-0 z-[2] opacity-[0.025]" />
        <div className="pointer-events-none absolute inset-0 z-[3] bg-[radial-gradient(circle_at_66%_46%,transparent_0%,rgba(3,4,5,0.08)_26%,rgba(3,4,5,0.8)_78%)]" />
        <div className="pointer-events-none absolute inset-0 z-[3] bg-gradient-to-b from-black/50 via-transparent to-background" />
        <motion.div
          style={{ opacity: shadeOpacity }}
          className="pointer-events-none absolute inset-0 z-[4] bg-background"
        />

        <motion.div
          style={{
            y: reducedMotion ? 0 : contentY,
            opacity: reducedMotion ? 1 : contentOpacity,
            scale: reducedMotion ? 1 : contentScale,
          }}
          className="site-container relative z-10 flex h-full flex-col pb-7 pt-24 lg:pb-9 lg:pt-32"
        >
          <div className="flex items-center justify-between border-b border-white/[0.09] pb-4">
            <span className="technical-label">Automotive performance / India</span>
            <span className="hidden font-mono text-[9px] uppercase tracking-[0.2em] text-silver-muted md:block">
              Bespoke fitment system / CYZ-01
            </span>
          </div>

          <div className="flex flex-1 flex-col justify-center py-8 lg:py-4">
            <motion.h1
              initial={reducedMotion ? false : { opacity: 0, y: 44 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-[1260px] font-display text-[clamp(4.5rem,12vw,12.5rem)] font-bold uppercase leading-[0.73] tracking-[-0.045em] text-foreground"
            >
              <span className="block">Built</span>
              <span className="block pl-[8vw] text-silver">Beyond</span>
              <span className="display-outline block">Factory.</span>
            </motion.h1>

            <motion.div
              initial={reducedMotion ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.42, ease: [0.16, 1, 0.3, 1] }}
              className="mt-8 flex max-w-2xl flex-col gap-7 md:ml-[8vw] md:mt-10 md:flex-row md:items-end"
            >
              <p className="max-w-md text-base leading-relaxed text-silver-muted md:text-lg">
                Vehicle-specific accessories and performance upgrades, selected for exact fitment and finished to feel factory—only better.
              </p>
              <div className="flex shrink-0 flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link href="/#vehicle-selector">
                    Match my vehicle <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/builds">View builds</Link>
                </Button>
              </div>
            </motion.div>
          </div>

          <div className="grid gap-3 border-t border-white/[0.09] pt-5 sm:grid-cols-3 lg:max-w-3xl">
            {[
              { icon: ShieldCheck, value: "98%", label: "Fitment accuracy" },
              { icon: Sparkles, value: "12K+", label: "Cars transformed" },
              { icon: ArrowRight, value: "2 YR", label: "Product warranty" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3 border-white/[0.08] sm:border-r sm:pr-5 last:border-r-0">
                <item.icon className="h-4 w-4 text-cyan" aria-hidden="true" />
                <div>
                  <p className="font-display text-xl font-semibold leading-none text-foreground">{item.value}</p>
                  <p className="mt-1 font-mono text-[8px] uppercase tracking-[0.16em] text-silver-muted">{item.label}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.aside
          style={{
            x: reducedMotion ? 0 : panelX,
            opacity: reducedMotion ? 1 : panelOpacity,
          }}
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

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.85, duration: 0.6 }}
          className="absolute bottom-8 right-5 z-20 flex items-center gap-3 font-mono text-[8px] uppercase tracking-[0.2em] text-silver-muted lg:right-10 xl:hidden"
        >
          Scroll to explore <ArrowDown className="h-4 w-4 animate-bounce text-cyan motion-reduce:animate-none" />
        </motion.div>
      </div>
    </section>
  );
}
