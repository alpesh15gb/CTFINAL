"use client";

import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface HorizontalScrollProps {
  children: React.ReactNode;
  className?: string;
  height?: string;
}

export function HorizontalScroll({
  children,
  className,
  height = "400vh",
}: HorizontalScrollProps) {
  const reducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-66.66%"]);

  useEffect(() => {
    if (reducedMotion) return;
  }, [reducedMotion]);

  if (reducedMotion) {
    return (
      <div className={cn("relative overflow-x-auto", className)}>
        <div className="flex gap-8 px-8">{children}</div>
      </div>
    );
  }

  return (
    <section ref={containerRef} className={cn("relative", className)} style={{ height }}>
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <motion.div ref={targetRef} style={{ x, willChange: "transform" }} className="flex gap-8 px-8">
          {children}
        </motion.div>
      </div>
    </section>
  );
}

interface HorizontalPanelProps {
  children: React.ReactNode;
  className?: string;
  width?: string;
}

export function HorizontalPanel({
  children,
  className,
  width = "80vw",
}: HorizontalPanelProps) {
  return (
    <div
      className={cn(
        "flex h-[70vh] flex-shrink-0 items-center justify-center rounded-2xl border border-border bg-raised p-12",
        className
      )}
      style={{ width }}
    >
      {children}
    </div>
  );
}
