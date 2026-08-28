"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface StaggerGridProps {
  children: React.ReactNode[];
  className?: string;
  columns?: string;
  gap?: string;
  staggerDelay?: number;
  animation?: "fadeUp" | "scaleIn" | "slideIn";
}

export function StaggerGrid({
  children,
  className,
  columns = "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
  gap = "gap-6",
  staggerDelay = 0.08,
  animation = "fadeUp",
}: StaggerGridProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    fadeUp: {
      hidden: { opacity: 0, y: 30 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
      },
    },
    scaleIn: {
      hidden: { opacity: 0, scale: 0.9 },
      visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
      },
    },
    slideIn: {
      hidden: { opacity: 0, x: -20 },
      visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
      },
    },
  };

  return (
    <motion.div
      className={cn("grid", columns, gap, className)}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
    >
      {children.map((child, i) => (
        <motion.div key={i} variants={itemVariants[animation]}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}
