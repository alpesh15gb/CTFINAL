"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { FilmGrain } from "./primitives";

/**
 * Cinematic → commerce handoff. The brand film dissolves into the buying experience:
 * giant CARTUNEZ wordmark drifts, a hairline sweeps, then EVERY CAR HAS A SPEC.
 */
export function CinematicBridge() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 95%", "end 45%"] });
  const wordX = useTransform(scrollYProgress, [0, 1], reduce ? ["0vw", "0vw"] : ["5vw", "-2vw"]);
  const lineX = useTransform(scrollYProgress, [0.15, 0.7], reduce ? [1, 1] : [0, 1]);
  const specOpacity = useTransform(scrollYProgress, [0.4, 0.85], [0, 1]);
  const specY = useTransform(scrollYProgress, [0.4, 0.85], reduce ? [0, 0] : [18, 0]);

  return (
    <section ref={ref} className="relative flex min-h-[62vh] flex-col justify-center overflow-hidden bg-[#020202]">
      <div className="site-container relative z-10">
        <motion.h2
          style={{ x: reduce ? 0 : wordX }}
          className="campaign-title whitespace-nowrap text-[clamp(3.5rem,11vw,11rem)] will-change-transform"
        >
          Cartunez
        </motion.h2>
        <div className="mt-6 md:mt-8">
          <motion.div style={{ scaleX: reduce ? 1 : lineX }} className="h-px w-44 origin-left bg-white/25" />
          <motion.p
            style={{ opacity: specOpacity, y: reduce ? 0 : specY }}
            className="mt-4 font-display text-[clamp(1.4rem,2.6vw,2.4rem)] font-medium uppercase tracking-wide text-white/85"
          >
            Every car has a spec.
          </motion.p>
          <motion.p style={{ opacity: specOpacity }} className="mt-3 max-w-md text-sm leading-relaxed text-white/50 md:text-base">
            Find your vehicle. We&apos;ll match every upgrade to exact fitment.
          </motion.p>
        </div>
      </div>
      <FilmGrain />
    </section>
  );
}
