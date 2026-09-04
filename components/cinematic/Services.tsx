"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { EASE_CINEMATIC, FilmGrain, MaskText, SectionLabel } from "./primitives";

const SERVICES = [
  { n: "01", title: "Performance Tuning", img: "https://images.unsplash.com/photo-1489824904134-891ab64532f1?q=80&w=1600&auto=format&fit=crop", note: "ECU / Intake / Exhaust mapping" },
  { n: "02", title: "Exhaust Systems", img: "https://images.unsplash.com/photo-1614026480209-cd9934144671?q=80&w=1600&auto=format&fit=crop", note: "Valved / Titanium / Carbon" },
  { n: "03", title: "Aero", img: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=1600&auto=format&fit=crop", note: "Splitters / Wings / Diffusers" },
  { n: "04", title: "Suspension", img: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?q=80&w=1600&auto=format&fit=crop", note: "Coilovers / Air / Alignment" },
  { n: "05", title: "Bespoke Builds", img: "https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=1600&auto=format&fit=crop", note: "One of one commissions" },
];

/**
 * Services index — understated rows. Desktop: photographic preview follows hover.
 * Mobile: rows link straight to the shop.
 */
export function Services() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section className="relative overflow-hidden bg-[#020202] py-28 md:py-44">
      <div className="site-container">
        <SectionLabel>What we do</SectionLabel>
        <MaskText className="campaign-title mt-6 text-[clamp(4rem,9vw,10rem)]" lines={["Capability,"]} />
        <div className="relative mt-12 md:mt-16" onMouseLeave={() => setActive(null)}>
          {/* Floating preview (desktop) */}
          <AnimatePresence>
            {active !== null && (
              <motion.div
                key={active}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.45, ease: EASE_CINEMATIC }}
                aria-hidden
                className="pointer-events-none absolute right-[4%] top-1/2 z-10 hidden w-[34vw] max-w-[460px] -translate-y-1/2 overflow-hidden lg:block"
              >
                <img
                  src={SERVICES[active].img}
                  alt=""
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover brightness-[0.55] contrast-[1.1] saturate-[0.1]"
                />
              </motion.div>
            )}
          </AnimatePresence>

          <ul className="border-t border-white/10">
            {SERVICES.map((s, i) => (
              <li key={s.n} className="border-b border-white/10">
                <Link
                  href="/shop"
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  className="group flex items-baseline gap-5 py-6 transition-colors md:gap-10 md:py-8"
                >
                  <span className="font-mono text-[10px] tracking-[0.3em] text-white/40">{s.n}</span>
                  <span className="campaign-title flex-1 text-[clamp(2.2rem,5.5vw,5rem)] text-white/85 transition-colors duration-300 group-hover:text-white">
                    {s.title}
                  </span>
                  <span className="hidden font-mono text-[10px] uppercase tracking-[0.24em] text-white/40 md:block">
                    {s.note}
                  </span>
                  <ArrowUpRight
                    className="h-6 w-6 shrink-0 self-center text-white/30 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-white"
                    aria-hidden
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <FilmGrain />
    </section>
  );
}
