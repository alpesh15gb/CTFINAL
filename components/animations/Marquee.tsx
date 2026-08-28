"use client";

import { motion } from "framer-motion";
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
  return (
    <div className={cn("flex overflow-hidden", className)}>
      <motion.div
        className="flex flex-shrink-0 items-center"
        style={{ gap }}
        animate={{
          x: direction === "left" ? ["0%", "-100%"] : ["-100%", "0%"],
        }}
        transition={{
          duration: speed,
          ease: "linear",
          repeat: Infinity,
        }}
      >
        {children}
        {children}
      </motion.div>
    </div>
  );
}
