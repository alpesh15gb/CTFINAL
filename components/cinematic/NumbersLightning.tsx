"use client";

import { AnimatedCounter, FilmGrain, MaskText, SectionLabel } from "./primitives";

const STATS: Array<{ value: number; decimals?: number; prefix?: string; suffix?: string; label: string }> = [
  { value: 820, label: "HP" },
  { value: 2.7, decimals: 1, label: "0—100 KM/H" },
  { value: 320, label: "KM/H V-MAX" },
  { value: 38, prefix: "+", suffix: "%", label: "Power" },
];

/** GET YOUR CAR ROLLING IN STYLE — large typography separated by thin rules. No cards. */
export function NumbersLightning() {
  return (
    <section className="relative overflow-hidden bg-[#020202] py-28 md:py-44">
      <div className="site-container relative">
        <SectionLabel>Cartunez / Performance</SectionLabel>
        <MaskText
          className="campaign-title mt-6 text-[clamp(4.5rem,10vw,11rem)]"
          lines={["Get your car", <span key="w" className="text-white/85">rolling in</span>, "style!"]}
        />
        <div className="mt-16 grid grid-cols-2 border-t border-white/10 md:mt-24 lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="border-b border-r border-white/10 px-6 py-8 last:border-r-0 md:py-12 lg:px-10 [&:nth-child(2)]:border-r-0 lg:[&:nth-child(2)]:border-r">
              <AnimatedCounter
                to={s.value}
                decimals={s.decimals ?? 0}
                prefix={s.prefix ?? ""}
                suffix={s.suffix ?? ""}
                className="campaign-title block text-[clamp(3.2rem,6.5vw,6.5rem)]"
              />
              <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.3em] text-white/50">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
      <FilmGrain />
    </section>
  );
}
