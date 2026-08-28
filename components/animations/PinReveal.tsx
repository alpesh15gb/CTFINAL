"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PinRevealProps {
  children: React.ReactNode;
  className?: string;
  height?: string;
}

export function PinReveal({ children, className, height = "300vh" }: PinRevealProps) {
  const reducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.8, 1, 1, 0.9]);
  const rotateX = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [15, 0, 0, -15]);

  if (reducedMotion) {
    return <div className={cn("relative", className)}>{children}</div>;
  }

  return (
    <section ref={ref} className={cn("relative", className)} style={{ height }}>
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        <motion.div
          style={{ opacity, scale, rotateX }}
          className="will-change-[opacity,scale,transform]"
        >
          {children}
        </motion.div>
      </div>
    </section>
  );
}
