"use client";

import { useRef, type ReactNode } from "react";
import {
  motion,
  useReducedMotion as useFramerReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";

/** Cinematic motion language — heavy, controlled, film-like. No bounce, no overshoot. */
export const EASE_CINEMATIC = [0.22, 1, 0.36, 1] as const;
export const EASE_UI = [0.16, 1, 0.3, 1] as const;

/* ---------------------------------- MaskText --------------------------------- */

function MaskLine({
  children,
  delay = 0,
  duration = 0.9,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}) {
  return (
    <motion.span
      className={`clip-mask ${className}`}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
    >
      <motion.span
        className="block will-change-transform"
        variants={{
          hidden: { y: "112%", opacity: 0 },
          show: { y: "0%", opacity: 1, transition: { duration, delay, ease: EASE_CINEMATIC } },
        }}
      >
        {children}
      </motion.span>
    </motion.span>
  );
}

/** Poster-scale masked headline. Lines rise through masks with a stagger. */
export function MaskText({
  lines,
  className = "",
  lineClassName = "",
  delay = 0,
  stagger = 0.1,
}: {
  lines: ReactNode[];
  className?: string;
  lineClassName?: string;
  delay?: number;
  stagger?: number;
}) {
  return (
    <span className={`block ${className}`}>
      {lines.map((line, i) => (
        <MaskLine key={i} delay={delay + i * stagger} className={lineClassName}>
          {line}
        </MaskLine>
      ))}
    </span>
  );
}

/* -------------------------------- SectionLabel ------------------------------- */

/** Tiny mono microcopy — eyebrow metadata. Always secondary, never competing. */
export function SectionLabel({
  children,
  className = "",
  align = "left",
}: {
  children: ReactNode;
  className?: string;
  align?: "left" | "center" | "right";
}) {
  const alignCls = align === "center" ? "justify-center text-center" : align === "right" ? "justify-end text-right" : "justify-start";
  return (
    <motion.p
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.7, ease: EASE_UI }}
      className={`flex items-center gap-3 font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-white/55 md:text-[11px] ${alignCls} ${className}`}
    >
      {children}
    </motion.p>
  );
}

/* --------------------------------- FilmGrain --------------------------------- */

/** Extremely subtle grain overlay. opacity 0.02–0.045. pointer-events-none. */
export function FilmGrain({ opacity = 0.035, className = "" }: { opacity?: number; className?: string }) {
  return (
    <div aria-hidden className={`film-grain pointer-events-none absolute inset-0 z-[40] ${className}`} style={{ opacity }} />
  );
}

/* ------------------------------- AnimatedCounter ------------------------------ */

export function AnimatedCounter({
  to,
  decimals = 0,
  prefix = "",
  suffix = "",
  duration = 1.6,
  className = "",
}: {
  to: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useFramerReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 92%", "start 55%"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 42, damping: 20 });
  const display = useTransform(smooth, (v) => {
    const val = reduce ? to : to * Math.min(1, Math.max(0, v));
    return `${prefix}${val.toFixed(decimals)}${suffix}`;
  });
  return (
    <span ref={ref} className={className}>
      <motion.span>{display}</motion.span>
    </span>
  );
}

/* -------------------------------- ParallaxMedia ------------------------------- */

/** Scroll-linked image treatment: slow settle scale 1.08 → 1 + gentle y drift. */
export function ParallaxMedia({
  children,
  className = "",
  fromScale = 1.08,
  toScale = 1,
  drift = "5%",
}: {
  children: ReactNode;
  className?: string;
  fromScale?: number;
  toScale?: number;
  drift?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useFramerReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [fromScale, toScale]);
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : [drift, `-${drift}`]);
  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div style={{ scale, y }} className="h-full w-full will-change-transform">
        {children}
      </motion.div>
    </div>
  );
}

/* --------------------------------- StickyScene -------------------------------- */

/** Tall scroll driver + sticky full-viewport stage. */
export function StickyScene({
  height = "300vh",
  children,
  className = "",
  stageClassName = "",
  onProgress,
}: {
  height?: string;
  children: (progress: MotionValue<number>) => ReactNode;
  className?: string;
  stageClassName?: string;
  onProgress?: (progress: MotionValue<number>) => void;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useFramerReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 26, mass: 0.4 });
  if (onProgress) onProgress(progress);
  void reduce;
  return (
    <section ref={ref} className={`relative ${className}`} style={{ height }}>
      <div className={`sticky top-0 h-svh min-h-[620px] overflow-hidden ${stageClassName}`}>{children(progress)}</div>
    </section>
  );
}

/* ------------------------------- ScrollReveal -------------------------------- */

/** Minimal fade-rise for supporting copy. Keeps typography subordinate to imagery. */
export function ScrollReveal({
  children,
  delay = 0,
  y = 26,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.85, delay, ease: EASE_CINEMATIC }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
