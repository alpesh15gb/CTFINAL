"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedCounterProps {
  end: number;
  suffix?: string;
  prefix?: string;
  className?: string;
  mode?: "count" | "reveal";
}

function AnimatedCounter({
  end,
  suffix = "",
  prefix = "",
  className,
  mode = "count",
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [count, setCount] = useState(mode === "count" ? Math.floor(end * 0.7) : end);

  useEffect(() => {
    if (!isInView || mode !== "count") return;

    const start = Math.floor(end * 0.7);
    const duration = 800;
    let startTime: number;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(start + eased * (end - start)));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [isInView, end, mode]);

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={cn("font-display text-[clamp(4rem,10vw,9rem)] font-bold leading-none text-foreground", className)}
    >
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </motion.span>
  );
}

const stats = [
  { value: 12000, suffix: "+", label: "Cars Transformed", description: "Across India", mode: "count" as const },
  { value: 98, suffix: "%", label: "Fitment Accuracy", description: "OEM-grade precision", mode: "reveal" as const },
  { value: 450, suffix: "+", label: "Products", description: "Curated catalog", mode: "count" as const },
  { value: 2, suffix: " YR", label: "Warranty", description: "On all products", mode: "reveal" as const },
];

export function Stats() {
  return (
    <section className="relative z-20 overflow-hidden bg-background py-24 md:py-32 lg:py-40">
      {/* Subtle background texture */}
      <div className="noise-overlay pointer-events-none absolute inset-0 opacity-[0.015]" />

      {/* Oversized ghosted typography */}
      <div className="ghost-type pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 select-none text-center font-display text-[20vw] font-bold uppercase leading-none tracking-tighter opacity-40">
        TELEMETRY
      </div>

      <div className="relative mx-auto max-w-[1600px] px-4 md:px-8">
        {/* Header — minimal */}
        <div className="mb-16 flex items-end justify-between border-b border-white/[0.06] pb-6">
          <div>
            <span className="mb-2 inline-block font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-cyan">
              Performance Data
            </span>
            <h2 className="font-display text-4xl font-bold uppercase leading-[0.9] tracking-tight text-foreground md:text-6xl">
              By The Numbers.
            </h2>
          </div>
          <span className="hidden font-mono text-[9px] uppercase tracking-[0.2em] text-silver-muted md:block">
            Live metrics / Verified
          </span>
        </div>

        {/* Stats grid — telemetry aesthetic */}
        <div className="grid gap-0 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group relative border-l border-white/[0.06] py-10 pl-8 first:border-l-0 first:pl-0 md:py-14 md:pl-10"
            >
              {/* Status indicator */}
              <div className="absolute left-0 top-10 hidden h-2 w-2 -translate-x-1/2 rounded-full bg-cyan/60 group-first:hidden lg:block" />

              <AnimatedCounter
                end={stat.value}
                suffix={stat.suffix}
                mode={stat.mode}
              />
              <p className="mt-4 font-display text-lg font-semibold uppercase tracking-wide text-foreground">
                {stat.label}
              </p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.15em] text-silver-muted">
                {stat.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
