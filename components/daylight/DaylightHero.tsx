"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { motion, useTransform, type MotionValue } from "framer-motion";
import { ArrowDown, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMountedReducedMotion, usePinnedProgress } from "./fx";

const PHOTO_A =
  "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=2400&auto=format&fit=crop";
const PHOTO_B =
  "https://images.unsplash.com/photo-1614026480209-cd9934144671?q=80&w=2400&auto=format&fit=crop";

/** Map one progress window [a,b]→[c,d] with hold outside. */
function useWindow(
  progress: MotionValue<number>,
  window: [number, number],
  out: [number, number]
) {
  return useTransform(progress, [0, window[0], window[1], 1], [out[0], out[0], out[1], out[1]]);
}

/**
 * HERO FILM — pinned ~300svh, 4 scrub-driven beats. Everything (camera,
 * type, wipe, CTAs) derives from one scroll progress value, so any scroll
 * position — gradual, jump, resize — always renders the correct frame.
 *
 * Beats: 01 establish (photo A + kicker) → 02 statement (kinetic headline)
 * → 03 detail (photo B wipes in) → 04 convert (CTA block) → exit to ticker.
 */
export function DaylightHero() {
  const ref = useRef<HTMLElement>(null);
  const progress = usePinnedProgress(ref);
  const reduce = useMountedReducedMotion();
  const [imgA, setImgA] = useState(false);
  const [imgB, setImgB] = useState(false);

  // --- camera ---------------------------------------------------------------
  const scaleA = useTransform(progress, [0, 0.55], [1.18, 1.02]);
  const yA = useTransform(progress, [0, 1], [70, -90]);
  const scaleB = useTransform(progress, [0.5, 1], [1.14, 1.04]);
  const wipeX = useTransform(progress, [0.5, 0.66, 0.9, 1], ["102%", "0%", "0%", "-14%"]);

  // --- beat 01: kicker + cue -------------------------------------------------
  const kickerO = useWindow(progress, [0.0, 0.1], [0, 1]);
  const kickerOut = useWindow(progress, [0.1, 0.16], [1, 0]);

  // --- beat 02: kinetic headline ---------------------------------------------
  const l1y = useWindow(progress, [0.12, 0.24], [112, 0]);
  const l1o = useWindow(progress, [0.12, 0.2], [0, 1]);
  const l2y = useWindow(progress, [0.17, 0.29], [112, 0]);
  const l2o = useWindow(progress, [0.17, 0.25], [0, 1]);
  const headOutY = useWindow(progress, [0.48, 0.6], [0, -26]);
  const headOutO = useWindow(progress, [0.48, 0.58], [1, 0]);

  // --- beat 03: detail caption ------------------------------------------------
  const capY = useWindow(progress, [0.6, 0.7], [60, 0]);
  const capO = useWindow(progress, [0.6, 0.68], [0, 1]);
  const capOutO = useWindow(progress, [0.84, 0.94], [1, 0]);

  // --- beat 04: convert -------------------------------------------------------
  const ctaY = useWindow(progress, [0.72, 0.82], [70, 0]);
  const ctaO = useWindow(progress, [0.72, 0.8], [0, 1]);
  const ctaOutO = useWindow(progress, [0.9, 0.98], [1, 0]);
  const dim = useWindow(progress, [0.7, 0.85], [0, 0.42]);

  // --- beat dots ---------------------------------------------------------------
  const beatTargets = [0.1, 0.34, 0.62, 0.8];

  if (reduce) {
    return (
      <section className="relative bg-background">
        <div className="relative h-[62svh] min-h-[420px] overflow-hidden">
          <Image
            src={PHOTO_A}
            alt="Blue sports coupe in daylight"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>
        <div className="site-container py-14">
          <p className="flex items-center gap-3 font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-red-deep">
            <span className="inline-block h-[7px] w-[7px] bg-red" aria-hidden />
            Cartunez / 01 — Daylight spec
          </p>
          <h1 className="font-display mt-4 text-[clamp(3rem,9.5vw,8rem)] uppercase leading-[0.92] tracking-tight text-ink">
            Built to
            <br />
            be seen.
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-ink-soft md:text-lg">
            Alloys, audio, protection and light — engineered around your
            car, fitted by people who obsess over the details.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/#vehicle-selector"
              className="inline-flex min-h-12 items-center gap-2 rounded-sm bg-red px-6 font-mono text-xs font-bold uppercase tracking-[0.16em] text-white transition hover:bg-red-deep"
            >
              Match my vehicle <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link
              href="/shop"
              className="inline-flex min-h-12 items-center rounded-sm border border-ink/20 px-6 font-mono text-xs font-bold uppercase tracking-[0.16em] text-ink transition hover:border-ink hover:bg-ink hover:text-paper"
            >
              Shop upgrades
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} className="relative h-[300svh] bg-background">
      <div className="sticky top-0 h-svh min-h-[620px] overflow-hidden">
        {/* Layer 0 — ambient wash (slowest) */}
        <motion.div style={{ y: useTransform(progress, [0, 1], [40, -120]) }} className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,rgba(227,34,25,0.14),transparent_34rem),radial-gradient(circle_at_12%_82%,rgba(47,179,240,0.12),transparent_30rem)]" />
        </motion.div>

        {/* Layer 1 — photo A */}
        <div className="absolute inset-x-0 top-[8%] bottom-[13%] md:top-[6%]">
          <motion.div style={{ scale: scaleA }} className="absolute inset-0">
            <motion.div style={{ y: yA }} className="absolute inset-0">
              <div className="relative h-full w-full overflow-hidden rounded-sm bg-surface">
                {!imgA && (
                  <div aria-hidden className="absolute inset-0 animate-pulse bg-gradient-to-br from-surface via-raised to-surface" />
                )}
                <Image
                  src={PHOTO_A}
                  alt="Blue sports coupe in daylight"
                  fill
                  priority
                  sizes="100vw"
                  onLoadingComplete={() => setImgA(true)}
                  className={cn(
                    "object-cover transition-opacity duration-700",
                    imgA ? "opacity-100" : "opacity-0"
                  )}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-background/50 via-transparent to-transparent" />
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Layer 2 — photo B wipe (detail) */}
        <motion.div style={{ x: wipeX }} className="absolute inset-x-0 top-[8%] bottom-[13%] z-[5] md:top-[6%]">
          <div className="absolute inset-0">
            <motion.div style={{ scale: scaleB }} className="absolute inset-0">
              <div className="relative h-full w-full overflow-hidden rounded-sm bg-surface">
                {!imgB && (
                  <div aria-hidden className="absolute inset-0 animate-pulse bg-gradient-to-br from-surface via-raised to-surface" />
                )}
                <Image
                  src={PHOTO_B}
                  alt="Performance coupe front detail with alloy wheel"
                  fill
                  sizes="100vw"
                  loading="eager"
                  onLoadingComplete={() => setImgB(true)}
                  className={cn(
                    "object-cover transition-opacity duration-700",
                    imgB ? "opacity-100" : "opacity-0"
                  )}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-l from-background/40 via-transparent to-transparent" />
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Grade dim for the convert beat */}
        <motion.div style={{ opacity: dim }} className="pointer-events-none absolute inset-0 z-[6] bg-ink" />

        {/* Beat 01 — kicker + cue */}
        <motion.div style={{ opacity: kickerO }} className="absolute inset-x-0 top-24 z-20 md:top-28">
          <motion.div style={{ opacity: kickerOut }} className="site-container flex items-center justify-between font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-ink-mute">
            <span className="flex items-center gap-3">
              <span className="inline-block h-[7px] w-[7px] bg-red" aria-hidden />
              Cartunez / 01 — Daylight spec
            </span>
            <span className="hidden md:inline">A scroll film in four beats</span>
            <span className="flex items-center gap-2">
              Scroll <ArrowDown className="h-3.5 w-3.5 animate-bounce" aria-hidden />
            </span>
          </motion.div>
        </motion.div>

        {/* Beat 02 — kinetic headline */}
        <motion.div style={{ y: headOutY, opacity: headOutO }} className="absolute inset-x-0 bottom-[9%] z-10">
          <div className="site-container">
            <div className="font-display text-[clamp(3.4rem,11vw,10.5rem)] uppercase leading-[0.9] tracking-tight text-ink">
              <span className="clip-mask block">
                <motion.span style={{ y: l1y, opacity: l1o }} className="block will-change-transform">
                  Built to
                </motion.span>
              </span>
              <span className="clip-mask block">
                <motion.span style={{ y: l2y, opacity: l2o }} className="block will-change-transform">
                  be seen.
                </motion.span>
              </span>
            </div>
            <motion.p style={{ opacity: l2o }} className="mt-5 max-w-md text-base leading-relaxed text-ink-soft md:text-lg">
              Alloys, audio, protection and light — engineered around your
              car, fitted by people who obsess over the details.
            </motion.p>
          </div>
        </motion.div>

        {/* Beat 03 — detail caption */}
        <motion.div style={{ y: capY, opacity: capO }} className="absolute inset-x-0 bottom-[9%] z-10">
          <motion.div style={{ opacity: capOutO }} className="site-container">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-red-deep">
              03 / Obsess over details
            </p>
            <p className="font-display mt-3 max-w-3xl text-[clamp(1.8rem,4.5vw,4rem)] font-bold uppercase leading-[0.95] tracking-tight text-ink">
              Every millimetre earns its place.
            </p>
          </motion.div>
        </motion.div>

        {/* Beat 04 — convert */}
        <motion.div style={{ y: ctaY, opacity: ctaO }} className="absolute inset-x-0 bottom-[9%] z-10">
          <motion.div style={{ opacity: ctaOutO }} className="site-container">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-red-deep">
              04 / Start with your car
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Link
                href="/#vehicle-selector"
                className="inline-flex min-h-12 items-center gap-2 rounded-sm bg-red px-6 font-mono text-xs font-bold uppercase tracking-[0.16em] text-white transition hover:bg-red-deep"
              >
                Match my vehicle <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link
                href="/shop"
                className="inline-flex min-h-12 items-center rounded-sm border border-ink/20 bg-paper/70 px-6 font-mono text-xs font-bold uppercase tracking-[0.16em] text-ink backdrop-blur-sm transition hover:border-ink hover:bg-ink hover:text-paper"
              >
                Shop upgrades
              </Link>
            </div>
          </motion.div>
        </motion.div>

        {/* Beat dots */}
        <div className="absolute right-5 top-1/2 z-20 hidden -translate-y-1/2 flex-col gap-3 md:flex">
          {beatTargets.map((t, i) => (
            <BeatDot key={i} progress={progress} target={t} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function BeatDot({ progress, target, index }: { progress: MotionValue<number>; target: number; index: number }) {
  const fill = useTransform(progress, [target - 0.02, target + 0.06], [0, 1]);
  const scaleY = useTransform(fill, [0, 1], [0.15, 1]);
  const opacity = useTransform(fill, [0, 1], [0.35, 1]);
  return (
    <div className="flex items-center gap-2" aria-hidden>
      <span className="font-mono text-[9px] font-bold text-ink-mute">0{index + 1}</span>
      <span className="relative h-8 w-[3px] overflow-hidden rounded-full bg-ink/15">
        <motion.span style={{ scaleY, opacity }} className="absolute inset-0 origin-top bg-red" />
      </span>
    </div>
  );
}
