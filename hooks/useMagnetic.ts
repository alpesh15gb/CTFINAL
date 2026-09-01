"use client";

import { useRef, useState, useCallback, MouseEvent } from "react";
import { useSpring, useMotionValue } from "framer-motion";

interface MagneticOptions {
  distance?: number;
  strength?: number;
  damping?: number;
  stiffness?: number;
}

/**
 * High-performance magnetic hover micro-interaction hook using Framer Motion springs.
 * Ideal for capsule nav items, floating cart buttons, and interactive CTA pills.
 */
export function useMagnetic({
  distance = 60,
  strength = 0.35,
  damping = 15,
  stiffness = 150,
}: MagneticOptions = {}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  const x = useSpring(rawX, { damping, stiffness });
  const y = useSpring(rawY, { damping, stiffness });

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;
      const dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      if (dist < distance) {
        rawX.set(deltaX * strength);
        rawY.set(deltaY * strength);
        setIsHovered(true);
      } else {
        rawX.set(0);
        rawY.set(0);
        setIsHovered(false);
      }
    },
    [distance, strength, rawX, rawY]
  );

  const handleMouseLeave = useCallback(() => {
    rawX.set(0);
    rawY.set(0);
    setIsHovered(false);
  }, [rawX, rawY]);

  return {
    ref,
    x,
    y,
    isHovered,
    handleMouseMove,
    handleMouseLeave,
  };
}
