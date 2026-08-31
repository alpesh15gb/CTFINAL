"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * The handoff: hero blowout decays, CARTUNEZ sweeps horizontally and locks
 * as the identity line, then EVERY CAR HAS A SPEC. hands over to the
 * VehicleSelector. Replaces the old standalone 220vh IdentityStatement.
 */
export function Bridge() {
  const containerRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const streakOpacity = useTransform(scrollYProgress, [0.52, 0.68], [0.92, 0]);
  const wordX = useTransform(scrollYProgress, [0.5, 0.72], ["16vw", "-1vw"]);
  const specOpacity = useTransform(scrollYProgress, [0.72, 0.86], [0, 1]);
  const specY = useTransform(scrollYProgress, [0.72, 0.86], [24, 0]);
  const lineScaleX = useTransform(scrollYProgress, [0.66, 0.84], [0, 1]);

  if (reducedMotion) {
    return (
      <section className="relative overflow-hidden bg-background py-20 md:py-24">
        <div className="site-container">
          <h2 className="whitespace-nowrap font-display text-[clamp(4rem,11vw,11rem)] font-bold uppercase leading-none tracking-[-0.04em] text-foreground">
            CARTUNEZ
          </h2>
          <div className="my-6 h-px w-40 bg-white/20" />
          <p className="font-display text-[clamp(1.4rem,2.6vw,2.4rem)] font-medium uppercase tracking-wide text-silver">
            Every car has a spec.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section ref={containerRef} className="relative h-[48vh] overflow-hidden bg-background">
      {/* Blowout decay — seamless continuation of the hero's white streak */}
      <motion.div
        style={{ opacity: streakOpacity }}
        className="pointer-events-none absolute inset-0 z-20 bg-white"
      />

      <div className="flex h-full flex-col justify-center">
        <motion.h2
          style={{ x: wordX }}
          className="whitespace-nowrap font-display text-[clamp(4.5rem,14vw,15rem)] font-bold uppercase leading-none tracking-[-0.04em] text-foreground will-change-transform"
        >
          CARTUNEZ
        </motion.h2>

        <div className="site-container mt-6 md:mt-8">
          <motion.div
            style={{ scaleX: lineScaleX }}
            className="h-px w-44 origin-left bg-white/25"
          />
          <motion.p
            style={{ opacity: specOpacity, y: specY }}
            className="mt-4 font-display text-[clamp(1.3rem,2.4vw,2.2rem)] font-medium uppercase tracking-wide text-silver"
          >
            Every car has a spec.
          </motion.p>
        </div>
      </div>
    </section>
  );
}
