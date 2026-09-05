"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { ArrowDown, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMountedReducedMotion } from "./fx";
import {
  Drift,
  FadeWindow,
  MaskLines,
  Zoom,
  usePinnedProgress,
} from "./fx";

const HERO_IMG =
  "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=2400&auto=format&fit=crop";

/**
 * DAYLIGHT HERO — full-viewport photographic opener.
 * Pinned ~140svh stage: photo drifts + settles while the giant headline
 * rises, holds, and exits upward. Layers move at different rates (sky wash
 * < photo < headline < foreground cue) for true multi-depth parallax.
 */
export function DaylightHero() {
  const ref = useRef<HTMLElement>(null);
  const progress = usePinnedProgress(ref);
  const reduce = useMountedReducedMotion();
  const [imgReady, setImgReady] = useState(false);

  return (
    <section ref={ref} className="relative h-[140svh] bg-background">
      <div className="sticky top-0 h-svh min-h-[620px] overflow-hidden">
        {/* Layer 0 — ambient color wash (slowest) */}
        <Drift progress={progress} from={40} to={-110} className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,rgba(227,34,25,0.14),transparent_34rem),radial-gradient(circle_at_12%_82%,rgba(47,179,240,0.12),transparent_30rem)]" />
        </Drift>

        {/* Layer 1 — the photograph (drift + settle zoom) */}
        <div className="absolute inset-x-0 top-[9%] bottom-[16%] md:top-[7%]">
          <Zoom progress={progress} from={1.12} to={1.02} className="absolute inset-0">
            <Drift progress={progress} from={64} to={-64} className="absolute inset-0">
              <div className="relative h-full w-full overflow-hidden rounded-sm bg-surface">
                {!imgReady && (
                  <div
                    aria-hidden
                    className="absolute inset-0 animate-pulse bg-gradient-to-br from-surface via-raised to-surface"
                  />
                )}
                <Image
                  src={HERO_IMG}
                  alt="Blue sports coupe in daylight"
                  fill
                  priority
                  sizes="100vw"
                  onLoadingComplete={() => setImgReady(true)}
                  className={cn(
                    "object-cover transition-opacity duration-700",
                    imgReady ? "opacity-100" : "opacity-0"
                  )}
                />
                {/* legibility grade: daylight-safe, lifts the paper blend */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-background/50 via-transparent to-transparent" />
              </div>
            </Drift>
          </Zoom>
        </div>

        {/* Layer 2 — headline block (exits fastest) */}
        <FadeWindow
          progress={progress}
          range={[0.52, 0.78]}
          y={-130}
          className="absolute inset-x-0 bottom-[7%] z-10"
        >
          <div className="site-container">
            <p className="flex items-center gap-3 font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-red-deep">
              <span className="inline-block h-[7px] w-[7px] bg-red" aria-hidden />
              Cartunez / 01 — Daylight spec
            </p>
            <MaskLines
              animateOnMount
              className="font-display mt-4 text-[clamp(3rem,9.5vw,9rem)] uppercase leading-[0.92] tracking-tight text-ink"
              lines={["Built to", "be seen."]}
            />
            <div className="mt-6 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <p className="max-w-md text-base leading-relaxed text-ink-soft md:text-lg">
                Alloys, audio, protection and light — engineered around your
                car, fitted by people who obsess over the details.
              </p>
              <div className="flex flex-wrap items-center gap-3">
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
          </div>
        </FadeWindow>

        {/* Layer 3 — foreground meta (fastest, exits first) */}
        {!reduce && (
          <FadeWindow
            progress={progress}
            range={[0.3, 0.48]}
            y={-40}
            className="absolute inset-x-0 top-24 z-10 md:top-28"
          >
            <div className="site-container flex items-center justify-between font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-ink-mute">
              <span>India / INR</span>
              <span className="hidden md:inline">Scroll — the photos move</span>
              <span className="flex items-center gap-2">
                Scroll <ArrowDown className="h-3.5 w-3.5 animate-bounce" aria-hidden />
              </span>
            </div>
          </FadeWindow>
        )}
      </div>
    </section>
  );
}
