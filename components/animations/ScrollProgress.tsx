"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function ScrollProgress() {
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  if (reducedMotion) return null;

  return (
    <motion.div
      className="fixed left-0 right-0 top-0 z-[60] h-[2px] origin-left bg-white/80"
      style={{ scaleX }}
      aria-hidden="true"
    />
  );
}
