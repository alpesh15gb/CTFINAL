"use client";

import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  onClick?: () => void;
  as?: "button" | "a" | "div";
  href?: string;
}

export function MagneticButton({
  children,
  className,
  strength = 0.3,
  onClick,
  as: Component = "button",
  href,
}: MagneticButtonProps) {
  const reducedMotion = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { damping: 15, stiffness: 150 });
  const springY = useSpring(y, { damping: 15, stiffness: 150 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (reducedMotion || !ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - centerX) * strength;
    const deltaY = (e.clientY - centerY) * strength;

    x.set(deltaX);
    y.set(deltaY);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  const props = {
    ref: ref as any,
    className: cn("inline-flex cursor-pointer", className),
    onMouseMove: handleMouseMove,
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: handleMouseLeave,
    onClick,
    ...(href ? { href } : {}),
  };

  if (reducedMotion) {
    const Tag = Component;
    return <Tag {...props}>{children}</Tag>;
  }

  return (
    <motion.div
      style={{ x: springX, y: springY }}
      transition={{ type: "spring", damping: 15, stiffness: 150 }}
    >
      <Component {...props}>{children}</Component>
    </motion.div>
  );
}
