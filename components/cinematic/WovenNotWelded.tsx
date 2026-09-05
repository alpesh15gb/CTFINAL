"use client";

import { MaskText, ParallaxMedia, FilmGrain } from "./primitives";

/** PROTECT YOUR RIDE — full-bleed rear three-quarter in smoke, poster statement. */
export function WovenNotWelded() {
  return (
    <section className="relative overflow-hidden bg-[#020202]">
      <ParallaxMedia className="relative h-[92svh] min-h-[560px]" fromScale={1.1} toScale={1} drift="4%">
        <img
          src="https://images.unsplash.com/photo-1617531653332-bd46c24f2068?q=80&w=2400&auto=format&fit=crop"
          alt="Black muscle car standing in dusk light"
          loading="lazy"
          className="h-full w-full object-cover object-[50%_60%] grayscale brightness-[0.4] contrast-[1.18]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-[#020202]/20 to-[#020202]/60" />
      </ParallaxMedia>
      <div className="site-container pointer-events-none absolute inset-0 flex flex-col justify-end pb-[9vh]">
        <MaskText
          className="campaign-title text-[clamp(4.5rem,11vw,12rem)]"
          lines={["Protect your ride.", <span key="n" className="text-white/85">Elevate your style.</span>]}
        />
        <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.3em] text-white/55">
          Carbon monocoque / Hand-laid
        </p>
      </div>
      <FilmGrain />
    </section>
  );
}
