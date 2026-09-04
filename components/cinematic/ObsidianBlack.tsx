"use client";

import { MaskText, ParallaxMedia, FilmGrain, ScrollReveal } from "./primitives";

/** OBSIDIAN BLACK — isolated finish scene. Near-black, restrained metadata. */
export function ObsidianBlack() {
  return (
    <section className="relative overflow-hidden bg-[#020202] py-28 md:py-40">
      <div className="site-container">
        <MaskText
          className="campaign-title text-[clamp(4.5rem,10vw,11rem)]"
          lines={["Obsidian", <span key="b" className="text-white/85">black.</span>]}
        />
      </div>
      <ParallaxMedia className="relative mx-auto mt-12 aspect-[16/10] w-[94%] max-w-[1600px] md:mt-16" fromScale={1.08} toScale={1} drift="3%">
        <img
          src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2400&auto=format&fit=crop"
          alt="Coupe standing under a single light in a dark garage"
          loading="lazy"
          className="h-full w-full object-cover object-center brightness-[0.45] contrast-[1.18] saturate-[0.1]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#020202]/80 via-transparent to-[#020202]/30" />
      </ParallaxMedia>
      <ScrollReveal className="site-container mt-8 flex flex-wrap gap-x-12 gap-y-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/55">CTZ / Black Series</p>
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/55">01 / Exterior</p>
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/55">Performance configuration</p>
      </ScrollReveal>
      <FilmGrain />
    </section>
  );
}
