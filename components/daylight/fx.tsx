"use client";

import {
  animate,
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

/**
 * Daylight motion primitives — scroll-linked parallax + entrances.
 * Transform/opacity only. Every primitive renders its final static state
 * under prefers-reduced-motion.
 */

export const EASE_CINEMATIC = [0.22, 1, 0.36, 1] as const;

/** Progress of `ref` travelling through the viewport (enter → leave). */
export function useSectionProgress(ref: React.RefObject<HTMLElement | null>) {
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  return scrollYProgress;
}

/** Progress of a pinned/sticky section (top pinned → released). */
export function usePinnedProgress(ref: React.RefObject<HTMLElement | null>) {
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  return scrollYProgress;
}

/** Scroll-linked vertical drift. */
export function Drift({
  progress,
  from = 70,
  to = -70,
  className,
  children,
}: {
  progress: MotionValue<number>;
  from?: number;
  to?: number;
  className?: string;
  children: ReactNode;
}) {
  const y = useTransform(progress, [0, 1], [from, to]);
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}

/** Scroll-linked settle zoom (photo open → rest). */
export function Zoom({
  progress,
  from = 1.12,
  to = 1.02,
  className,
  children,
}: {
  progress: MotionValue<number>;
  from?: number;
  to?: number;
  className?: string;
  children: ReactNode;
}) {
  const scale = useTransform(progress, [0, 1], [from, to]);
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div style={{ scale }} className={className}>
      {children}
    </motion.div>
  );
}

/** Fade-and-exit block driven by a custom progress window. */
export function FadeWindow({
  progress,
  range,
  y = -110,
  className,
  children,
}: {
  progress: MotionValue<number>;
  range: [number, number];
  y?: number;
  className?: string;
  children: ReactNode;
}) {
  const opacity = useTransform(progress, [range[0], range[1]], [1, 0]);
  const yy = useTransform(progress, [range[0], range[1]], [0, y]);
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div style={{ opacity, y: yy }} className={className}>
      {children}
    </motion.div>
  );
}

/** One-shot rise-in on entering the viewport. */
export function Reveal({
  delay = 0,
  y = 28,
  className,
  children,
}: {
  delay?: number;
  y?: number;
  className?: string;
  children: ReactNode;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      data-reveal
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.9, delay, ease: [...EASE_CINEMATIC] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Masked line rises — the editorial headline treatment. */
export function MaskLines({
  lines,
  className = "",
  lineClassName = "",
  stagger = 0.09,
  animateOnMount = false,
}: {
  lines: ReactNode[];
  className?: string;
  lineClassName?: string;
  stagger?: number;
  /** Above-the-fold hero: animate on mount instead of viewport detection. */
  animateOnMount?: boolean;
}) {
  const reduce = useReducedMotion();
  if (reduce) {
    return (
      <div className={className}>
        {lines.map((line, i) => (
          <span key={i} className={`block ${lineClassName}`}>
            {line}
          </span>
        ))}
      </div>
    );
  }
  return (
    <div className={className}>
      {lines.map((line, i) => (
        <span key={i} className="clip-mask block">
          <motion.span
            className={`block will-change-transform ${lineClassName}`}
            initial={{ y: "112%" }}
            {...(animateOnMount
              ? {
                  animate: { y: "0%" },
                  transition: {
                    duration: 1.1,
                    delay: 0.35 + i * stagger,
                    ease: [...EASE_CINEMATIC],
                  },
                }
              : {
                  whileInView: { y: "0%" },
                  viewport: { once: true, margin: "-60px" },
                  transition: {
                    duration: 1,
                    delay: i * stagger,
                    ease: [...EASE_CINEMATIC],
                  },
                })}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </div>
  );
}

/** Seamless CSS marquee. Duplicate content x2 for the loop. */
export function Marquee({
  duration = 32,
  className = "",
  children,
}: {
  duration?: number;
  className?: string;
  children: ReactNode;
}) {
  const reduce = useReducedMotion();
  if (reduce) {
    return (
      <div className={`overflow-hidden ${className}`}>
        <div className="flex w-max items-center">{children}</div>
      </div>
    );
  }
  return (
    <div className={`group overflow-hidden ${className}`}>
      <div
        className="animate-marquee flex w-max items-center group-hover:[animation-play-state:paused]"
        style={{ animationDuration: `${duration}s` }}
      >
        {children}
        <div aria-hidden="true" className="flex items-center">
          {children}
        </div>
      </div>
    </div>
  );
}

/** Animated counter that runs once on entering view. */
export function CountUp({
  to,
  prefix = "",
  suffix = "",
  className = "",
}: {
  to: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setVal(to);
      return;
    }
    const controls = animate(0, to, {
      duration: 1.6,
      ease: [...EASE_CINEMATIC],
      onUpdate: (v) => setVal(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, to, reduce]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {val.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
}
