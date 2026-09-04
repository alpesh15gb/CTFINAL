"use client";

import { motion } from "framer-motion";
import { EASE_CINEMATIC, FilmGrain, MaskText, ScrollReveal } from "./primitives";

const FRAMES = [
  {
    src: "https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=2000&auto=format&fit=crop",
    alt: "Full vehicle side profile against a dark wall",
    caption: "Silhouette — drawn by the wind",
    span: "md:col-span-7",
    aspect: "aspect-[21/10]",
    pos: "object-[50%_100%]",
  },
  {
    src: "https://images.unsplash.com/photo-1611633859589-7990d2fbb56b?q=80&w=1600&auto=format&fit=crop",
    alt: "Forged wheel and brake detail",
    caption: "Forged — unsprung lightness",
    span: "md:col-span-5",
    aspect: "aspect-[4/3] md:aspect-[21/10]",
    pos: "object-center",
  },
  {
    src: "https://images.unsplash.com/photo-1614026480209-cd9934144671?q=80&w=2000&auto=format&fit=crop",
    alt: "Front grille and headlight close-up",
    caption: "Face — the engineered stare",
    span: "md:col-span-12",
    aspect: "aspect-[16/9]",
    pos: "object-[50%_40%]",
  },
];

/**
 * EVERY ANGLE, AN ARGUMENT — asymmetric editorial layout.
 * Magazine crops, 0–4px corners, mask reveals, 1→1.03 hovers.
 */
export function EveryAngle() {
  return (
    <section className="relative overflow-hidden bg-[#020202] py-28 md:py-44">
      <div className="site-container">
        <MaskText
          className="campaign-title text-[clamp(4.5rem,10vw,11rem)]"
          lines={["Every angle,", <span key="a" className="text-white/85">an argument.</span>]}
        />
        <div className="mt-12 grid grid-cols-1 gap-5 md:mt-20 md:grid-cols-12 md:gap-6">
          {FRAMES.map((f, i) => (
            <figure key={f.src} className={f.span}>
              <span className="clip-mask block">
                <motion.span
                  className="block will-change-transform"
                  initial={{ y: "8%", scale: 1.04, opacity: 0 }}
                  whileInView={{ y: "0%", scale: 1, opacity: 1 }}
                  viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                  transition={{ duration: 1, delay: i * 0.08, ease: EASE_CINEMATIC }}
                >
                  <span className={`group block overflow-hidden ${f.aspect}`}>
                    <img
                      src={f.src}
                      alt={f.alt}
                      loading="lazy"
                      className={`h-full w-full object-cover ${f.pos} brightness-[0.52] contrast-[1.14] saturate-[0.1] transition-transform duration-[850ms] ease-out group-hover:scale-[1.03]`}
                    />
                  </span>
                </motion.span>
              </span>
              <ScrollReveal delay={0.15} y={12}>
                <figcaption className="mt-3 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.28em] text-white/50">
                  <span className="inline-block h-px w-8 bg-white/25" aria-hidden />
                  {f.caption}
                </figcaption>
              </ScrollReveal>
            </figure>
          ))}
        </div>
      </div>
      <FilmGrain />
    </section>
  );
}
