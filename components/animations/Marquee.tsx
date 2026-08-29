"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MarqueeProps {
  children: React.ReactNode;
  className?: string;
  speed?: number;
  direction?: "left" | "right";
  gap?: string;
}

export function Marquee({
  children,
  className,
  speed = 30,
  direction = "left",
  gap = "2rem",
}: MarqueeProps) {
  const reducedMotion = useReducedMotion();

  return (
    <div className={cn("flex overflow-hidden", className)}>
      <motion.div
        className="flex w-max flex-shrink-0 items-center"
        animate={
          reducedMotion
            ? undefined
            : { x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"] }
        }
        transition={
          reducedMotion
            ? undefined
            : { duration: speed, ease: "linear", repeat: Infinity }
        }
      >
        <div className="flex shrink-0 items-center" style={{ gap, paddingRight: gap }}>
          {children}
        </div>
        <div className="flex shrink-0 items-center" style={{ gap, paddingRight: gap }} aria-hidden="true">
          {children}
        </div>
      </motion.div>
    </div>
  );
}
