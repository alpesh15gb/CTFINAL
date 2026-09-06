"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion, useTransform } from "framer-motion";
import { ArrowDown, ArrowRight } from "lucide-react";
import { useMountedReducedMotion, usePinnedProgress } from "./fx";
import { FINISHES, type Finish } from "@/components/three/SceneStudio";
import { cn } from "@/lib/utils";

const SceneStudio = dynamic(
  () => import("@/components/three/SceneStudio").then((m) => m.SceneStudio),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">
          Loading the observatory…
        </span>
      </div>
    ),
  }
);

/** Map one progress window [a,b]→[c,d] with hold outside. */
function useWindow(
  progress: ReturnType<typeof usePinnedProgress>,
  window: [number, number],
  out: [number, number]
) {
  return useTransform(progress, [0, window[0], window[1], 1], [out[0], out[0], out[1], out[1]]);
}

/**
 * SCENE HERO — pinned ~360svh, scroll drives a 3D camera orbit around the
 * Huracán: silhouette → reveal → detail → convert, with live finish swatches.
 */
export function SceneHero() {
  const ref = useRef<HTMLElement>(null);
  const progress = usePinnedProgress(ref);
  const reduce = useMountedReducedMotion();
  const [finish, setFinish] = useState<Finish>(FINISHES[0]);
  const getP = () => progress.get();

  // beat text
  const b1out = useWindow(progress, [0.16, 0.24], [1, 0]);
  const b2y = useWindow(progress, [0.26, 0.38], [112, 0]);
  const b2o = useWindow(progress, [0.26, 0.34], [0, 1]);
  const b2outY = useWindow(progress, [0.5, 0.62], [0, -26]);
  const b2outO = useWindow(progress, [0.5, 0.6], [1, 0]);
  const b3y = useWindow(progress, [0.62, 0.72], [60, 0]);
  const b3o = useWindow(progress, [0.62, 0.7], [0, 1]);
  const b3outO = useWindow(progress, [0.86, 0.96], [1, 0]);
  const b4y = useWindow(progress, [0.8, 0.9], [70, 0]);
  const b4o = useWindow(progress, [0.8, 0.88], [0, 1]);
  const swatchO = useWindow(progress, [0.55, 0.66], [0, 1]);

  if (reduce) {
    return (
      <section className="relative isolate min-h-svh overflow-hidden bg-[#050506] text-white">
        <div className="absolute inset-0">
          <SceneStudio getP={() => 0.5} finish={finish} />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050506] via-[#050506]/20 to-transparent" />
        <div className="site-container relative z-10 flex min-h-svh flex-col justify-end py-12 pt-32">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-red-light">
            Cartunez / 01 — The observatory
          </p>
          <h1 className="font-display mt-4 text-[clamp(3rem,9.5vw,8rem)] uppercase leading-[0.92] tracking-tight">
            Built to
            <br />
            be seen.
          </h1>
          <FinishRow finish={finish} setFinish={setFinish} className="mt-6" />
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/#vehicle-selector" className="inline-flex min-h-12 items-center gap-2 rounded-sm bg-red px-6 font-mono text-xs font-bold uppercase tracking-[0.16em] text-white transition hover:bg-red-deep">
              Match my vehicle <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link href="/shop" className="inline-flex min-h-12 items-center rounded-sm border border-white/25 px-6 font-mono text-xs font-bold uppercase tracking-[0.16em] transition hover:border-white hover:bg-white hover:text-ink">
              Shop upgrades
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} className="relative h-[360svh] bg-[#050506] text-white">
      <div className="sticky top-0 h-svh min-h-[620px] overflow-hidden">
        {/* 3D stage */}
        <div className="absolute inset-0">
          <SceneStudio getP={getP} finish={finish} />
        </div>

        {/* vertical rail (like the reference) */}
        <div className="absolute right-5 top-1/2 z-20 hidden -translate-y-1/2 flex-col items-end gap-5 md:flex">
          {["Silhouette", "Reveal", "Detail", "Convert"].map((label, i) => (
            <RailBeat key={label} label={label} index={i} progress={progress} />
          ))}
        </div>

        {/* beat 01 — silhouette */}
        <div className="absolute inset-x-0 top-24 z-10 md:top-28">
          <motion.div style={{ opacity: b1out }} className="site-container flex items-center justify-between font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-white/60">
            <span className="flex items-center gap-3">
              <span className="inline-block h-[7px] w-[7px] bg-red" aria-hidden />
              Cartunez / 01 — The observatory
            </span>
            <span className="hidden md:inline">Scroll — the car turns</span>
            <span className="flex items-center gap-2">
              Scroll <ArrowDown className="h-3.5 w-3.5 animate-bounce" aria-hidden />
            </span>
          </motion.div>
        </div>

        {/* beat 02 — reveal */}
        <motion.div style={{ y: b2outY, opacity: b2outO }} className="absolute inset-x-0 bottom-[9%] z-10">
          <div className="site-container">
            <div className="font-display text-[clamp(3.2rem,10vw,10rem)] uppercase leading-[0.9] tracking-tight">
              <span className="clip-mask block">
                <motion.span style={{ y: b2y, opacity: b2o }} className="block will-change-transform">
                  Built to
                </motion.span>
              </span>
              <span className="clip-mask block">
                <motion.span style={{ y: b2y, opacity: b2o }} className="block will-change-transform">
                  be seen.
                </motion.span>
              </span>
            </div>
            <motion.p style={{ opacity: b2o }} className="mt-5 max-w-md text-base leading-relaxed text-white/70 md:text-lg">
              Alloys, audio, protection and light — engineered around your
              car, fitted by people who obsess over the details.
            </motion.p>
          </div>
        </motion.div>

        {/* beat 03 — detail + swatches */}
        <motion.div style={{ y: b3y, opacity: b3o }} className="absolute inset-x-0 bottom-[9%] z-10">
          <motion.div style={{ opacity: b3outO }} className="site-container">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-red-light">
              03 / Obsess over details
            </p>
            <p className="font-display mt-3 max-w-3xl text-[clamp(1.8rem,4.5vw,4rem)] font-bold uppercase leading-[0.95] tracking-tight">
              Every millimetre earns its place.
            </p>
            <motion.div style={{ opacity: swatchO }} className="mt-6">
              <FinishRow finish={finish} setFinish={setFinish} />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* beat 04 — convert */}
        <motion.div style={{ y: b4y, opacity: b4o }} className="absolute inset-x-0 bottom-[9%] z-10">
          <div className="site-container">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-red-light">
              04 / Start with your car
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Link href="/#vehicle-selector" className="inline-flex min-h-12 items-center gap-2 rounded-sm bg-red px-6 font-mono text-xs font-bold uppercase tracking-[0.16em] text-white transition hover:bg-red-deep">
                Match my vehicle <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link href="/shop" className="inline-flex min-h-12 items-center rounded-sm border border-white/25 px-6 font-mono text-xs font-bold uppercase tracking-[0.16em] transition hover:border-white hover:bg-white hover:text-ink">
                Shop upgrades
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function RailBeat({
  label,
  index,
  progress,
}: {
  label: string;
  index: number;
  progress: ReturnType<typeof usePinnedProgress>;
}) {
  const scaleY = useWindow(progress, [0.1 + index * 0.24, 0.2 + index * 0.24], [0.12, 1]);

  return (
    <div className="flex items-center gap-3">
      <span className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-white/40">
        0{index + 1} {label}
      </span>
      <span className="h-8 w-[3px] rounded-full bg-white/15">
        <motion.span
          className="block h-full w-full origin-top rounded-full bg-red"
          style={{ scaleY }}
        />
      </span>
    </div>
  );
}

function FinishRow({
  finish,
  setFinish,
  className = "",
}: {
  finish: Finish;
  setFinish: (f: Finish) => void;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-center gap-2 sm:gap-3", className)}>
      <span className="font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-white/50">
        Finish
      </span>
      {FINISHES.map((f) => (
        <button
          key={f.id}
          type="button"
          onClick={() => setFinish(f)}
          aria-pressed={finish.id === f.id}
          aria-label={`${f.label} finish`}
          title={f.label}
          className={cn(
            "group flex h-9 w-9 items-center justify-center gap-2 rounded-full border p-0 transition-all sm:h-auto sm:w-auto sm:px-3 sm:py-2",
            finish.id === f.id
              ? "border-white/70 bg-white/10"
              : "border-white/20 hover:border-white/45"
          )}
        >
          <span
            className="h-3.5 w-3.5 rounded-full border border-white/30"
            style={{ backgroundColor: f.hex }}
          />
          <span className="sr-only font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-white/70 group-hover:text-white sm:not-sr-only">
            {f.label}
          </span>
        </button>
      ))}
    </div>
  );
}
