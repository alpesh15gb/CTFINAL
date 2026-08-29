"use client";

import { Marquee } from "@/components/animations/Marquee";

const proofPoints = [
  ["01", "Exact fitment", "Matched to your variant"],
  ["02", "Premium material", "OEM-grade finishes"],
  ["03", "Expert install", "No-cut fitment options"],
  ["04", "Built to last", "Two-year warranty"],
];

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

export function BrandMarquee() {
  return (
    <section className="relative z-20 overflow-hidden border-y border-border bg-raised">
      <div className="site-container grid sm:grid-cols-2 lg:grid-cols-4">
        {proofPoints.map(([index, title, copy]) => (
          <div key={index} className="border-b border-border py-5 sm:px-5 sm:first:pl-0 lg:border-b-0 lg:border-r last:border-r-0">
            <div className="flex items-start gap-4">
              <span className="font-mono text-[9px] font-bold tracking-widest text-cyan">{index}</span>
              <div>
                <p className="font-display text-lg font-semibold uppercase tracking-wide text-foreground">{title}</p>
                <p className="mt-0.5 text-xs text-silver-muted">{copy}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-border py-5 md:py-7">
        <Marquee speed={34} gap="3.5rem">
          {words.map((word, index) => (
            <span
              key={`${word}-${index}`}
              className="flex items-center gap-14 whitespace-nowrap font-display text-5xl font-bold uppercase tracking-[-0.035em] text-white/[0.055] md:text-7xl"
            >
              {word}
              <span className="inline-block h-1.5 w-1.5 rotate-45 bg-cyan" />
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
