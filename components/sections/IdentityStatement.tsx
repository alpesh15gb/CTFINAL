"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function IdentityStatement() {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Phase-based animations for the pinned typography sequence
  const cartunezOpacity = useTransform(scrollYProgress, [0, 0.15, 0.45, 0.6], [0, 1, 1, 0]);
  const cartunezScale = useTransform(scrollYProgress, [0, 0.2], [0.85, 1]);
  const cartunezY = useTransform(scrollYProgress, [0, 0.2], [40, 0]);

  const statementOpacity = useTransform(scrollYProgress, [0.35, 0.5, 0.75, 0.9], [0, 1, 1, 0]);
  const statementY = useTransform(scrollYProgress, [0.35, 0.55], [50, 0]);

  const lineScaleX = useTransform(scrollYProgress, [0.3, 0.5], [0, 1]);

  const subOpacity = useTransform(scrollYProgress, [0.55, 0.7, 0.9, 1], [0, 1, 1, 0]);

  if (reducedMotion) {
    return (
      <section className="relative z-20 flex min-h-[60vh] items-center justify-center bg-background py-24">
        <div className="text-center">
          <h2 className="font-display text-[clamp(4rem,14vw,14rem)] font-bold uppercase leading-[0.7] tracking-[-0.06em] text-foreground">
            CARTUNEZ
          </h2>
          <div className="mx-auto my-6 h-px w-32 bg-cyan/40" />
          <p className="font-display text-[clamp(1.5rem,3vw,3rem)] font-medium uppercase tracking-wide text-silver">
            Built Beyond Factory
          </p>
          <p className="mt-6 max-w-md mx-auto text-sm text-silver-muted">
            Premium automotive accessories, customization, styling and performance upgrades engineered in India.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section ref={containerRef} className="relative z-20 h-[220vh] bg-background">
      <div className="sticky top-0 flex h-svh items-center justify-center overflow-hidden">
        {/* Subtle background texture */}
        <div className="noise-overlay pointer-events-none absolute inset-0 opacity-[0.02]" />
        <div className="atmo-glow pointer-events-none absolute inset-0 opacity-50" />

        {/* Oversized ghosted word behind everything */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="ghost-type select-none font-display text-[28vw] font-bold uppercase leading-none tracking-tighter">
            CTZ
          </span>
        </div>

        {/* Main content stack */}
        <div className="relative z-10 text-center px-4">
          {/* CARTUNEZ wordmark */}
          <motion.h2
            style={{
              opacity: cartunezOpacity,
              scale: cartunezScale,
              y: cartunezY,
            }}
            className="font-display text-[clamp(4rem,14vw,14rem)] font-bold uppercase leading-[0.7] tracking-[-0.06em] text-foreground"
          >
            CARTUNEZ
          </motion.h2>

          {/* Divider line */}
          <motion.div
            style={{ scaleX: lineScaleX }}
            className="mx-auto my-6 h-px w-48 origin-left bg-gradient-to-r from-transparent via-cyan/50 to-transparent md:w-72"
          />

          {/* Statement */}
          <motion.p
            style={{ opacity: statementOpacity, y: statementY }}
            className="font-display text-[clamp(1.5rem,3.5vw,3.5rem)] font-medium uppercase leading-[0.9] tracking-wide text-silver"
          >
            Built Beyond Factory
          </motion.p>

          {/* Supporting copy */}
          <motion.p
            style={{ opacity: subOpacity }}
            className="mx-auto mt-8 max-w-lg font-mono text-[10px] uppercase tracking-[0.2em] text-silver-muted md:text-[11px]"
          >
            Premium automotive accessories, customization, styling and performance upgrades engineered in India
          </motion.p>
        </div>
      </div>
    </section>
  );
}
