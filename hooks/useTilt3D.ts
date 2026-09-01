"use client";

import { useRef, useCallback, MouseEvent } from "react";
import { useMotionValue, useSpring, useTransform } from "framer-motion";

interface Tilt3DOptions {
  maxTilt?: number;
  perspective?: number;
  scale?: number;
  speed?: number;
  glare?: boolean;
}

/**
 * Luxury 3D perspective tilt hook for automotive showcase cards and wheel decks.
 * Smoothly calculates rotateX, rotateY, dynamic glare mesh, and spring damping.
 */
export function useTilt3D({
  maxTilt = 12,
  scale = 1.02,
  glare = true,
}: Tilt3DOptions = {}) {
  const ref = useRef<HTMLDivElement | null>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 220, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 220, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [maxTilt, -maxTilt]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-maxTilt, maxTilt]);
  const cardScale = useTransform(mouseXSpring, [-0.5, 0, 0.5], [scale, 1, scale]);

  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], [0, 100]);
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], [0, 100]);

  const handleMouseMove = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const xPct = mouseX / width - 0.5;
      const yPct = mouseY / height - 0.5;

      x.set(xPct);
      y.set(yPct);
    },
    [x, y]
  );

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return {
    ref,
    rotateX,
    rotateY,
    scale: cardScale,
    glareX,
    glareY,
    handleMouseMove,
    handleMouseLeave,
    glare,
  };
}
