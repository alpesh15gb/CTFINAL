"use client";

import { useRef, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { motion, useInView, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { FilmGrain } from "@/components/cinematic/primitives";

const ObsidianStudio = dynamic(
  () => import("@/components/three/ObsidianStudio").then((mod) => mod.ObsidianStudio),
  {
    ssr: false,
    loading: () => <div className="absolute inset-0 bg-[#020202]" />,
  }
);

/** Scroll-driven masked line: rises in [a,b], holds, exits in [c,d]. */
function ScrollMaskLine({
  progress,
  enter,
  exit,
  children,
  className = "",
}: {
  progress: MotionValue<number>;
  enter: [number, number];
  exit: [number, number];
  children: ReactNode;
  className?: string;
}) {
  const y = useTransform(progress, [enter[0], enter[1], exit[0], exit[1]], ["112%", "0%", "0%", "-112%"]);
  const opacity = useTransform(progress, [enter[0], enter[0] + 0.015, exit[0], exit[1]], [0, 1, 1, 0]);
  return (
    <span className="clip-mask block">
      <motion.span style={{ y, opacity }} className={`block will-change-transform ${className}`}>
        {children}
      </motion.span>
    </span>
  );
}

/** Manual 4-stop interpolation (avoids stop-array edge cases in useTransform). */
function interp4(stops: readonly [number, number, number, number], out: readonly [number, number, number, number], v: number) {
  const [a, b, c, d] = stops;
  const [w, x, y, z] = out;
  if (v <= a) return w;
  if (v >= d) return z;
  if (v <= b) return w + (x - w) * ((v - a) / (b - a || 1));
  if (v <= c) return x + (y - x) * ((v - b) / (c - b || 1));
  return y + (z - y) * ((v - c) / (d - c || 1));
}

function FadeRange({
  progress,
  range,
  children,
  className = "",
  values = [1, 1, 1, 0] as [number, number, number, number],
}: {
  progress: MotionValue<number>;
  range: [number, number, number, number];
  children: ReactNode;
  className?: string;
  values?: [number, number, number, number];
}) {
  const opacity = useTransform(progress, (v: number) => interp4(range, values, v));
  return (
    <motion.div style={{ opacity }} className={className}>
      {children}
    </motion.div>
  );
}

/**
 * SCENE 01–02 — DARK MACHINE + HERO REVEAL.
 * 320vh scroll, sticky 100svh stage. Darkness → silhouette → machine → statements.
 */
export function DarkMachineHero() {
  const containerRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const isInView = useInView(containerRef, { margin: "400px 0px" });
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });

  const exitDarken = useTransform(scrollYProgress, [0.93, 1], [0, 0.85]);

  if (reducedMotion) {
    return (
      <section className="relative flex h-svh min-h-[640px] flex-col justify-end overflow-hidden bg-[#020202] pb-[12vh]">
        <div className="absolute inset-0">
          <ObsidianStudio scrollProgress={scrollYProgress} reducedMotion active />
        </div>
        <div className="site-container relative z-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/55">Cartunez / 01</p>
          <h1 className="campaign-title mt-3 text-[clamp(5rem,11vw,12rem)]">
            Engineered
            <br />
            to be different.
          </h1>
        </div>
        <FilmGrain />
      </section>
    );
  }

  return (
    <section ref={containerRef} className="relative h-[320vh] bg-[#020202]">
      <div className="sticky top-0 h-svh min-h-[620px] overflow-hidden bg-[#020202]">
        {/* ---- layered depth: behind-type → 3D machine → front-type ---- */}

        {/* PRECISION sits behind the car */}
        <div className="pointer-events-none absolute inset-0 z-[4] flex items-center justify-center">
          <ScrollMaskLine progress={scrollYProgress} enter={[0.42, 0.47]} exit={[0.58, 0.63]}>
            <span className="campaign-title text-[clamp(5rem,13vw,14rem)] text-white/[0.16]">PRECISION</span>
          </ScrollMaskLine>
        </div>

        {/* The machine */}
        <div className="absolute inset-0 z-[5]">
          <ObsidianStudio scrollProgress={scrollYProgress} reducedMotion={false} active={isInView} />
        </div>

        {/* Cinematic vignette */}
        <div className="pointer-events-none absolute inset-0 z-[6] bg-[radial-gradient(circle_at_50%_46%,transparent_30%,rgba(2,2,2,0.72)_92%)]" />

        {/* ---- 0–18%: near-darkness, tiny identifier + cue ---- */}
        <FadeRange progress={scrollYProgress} range={[0, 0.02, 0.13, 0.18]} className="absolute left-6 top-24 z-20 md:left-12 md:top-28">
          <p className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-white/60">
            <span className="inline-block h-[6px] w-[6px] bg-[#E32219]" aria-hidden />
            Cartunez / 01
          </p>
        </FadeRange>
        <FadeRange progress={scrollYProgress} range={[0, 0.02, 0.1, 0.15]} className="absolute inset-x-0 bottom-8 z-20 flex flex-col items-center gap-2">
          <span className="font-mono text-[9px] uppercase tracking-[0.34em] text-white/50">Scroll</span>
          <div className="h-9 w-px bg-gradient-to-b from-white/40 to-transparent" />
        </FadeRange>

        {/* ---- 18–40%: ENGINEERED / TO BE / DIFFERENT. ---- */}
        <div className="pointer-events-none absolute inset-x-0 bottom-[10%] z-[15] px-6 md:px-12">
          <div className="mx-auto max-w-[1600px]">
            <h1 className="campaign-title text-[clamp(5rem,11vw,12rem)]">
              <ScrollMaskLine progress={scrollYProgress} enter={[0.18, 0.23]} exit={[0.36, 0.41]}>Engineered</ScrollMaskLine>
              <ScrollMaskLine progress={scrollYProgress} enter={[0.22, 0.27]} exit={[0.37, 0.42]}>
                <span className="text-white/85">to be</span>
              </ScrollMaskLine>
              <ScrollMaskLine progress={scrollYProgress} enter={[0.26, 0.31]} exit={[0.38, 0.43]}>Different.</ScrollMaskLine>
            </h1>
          </div>
        </div>

        {/* ---- 42–60%: WITHOUT / COMPROMISE. (front layer, PRECISION behind car) ---- */}
        <div className="pointer-events-none absolute inset-x-0 bottom-[10%] z-[15] px-6 md:px-12">
          <div className="mx-auto max-w-[1600px] text-right">
            <p className="campaign-title text-[clamp(4.5rem,10vw,11rem)]">
              <ScrollMaskLine progress={scrollYProgress} enter={[0.45, 0.5]} exit={[0.58, 0.63]}>Without</ScrollMaskLine>
              <ScrollMaskLine progress={scrollYProgress} enter={[0.48, 0.53]} exit={[0.59, 0.64]}>Compromise.</ScrollMaskLine>
            </p>
          </div>
        </div>

        {/* ---- 66–78%: detail push, near silence ---- */}
        <FadeRange progress={scrollYProgress} range={[0.66, 0.69, 0.75, 0.78]} values={[0, 1, 1, 0]} className="absolute right-6 top-[24%] z-20 text-right md:right-12">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/60">Obsidian / Detail</p>
          <p className="mt-2 font-display text-xl font-semibold uppercase tracking-wide text-white/90">Carbon &amp; light</p>
        </FadeRange>

        {/* ---- 80–100%: THIS IS CARTUNEZ. ---- */}
        <div className="pointer-events-none absolute inset-0 z-[15] flex flex-col items-center justify-end pb-[12vh] text-center">
          <h2 className="campaign-title text-[clamp(4.5rem,10vw,11rem)]">
            <ScrollMaskLine progress={scrollYProgress} enter={[0.79, 0.83]} exit={[0.93, 0.97]}>
              <span className="text-white/80">This is</span>
            </ScrollMaskLine>
            <ScrollMaskLine progress={scrollYProgress} enter={[0.82, 0.86]} exit={[0.94, 0.98]}>Cartunez.</ScrollMaskLine>
          </h2>
        </div>

        {/* Exit fade into numbers */}
        <motion.div style={{ opacity: exitDarken }} className="pointer-events-none absolute inset-0 z-30 bg-[#020202]" />
        <FilmGrain />
      </div>
    </section>
  );
}
