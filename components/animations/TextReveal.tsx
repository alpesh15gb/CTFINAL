"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

interface TextRevealProps {
  children: string;
  className?: string;
  by?: "word" | "char";
  stagger?: number;
  duration?: number;
  threshold?: number;
  once?: boolean;
}

export function TextReveal({
  children,
  className,
  by = "word",
  stagger = 0.02,
  duration = 0.5,
  threshold = 0.3,
  once = true,
}: TextRevealProps) {
  const reducedMotion = useReducedMotion();
  const controls = useAnimation();
  const ref = useRef<HTMLSpanElement>(null);

  const items = by === "word" ? children.split(" ") : children.split("");

  useEffect(() => {
    if (reducedMotion || !ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          controls.start("visible");
          if (once) observer.unobserve(entry.target);
        } else if (!once) {
          controls.start("hidden");
        }
      },
      { threshold }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [controls, threshold, once, reducedMotion]);

  if (reducedMotion) {
    return <span className={className}>{children}</span>;
  }

  return (
    <span ref={ref} className={cn("inline-flex flex-wrap", className)} aria-label={children}>
      {items.map((item, i) => (
        <motion.span
          key={`${item}-${i}`}
          className="inline-block overflow-hidden"
          aria-hidden="true"
        >
          <motion.span
            className="inline-block"
            variants={{
              hidden: { y: "110%", opacity: 0 },
              visible: {
                y: 0,
                opacity: 1,
                transition: {
                  duration,
                  delay: i * stagger,
                  ease: [0.16, 1, 0.3, 1],
                },
              },
            }}
            initial="hidden"
            animate={controls}
          >
            {item}
            {by === "word" && i < items.length - 1 && "\u00A0"}
          </motion.span>
        </motion.span>
      ))}
    </span>
  );
}
