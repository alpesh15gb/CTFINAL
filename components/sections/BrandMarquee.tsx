"use client";

import { Marquee } from "@/components/animations";

export function BrandMarquee() {
  const words = [
    "PERFORMANCE",
    "PRECISION",
    "CRAFT",
    "STANCE",
    "AERO",
    "CARBON",
    "FORGED",
    "CUSTOM",
  ];

  return (
    <section className="relative z-20 overflow-hidden border-y border-border bg-background py-8">
      <Marquee speed={40} gap="4rem">
        {words.map((word, i) => (
          <span
            key={`${word}-${i}`}
            className="flex items-center gap-16 font-display text-6xl font-bold uppercase tracking-tight text-foreground/10 md:text-8xl"
          >
            {word}
            <span className="inline-block h-4 w-4 rounded-full bg-cyan" />
          </span>
        ))}
      </Marquee>
    </section>
  );
}
