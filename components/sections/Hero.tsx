"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { TEMPORARY_MACRO_ASSET } from "@/lib/heroConfig";

const HeroStudio = dynamic(
  () => import("@/components/three/HeroStudio").then((mod) => mod.HeroStudio),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_55%,rgba(220,225,230,0.05),transparent_30rem)]" />
    ),
  }
);

/**
 * Director's Cut V2 hero — 200vh, one sticky stage, four distinct shots.
 *
 *   SHOT A  0.00–0.14  silhouette + rim light, minimal identity only
 *   SHOT B  0.14–0.48  light rig physically travels front → rear
 *   SHOT C  0.48–0.72  campaign frame: car cuts through BUILT/BEYOND, FACTORY. in front
 *   SHOT D  0.72–0.96  push into the wheel, hands off to macro still
 *   exit    0.95–1.00  white blowout into the CARTUNEZ bridge
 */
export function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const isInView = useInView(containerRef, { margin: "200px 0px" });
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // SHOT A — identity + scroll cue
  const labelOpacity = useTransform(scrollYProgress, [0, 0.09, 0.15], [1, 1, 0]);
  const cueOpacity = useTransform(scrollYProgress, [0.02, 0.06, 0.1, 0.14], [0, 1, 1, 0]);

  // SHOT C — FACTORY. stays DOM (in front of the canvas); BUILT/BEYOND live
  // inside the WebGL scene so the car physically occludes them.
  const factoryOpacity = useTransform(scrollYProgress, [0.54, 0.60, 0.74, 0.79], [0, 1, 1, 0]);
  const factoryY = useTransform(scrollYProgress, [0.54, 0.62], [36, 0]);

  // SHOT D — macro handoff: canvas dims toward black before the mask opens so
  // the asset swap reads as a focus pull through darkness.
  const canvasOpacity = useTransform(scrollYProgress, [0.72, 0.8, 0.9], [1, 0.3, 0]);
  const macroOpacity = useTransform(scrollYProgress, [0.8, 0.85], [0, 1]);
  const macroScale = useTransform(scrollYProgress, [0.78, 0.96], [1.12, 1.03]);
  const macroMask = useTransform(scrollYProgress, (v: number) => {
    const t = Math.min(1, Math.max(0, (v - 0.78) / 0.12));
    const inner = 18 + t * 62;
    const outer = inner + 30;
    return `radial-gradient(circle at 34% 52%, rgba(0,0,0,1) ${inner}%, rgba(0,0,0,0) ${outer}%)`;
  });
  const copyOneOpacity = useTransform(scrollYProgress, [0.83, 0.87, 0.95, 0.99], [0, 1, 1, 0]);
  const copyTwoOpacity = useTransform(scrollYProgress, [0.88, 0.92, 0.95, 0.99], [0, 1, 1, 0]);

  // Exit blowout — hands off to the bridge's white decay
  const blowoutOpacity = useTransform(scrollYProgress, [0.95, 1], [0, 0.92]);

  if (reducedMotion) {
    return (
      <section className="relative h-svh min-h-[680px] bg-background">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 z-[5]">
            <HeroStudio scrollProgress={scrollYProgress} reducedMotion={true} active={true} />
          </div>
          <div className="pointer-events-none absolute inset-0 z-[6] bg-[radial-gradient(circle_at_55%_50%,transparent_30%,rgba(3,4,5,0.72)_86%)]" />
        </div>
        <div className="site-container relative z-10 flex h-full flex-col justify-center pb-7 pt-24 lg:pt-32">
          <h1 className="max-w-[1260px] font-display text-[clamp(4.5rem,12vw,12.5rem)] font-bold uppercase leading-[0.73] tracking-[-0.045em] text-foreground">
            <span className="block">Built</span>
            <span className="block pl-[8vw] text-silver">Beyond</span>
            <span className="display-outline block">Factory.</span>
          </h1>
          <div className="mt-8 flex max-w-2xl flex-col gap-7 md:ml-[8vw] md:flex-row md:items-end">
            <p className="max-w-md text-base leading-relaxed text-silver-muted md:text-lg">
              Vehicle-specific accessories and performance upgrades, selected for exact fitment and finished to feel factory—only better.
            </p>
            <div className="flex shrink-0 flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/#vehicle-selector">Match my vehicle <ArrowRight className="h-4 w-4" /></Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/builds">View builds</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={containerRef} className="relative h-[200vh] bg-background">
      <div className="sticky top-0 h-svh min-h-[640px] overflow-hidden bg-background">
        {/* === Z-INDEX MAP ===
            z-[4]:  BUILT / BEYOND — BEHIND the transparent canvas, car occludes them
            z-[5]:  WebGL studio (transparent canvas)
            z-[6]:  vignette (above canvas, restrained)
            z-[12]: SHOT D macro still (hands off from WebGL)
            z-[15]: FACTORY. — IN FRONT of the car
            z-20:   minimal identity / technical copy
            z-30:   exit blowout
        */}

        {/* WebGL studio — canvas fades out under the macro still */}
        <motion.div style={{ opacity: canvasOpacity }} className="absolute inset-0 z-[5]">
          <HeroStudio
            scrollProgress={scrollYProgress}
            reducedMotion={reducedMotion}
            active={isInView}
          />
        </motion.div>

        {/* Single restrained vignette — frames without erasing */}
        <div className="pointer-events-none absolute inset-0 z-[6] bg-[radial-gradient(circle_at_55%_50%,transparent_30%,rgba(3,4,5,0.72)_86%)]" />

        {/* SHOT D — macro still, radial mask opens from the push-in point */}
        <motion.div
          style={{ opacity: macroOpacity, scale: macroScale }}
          className="absolute inset-0 z-[12]"
        >
          <motion.div style={{ WebkitMaskImage: macroMask, maskImage: macroMask }} className="absolute inset-0">
            <Image
              src={TEMPORARY_MACRO_ASSET}
              alt="Forged wheel and brake detail under studio light"
              fill
              sizes="100vw"
              className="object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_34%_52%,transparent_38%,rgba(3,4,5,0.55)_100%)]" />
          </motion.div>
        </motion.div>

        {/* SHOT C — FACTORY. in front of the car */}
        <motion.div
          style={{ opacity: factoryOpacity, y: factoryY }}
          className="pointer-events-none absolute inset-x-0 bottom-[9%] z-[15] px-4 md:px-8"
        >
          <div className="mx-auto max-w-[1600px]">
            <p className="font-display text-[clamp(3.5rem,9vw,10rem)] font-bold uppercase leading-[0.75] tracking-[-0.04em] text-foreground">
              FACTORY.
            </p>
          </div>
        </motion.div>

        {/* SHOT A — minimal identity */}
        <motion.div
          style={{ opacity: labelOpacity }}
          className="absolute left-4 top-24 z-20 md:left-8 md:top-28"
        >
          <span className="font-mono text-[9px] uppercase tracking-[0.28em] text-silver-muted">
            Cartunez / Hyderabad
          </span>
        </motion.div>
        <motion.div
          style={{ opacity: cueOpacity }}
          className="absolute inset-x-0 bottom-10 z-20 flex flex-col items-center gap-3"
        >
          <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-silver-muted">Scroll</span>
          <div className="h-10 w-px bg-gradient-to-b from-white/40 to-transparent" />
        </motion.div>

        {/* SHOT D — technical data pairs */}
        <motion.div
          style={{ opacity: copyOneOpacity }}
          className="absolute right-4 top-[30%] z-20 text-right md:right-10"
        >
          <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-white/50">01 / Fitment</p>
          <p className="mt-1 font-display text-lg font-semibold uppercase tracking-wide text-foreground md:text-xl">
            OEM+ Precision
          </p>
          <div className="ml-auto mt-2 h-px w-16 bg-white/20" />
        </motion.div>
        <motion.div
          style={{ opacity: copyTwoOpacity }}
          className="absolute right-4 top-[48%] z-20 text-right md:right-10"
        >
          <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-white/50">02 / Material</p>
          <p className="mt-1 font-display text-lg font-semibold uppercase tracking-wide text-foreground md:text-xl">
            Engineered Finish
          </p>
          <div className="ml-auto mt-2 h-px w-16 bg-white/20" />
        </motion.div>

        {/* Exit blowout — becomes the bridge's opening streak */}
        <motion.div
          style={{ opacity: blowoutOpacity }}
          className="pointer-events-none absolute inset-0 z-30 bg-white"
        />
      </div>
    </section>
  );
}
