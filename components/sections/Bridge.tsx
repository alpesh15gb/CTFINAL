"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { TEMPORARY_MACRO_ASSET } from "@/lib/heroConfig";

/**
 * Bridge Handoff — Predominantly dark transition:
 *   Residual macro texture gently dissolves behind CARTUNEZ as the thin precision
 *   light line sweeps across, then EVERY CAR HAS A SPEC. hands over cleanly to the VehicleSelector.
 */
export function Bridge() {
  const containerRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 90%", "center 40%"],
  });

  const bgMacroOpacity = useTransform(scrollYProgress, [0, 0.50], [0.16, 0]);
  const wordX = useTransform(scrollYProgress, [0, 1], ["6vw", "-1vw"]);
  const specOpacity = useTransform(scrollYProgress, [0.30, 0.85], [0, 1]);
  const specY = useTransform(scrollYProgress, [0.30, 0.85], [16, 0]);
  const lineScaleX = useTransform(scrollYProgress, [0.15, 0.70], [0, 1]);

  if (reducedMotion) {
    return (
      <section className="relative overflow-hidden bg-background py-20 md:py-28">
        <div className="site-container">
          <h2 className="whitespace-nowrap font-display text-[clamp(3.5rem,10vw,10rem)] font-bold uppercase leading-none tracking-[-0.04em] text-foreground">
            CARTUNEZ
          </h2>
          <div className="my-6 h-px w-40 bg-white/20" />
          <p className="font-display text-[clamp(1.3rem,2.4vw,2.2rem)] font-medium uppercase tracking-wide text-silver">
            Every car has a spec.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section ref={containerRef} className="relative flex h-[50vh] min-h-[420px] flex-col justify-center overflow-hidden bg-background">
      {/* Residual macro texture from hero dissolving behind CARTUNEZ */}
      <motion.div style={{ opacity: bgMacroOpacity }} className="pointer-events-none absolute inset-0 z-0">
        <Image
          src={TEMPORARY_MACRO_ASSET}
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-[38%_50%] brightness-[0.45] grayscale contrast-[1.25]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background" />
      </motion.div>

      <div className="site-container relative z-10">
        <motion.h2
          style={{ x: wordX }}
          className="whitespace-nowrap font-display text-[clamp(3.5rem,11vw,11rem)] font-bold uppercase leading-none tracking-[-0.04em] text-foreground will-change-transform"
        >
          CARTUNEZ
        </motion.h2>

        <div className="mt-6 md:mt-8">
          <motion.div
            style={{ scaleX: lineScaleX }}
            className="h-px w-44 origin-left bg-white/20"
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
