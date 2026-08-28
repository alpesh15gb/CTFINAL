"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ImageRevealProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: string;
  revealOnScroll?: boolean;
  direction?: "up" | "down" | "left" | "right" | "center";
  parallax?: number;
  sizes?: string;
}

export function ImageReveal({
  src,
  alt,
  className,
  aspectRatio = "aspect-[4/3]",
  revealOnScroll = true,
  direction = "up",
  parallax = 0,
  sizes = "(max-width: 768px) 100vw, 50vw",
}: ImageRevealProps) {
  const reducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const clipPath = useTransform(scrollYProgress, [0, 0.3], getClipPath(direction));
  const y = useTransform(scrollYProgress, [0, 1], [parallax, -parallax]);

  if (reducedMotion || !revealOnScroll) {
    return (
      <div ref={ref} className={cn("relative overflow-hidden", aspectRatio, className)}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div ref={ref} className={cn("relative overflow-hidden", aspectRatio, className)}>
      <motion.div className="absolute inset-0" style={{ clipPath, y }}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          className="object-cover will-change-[clip-path]"
        />
      </motion.div>
    </div>
  );
}

function getClipPath(direction: string): [string, string] {
  switch (direction) {
    case "up":
      return ["inset(100% 0 0 0)", "inset(0 0 0 0)"];
    case "down":
      return ["inset(0 0 100% 0)", "inset(0 0 0 0)"];
    case "left":
      return ["inset(0 0 0 100%)", "inset(0 0 0 0)"];
    case "right":
      return ["inset(0 100% 0 0)", "inset(0 0 0 0)"];
    case "center":
      return ["inset(50% 50% 50% 50%)", "inset(0 0 0 0)"];
    default:
      return ["inset(100% 0 0 0)", "inset(0 0 0 0)"];
  }
}
