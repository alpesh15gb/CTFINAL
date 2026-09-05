"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Reveal, useMountedReducedMotion, useSectionProgress } from "./fx";

/**
 * Finale — the single black chapter. Everything before it was daylight;
 * the inversion lands exactly where it converts.
 */
export function FinaleCTA() {
  const ref = useRef<HTMLElement>(null);
  const progress = useSectionProgress(ref);
  const reduce = useMountedReducedMotion();
  // Scroll-driven (not viewport-triggered): deterministic under instant
  // jumps, which whileInView+once mishandles.
  const y1 = useTransform(progress, [0.22, 0.42], ["112%", "0%"]);
  const o1 = useTransform(progress, [0.22, 0.36], [0, 1]);
  const y2 = useTransform(progress, [0.28, 0.48], ["112%", "0%"]);
  const o2 = useTransform(progress, [0.28, 0.42], [0, 1]);

  return (
    <section ref={ref} className="relative overflow-hidden bg-ink py-28 text-paper md:py-44">
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(227,34,25,0.16),transparent_32rem),radial-gradient(circle_at_10%_85%,rgba(47,179,240,0.12),transparent_30rem)]"
      />
      <div className="site-container relative">
        <Reveal>
          <span className="inline-flex items-center rounded-md bg-black p-2">
            <Image
              src="/logo/cartunez-logo.png"
              alt="Cartunez"
              width={140}
              height={48}
              className="h-9 w-auto object-contain"
            />
          </span>
        </Reveal>
        <div className="font-display mt-8 text-[clamp(3.2rem,10vw,10rem)] font-bold uppercase leading-[0.88] tracking-tight">
          <span className="clip-mask block">
            {reduce ? (
              <span className="block">This is</span>
            ) : (
              <motion.span style={{ y: y1, opacity: o1 }} className="block will-change-transform">
                This is
              </motion.span>
            )}
          </span>
          <span className="clip-mask block">
            {reduce ? (
              <span className="block text-red-light">Cartunez.</span>
            ) : (
              <motion.span style={{ y: y2, opacity: o2 }} className="block will-change-transform text-red-light">
                Cartunez.
              </motion.span>
            )}
          </span>
        </div>
        <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <Reveal delay={0.1}>
            <p className="max-w-md text-base leading-relaxed text-paper/70 md:text-lg">
              Tell us what you drive. We&apos;ll spec the wheels, the sound,
              the shine and the light — fitted in Hyderabad, guaranteed to
              turn heads.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/#vehicle-selector"
                className="inline-flex min-h-12 items-center gap-2 rounded-sm bg-red px-6 font-mono text-xs font-bold uppercase tracking-[0.16em] text-white transition hover:bg-red-deep"
              >
                Match my vehicle <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link
                href="/shop"
                className="inline-flex min-h-12 items-center rounded-sm border border-paper/25 px-6 font-mono text-xs font-bold uppercase tracking-[0.16em] text-paper transition hover:border-paper hover:bg-paper hover:text-ink"
              >
                Shop upgrades
              </Link>
            </div>
          </Reveal>
        </div>
        <Reveal delay={0.25}>
          <p className="mt-14 font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-paper/40">
            Hyderabad — India / INR
          </p>
        </Reveal>
      </div>
    </section>
  );
}
