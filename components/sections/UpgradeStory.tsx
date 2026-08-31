"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const IMAGES = {
  performance: "https://images.unsplash.com/photo-1552656967-7a0991a13906?q=80&w=2400&auto=format&fit=crop",
  wheels: "https://images.unsplash.com/photo-1698533188477-5fd401563eaa?q=80&w=2400&auto=format&fit=crop",
  exterior: "https://images.unsplash.com/photo-1714434087915-27cfbdd3b048?q=80&w=2400&auto=format&fit=crop",
  lighting: "https://images.unsplash.com/photo-1616761879141-f485e5fed5df?q=80&w=2400&auto=format&fit=crop",
  interior: "https://images.unsplash.com/photo-1629820408206-e9fc918abf63?q=80&w=2400&auto=format&fit=crop",
  audio: "https://images.unsplash.com/photo-1776176359206-a1d34436ddff?q=80&w=2400&auto=format&fit=crop",
};

/* ------------------------------------------------------------------ */
/* ACT A — PERFORMANCE · aggressive horizontal energy                  */
/* ------------------------------------------------------------------ */
function PerformanceAct() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  // Crop opens from a tight band to full frame while the section passes
  const crop = useTransform(scrollYProgress, (v: number) => {
    const t = Math.min(1, Math.max(0, (v - 0.15) / 0.4));
    const inset = 26 * (1 - t);
    return `inset(${inset}% ${inset * 0.35}% ${inset}% ${inset * 0.35}%)`;
  });
  const imageScale = useTransform(scrollYProgress, [0.1, 0.6], [1.3, 1.04]);
  const imageX = useTransform(scrollYProgress, [0, 1], ["-4%", "4%"]);
  const wordX = useTransform(scrollYProgress, [0.1, 0.9], ["9vw", "-11vw"]);
  const wheelX = useTransform(scrollYProgress, [0.2, 0.7], ["-38vw", "4vw"]);
  const labelOpacity = useTransform(scrollYProgress, [0.15, 0.25], [0, 1]);

  return (
    <div ref={ref} className="relative h-[95vh] overflow-hidden bg-background">
        {/* Main visual — crop opens while panning horizontally */}
        <motion.div style={{ clipPath: crop }} className="absolute inset-0">
          <motion.div style={{ scale: imageScale, x: imageX }} className="absolute inset-[-6%]">
            <Image src={IMAGES.performance} alt="Performance engineering" fill sizes="100vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-transparent to-background/40" />
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
          </motion.div>
        </motion.div>

        {/* Huge travelling word — horizontal energy */}
        <motion.div
          style={{ x: wordX }}
          className="pointer-events-none absolute left-0 top-[16%] z-10 whitespace-nowrap"
        >
          <span className="font-display text-[clamp(6rem,17vw,22rem)] font-bold uppercase leading-[0.8] tracking-[-0.03em] text-white/90">
            PERFORMANCE
          </span>
        </motion.div>

        {/* Foreground wheel — enters at a faster rate from the left */}
        <motion.div
          style={{ x: wheelX }}
          className="absolute bottom-[-6%] left-0 z-20 h-[46vh] w-[74vw] will-change-transform md:h-[58vh] md:w-[38vw]"
        >
          <Image src={IMAGES.wheels} alt="Forged wheel and stance" fill sizes="60vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
        </motion.div>

        {/* Act label */}
        <motion.div style={{ opacity: labelOpacity }} className="absolute left-4 top-24 z-30 md:left-8 md:top-28">
          <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-white/60">Act A / Drive</p>
        </motion.div>

        {/* Index rail — categories keep their ecommerce links */}
        <div className="absolute inset-x-0 bottom-0 z-30 border-t border-white/10 bg-background/70 backdrop-blur-sm">
          <div className="site-container flex items-center justify-between gap-4 py-4">
            <div className="flex items-center gap-6 overflow-x-auto md:gap-10">
              <Link href="/shop?category=performance" className="whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.2em] text-white/60 transition-colors hover:text-foreground">
                01 Performance <span className="ml-2 hidden text-white/30 md:inline">ECU / Intake / Exhaust</span>
              </Link>
              <Link href="/shop?category=wheels" className="whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.2em] text-white/60 transition-colors hover:text-foreground">
                02 Wheels <span className="ml-2 hidden text-white/30 md:inline">Forged / Stance</span>
              </Link>
            </div>
            <Link href="/shop?category=performance" className="hidden shrink-0 items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-foreground md:flex">
              Explore <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* ACT B — PRESENCE · full-bleed blade takeover                        */
/* ------------------------------------------------------------------ */
function PresenceAct() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  // The lighting image physically overtakes the body image via a blade wipe
  const blade = useTransform(scrollYProgress, (v: number) => {
    const t = Math.min(1, Math.max(0, (v - 0.3) / 0.4));
    return `inset(0 ${(1 - t) * 100}% 0 0)`;
  });
  const outlineOpacity = useTransform(scrollYProgress, [0.12, 0.22, 0.45, 0.62], [0, 1, 1, 0]);
  const baseScale = useTransform(scrollYProgress, [0, 1], [1.12, 1.02]);

  return (
    <div ref={ref} className="relative h-[95vh] overflow-hidden bg-background">
        {/* Base layer — exterior bodywork */}
        <motion.div style={{ scale: baseScale }} className="absolute inset-[-4%]">
          <Image src={IMAGES.exterior} alt="Exterior styling" fill sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-background/35" />
        </motion.div>

        {/* Outline word over the base image */}
        <motion.div
          style={{ opacity: outlineOpacity }}
          className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center"
        >
          <span className="display-outline font-display text-[clamp(5rem,15vw,20rem)] font-bold uppercase leading-none tracking-[-0.02em] text-transparent">
            PRESENCE
          </span>
        </motion.div>

        {/* Blade layer — lighting overtakes, carrying the solid word with it */}
        <motion.div style={{ clipPath: blade }} className="absolute inset-0 z-20">
          <Image src={IMAGES.lighting} alt="Lighting design" fill sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-background/25" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-display text-[clamp(5rem,15vw,20rem)] font-bold uppercase leading-none tracking-[-0.02em] text-white/90">
              PRESENCE
            </span>
          </div>
        </motion.div>

        {/* Act label */}
        <div className="absolute left-4 top-24 z-30 md:left-8 md:top-28">
          <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-white/60">Act B / Form</p>
        </div>

        {/* Index rail */}
        <div className="absolute inset-x-0 bottom-0 z-30 border-t border-white/10 bg-background/70 backdrop-blur-sm">
          <div className="site-container flex items-center justify-between gap-4 py-4">
            <div className="flex items-center gap-6 overflow-x-auto md:gap-10">
              <Link href="/shop?category=exterior" className="whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.2em] text-white/60 transition-colors hover:text-foreground">
                04 Exterior
              </Link>
              <Link href="/shop?category=lighting" className="whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.2em] text-white/60 transition-colors hover:text-foreground">
                05 Lighting
              </Link>
              <Link href="/shop?category=protection" className="whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.2em] text-white/60 transition-colors hover:text-foreground">
                07 Protection
              </Link>
            </div>
            <Link href="/shop?category=exterior" className="hidden shrink-0 items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-foreground md:flex">
              Explore <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* ACT C — CABIN · quiet, intimate, warmer                             */
/* ------------------------------------------------------------------ */
function CabinAct() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  const imageScale = useTransform(scrollYProgress, [0, 1], [1.09, 1]);
  const textOpacity = useTransform(scrollYProgress, [0.22, 0.38], [0, 1]);
  const textY = useTransform(scrollYProgress, [0.22, 0.42], [26, 0]);
  const insetOpacity = useTransform(scrollYProgress, [0.45, 0.65], [0, 1]);
  const insetY = useTransform(scrollYProgress, [0.45, 0.65], [30, 0]);

  return (
    <div ref={ref} className="relative h-[70vh] overflow-hidden bg-background">
        {/* Warm interior — the first warm frame on the page */}
        <motion.div style={{ scale: imageScale }} className="absolute inset-0">
          <Image src={IMAGES.interior} alt="Interior craftsmanship" fill sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(3,4,5,0.88)_8%,rgba(3,4,5,0.35)_52%,rgba(3,4,5,0.15)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_40%,rgba(255,176,110,0.08),transparent_60%)]" />
        </motion.div>

        {/* Left-aligned editorial text — the quietest moment */}
        <motion.div
          style={{ opacity: textOpacity, y: textY }}
          className="absolute left-4 top-[24%] z-10 max-w-md md:left-16"
        >
          <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-white/50">Act C / Cabin</p>
          <h3 className="mt-4 font-display text-[clamp(3.5rem,8vw,7.5rem)] font-bold uppercase leading-[0.85] tracking-[-0.03em] text-silver">
            Cabin
          </h3>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/70 md:text-base">
            Trim, stitching and ambient light tailored around the driver. Your cabin, your spec.
          </p>
        </motion.div>

        {/* Audio inset — enters late and slow */}
        <motion.div
          style={{ opacity: insetOpacity, y: insetY }}
          className="absolute bottom-[18%] right-4 z-10 h-[26vh] w-[46vw] md:right-16 md:w-[24vw]"
        >
          <Image src={IMAGES.audio} alt="Car audio engineering" fill sizes="40vw" className="object-cover" />
          <div className="absolute inset-0 border border-white/10" />
        </motion.div>

        {/* Index rail */}
        <div className="absolute inset-x-0 bottom-0 z-30 border-t border-white/10 bg-background/70 backdrop-blur-sm">
          <div className="site-container flex items-center justify-between gap-4 py-4">
            <div className="flex items-center gap-6 overflow-x-auto md:gap-10">
              <Link href="/shop?category=interior" className="whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.2em] text-white/60 transition-colors hover:text-foreground">
                03 Interior
              </Link>
              <Link href="/shop?category=audio" className="whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.2em] text-white/60 transition-colors hover:text-foreground">
                06 Audio
              </Link>
            </div>
            <Link href="/shop?category=interior" className="hidden shrink-0 items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-foreground md:flex">
              Explore <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Static fallback — reduced motion                                    */
/* ------------------------------------------------------------------ */
function StaticAct({
  image,
  alt,
  word,
  act,
  copy,
  links,
  warm,
}: {
  image: string;
  alt: string;
  word: string;
  act: string;
  copy?: string;
  links: { label: string; href: string }[];
  warm?: boolean;
}) {
  return (
    <div className="relative min-h-[80vh] overflow-hidden">
      <div className="absolute inset-0">
        <Image src={image} alt={alt} fill sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-background/45" />
        {warm && <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_40%,rgba(255,176,110,0.08),transparent_60%)]" />}
      </div>
      <div className="relative z-10 flex min-h-[80vh] flex-col justify-end px-4 pb-10 md:px-8">
        <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-white/50">{act}</p>
        <h3 className="mt-3 font-display text-[clamp(3.5rem,9vw,8rem)] font-bold uppercase leading-[0.85] text-foreground">{word}</h3>
        {copy && <p className="mt-4 max-w-md text-base leading-relaxed text-white/70">{copy}</p>}
        <div className="mt-6 flex flex-wrap gap-6 border-t border-white/10 pt-4">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/60 transition-colors hover:text-foreground">
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export function UpgradeStory() {
  const reducedMotion = useReducedMotion();

  return (
    <section className="relative z-20 bg-background">
      <div className="mx-auto max-w-[1600px] px-4 pt-20 pb-6 md:px-8 md:pt-24 md:pb-8">
        <span className="mb-3 inline-block font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-white/50">
          03 / Transform It
        </span>
        <h2 className="font-display text-4xl font-bold uppercase leading-[0.9] tracking-tight text-foreground md:text-6xl">
          Every Upgrade.
          <br />
          <span className="text-silver">One Vision.</span>
        </h2>
      </div>

      {reducedMotion ? (
        <div>
          <StaticAct
            image={IMAGES.performance}
            alt="Performance engineering"
            word="Performance"
            act="Act A / Drive"
            links={[
              { label: "01 Performance", href: "/shop?category=performance" },
              { label: "02 Wheels", href: "/shop?category=wheels" },
            ]}
          />
          <StaticAct
            image={IMAGES.lighting}
            alt="Lighting design"
            word="Presence"
            act="Act B / Form"
            links={[
              { label: "04 Exterior", href: "/shop?category=exterior" },
              { label: "05 Lighting", href: "/shop?category=lighting" },
              { label: "07 Protection", href: "/shop?category=protection" },
            ]}
          />
          <StaticAct
            image={IMAGES.interior}
            alt="Interior craftsmanship"
            word="Cabin"
            act="Act C / Cabin"
            warm
            copy="Trim, stitching and ambient light tailored around the driver. Your cabin, your spec."
            links={[
              { label: "03 Interior", href: "/shop?category=interior" },
              { label: "06 Audio", href: "/shop?category=audio" },
            ]}
          />
        </div>
      ) : (
        <>
          <PerformanceAct />
          <PresenceAct />
          <CabinAct />
        </>
      )}
    </section>
  );
}
