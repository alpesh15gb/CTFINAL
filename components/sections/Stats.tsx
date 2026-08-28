"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
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
    const duration = 600;
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
      initial={{ opacity: 0, y: 16 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={cn("font-display text-5xl font-bold text-foreground md:text-7xl", className)}
    >
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </motion.span>
  );
}

const stats = [
  { value: 12000, suffix: "+", label: "Cars Upgraded", description: "Across India", mode: "count" as const },
  { value: 98, suffix: "%", label: "Fitment Accuracy", description: "OEM-grade precision", mode: "reveal" as const },
  { value: 450, suffix: "+", label: "Products", description: "Curated catalog", mode: "count" as const },
  { value: 2, suffix: "yr", label: "Warranty", description: "On all products", mode: "reveal" as const },
];

export function Stats() {
  return (
    <section className="relative z-20 overflow-hidden bg-background pt-16 pb-24 md:pt-20 md:pb-32">
      {/* Dark macro automotive photography background */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1542377281-73d08e3a10aa?q=80&w=2400&auto=format&fit=crop"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-[0.08]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/70 to-background" />
      </div>

      {/* Ghosted oversized typography */}
      <div className="ghost-type pointer-events-none absolute inset-x-0 bottom-0 select-none text-center font-display text-[16vw] font-bold uppercase leading-none tracking-tighter">
        Engineered
      </div>

      <div className="atmo-glow pointer-events-none absolute inset-0" />

      <div className="relative mx-auto max-w-[1600px] px-4 md:px-8">
        <div className="mb-14 text-center">
          <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-[0.25em] text-cyan">
            By The Numbers
          </span>
          <h2 className="font-display text-4xl font-bold uppercase leading-[0.9] tracking-tight text-foreground md:text-6xl">
            Proven Performance.
          </h2>
        </div>

        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="relative text-center"
            >
              <div className="atmo-horizon absolute -top-6 left-1/2 w-24 -translate-x-1/2" />
              <AnimatedCounter
                end={stat.value}
                suffix={stat.suffix}
                mode={stat.mode}
                className="text-cyan"
              />
              <p className="mt-4 font-display text-xl font-semibold uppercase tracking-wide text-foreground">
                {stat.label}
              </p>
              <p className="mt-1 text-sm text-silver-muted">{stat.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
