"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, useMotionValueEvent, useMotionValue } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type Chapter = {
  key: string;
  slug: string;
  number: string;
  category: string;
  statement: string;
  body: string;
  image: string;
};

const chapters: Chapter[] = [
  {
    key: "performance",
    slug: "performance",
    number: "01",
    category: "Performance",
    statement: "Power, Engineered.",
    body: "ECU tuning, intake, exhaust and performance upgrades selected for your vehicle and driving goals.",
    image: "https://images.unsplash.com/photo-1552656967-7a0991a13906?q=80&w=2400&auto=format&fit=crop",
  },
  {
    key: "wheels",
    slug: "wheels",
    number: "02",
    category: "Wheels & Stance",
    statement: "Built From The Ground Up.",
    body: "Forged alloys, premium tyres and fitment engineered to give your car the right stance.",
    image: "https://images.unsplash.com/photo-1698533188477-5fd401563eaa?q=80&w=2400&auto=format&fit=crop",
  },
  {
    key: "interior",
    slug: "interior",
    number: "03",
    category: "Interior",
    statement: "Your Cabin. Your Spec.",
    body: "Premium materials, trim, steering and interior upgrades tailored around the driver.",
    image: "https://images.unsplash.com/photo-1629820408206-e9fc918abf63?q=80&w=2400&auto=format&fit=crop",
  },
  {
    key: "exterior",
    slug: "exterior",
    number: "04",
    category: "Exterior",
    statement: "Presence By Design.",
    body: "Aero, body styling and exterior upgrades that sharpen the vehicle without compromising its character.",
    image: "https://images.unsplash.com/photo-1714434087915-27cfbdd3b048?q=80&w=2400&auto=format&fit=crop",
  },
  {
    key: "lighting",
    slug: "lighting",
    number: "05",
    category: "Lighting",
    statement: "Seen. Remembered.",
    body: "Headlights, ambient lighting and illumination upgrades designed for presence day and night.",
    image: "https://images.unsplash.com/photo-1616761879141-f485e5fed5df?q=80&w=2400&auto=format&fit=crop",
  },
  {
    key: "audio",
    slug: "audio",
    number: "06",
    category: "Car Audio",
    statement: "Sound, Sculpted.",
    body: "Premium speakers, amplifiers and subwoofer systems engineered specifically for the vehicle cabin.",
    image: "https://images.unsplash.com/photo-1776176359206-a1d34436ddff?q=80&w=2400&auto=format&fit=crop",
  },
  {
    key: "protection",
    slug: "protection",
    number: "07",
    category: "Paint & Protection",
    statement: "Preserved. Protected.",
    body: "PPF, ceramic coating and detailing solutions designed to preserve the vehicle's finish.",
    image: "https://images.unsplash.com/photo-1620584898989-d39f7f9ed1b7?q=80&w=2400&auto=format&fit=crop",
  },
];

/** Individual chapter background layer — calls useTransform at top level (valid hook usage) */
function ChapterBackground({
  chapter,
  index,
  total,
  scrollYProgress,
}: {
  chapter: Chapter;
  index: number;
  total: number;
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const start = index / total;
  const end = (index + 1) / total;
  const fadeInEnd = start + 0.03;
  const fadeOutStart = end - 0.03;

  const opacity = useTransform(
    scrollYProgress,
    [start, fadeInEnd, fadeOutStart, end],
    [0, 1, 1, 0]
  );

  return (
    <motion.div
      style={{ opacity }}
      className="absolute inset-0 will-change-opacity"
    >
      <Image
        src={chapter.image}
        alt={chapter.category}
        fill
        sizes="100vw"
        className="object-cover scale-105"
        priority={index === 0}
      />
      <div className="absolute inset-0 bg-black/55" />
      <div className="absolute inset-0 bg-gradient-to-r from-[rgba(3,4,5,0.95)] via-[rgba(3,4,5,0.6)] to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40" />
    </motion.div>
  );
}

function ActiveIndexDisplay({ mv, total }: { mv: ReturnType<typeof useMotionValue<number>>; total: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  useMotionValueEvent(mv, "change", (v) => {
    if (ref.current) {
      const idx = Math.round(v);
      ref.current.textContent = `${String(idx + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;
    }
  });
  return <span ref={ref}>01 / {String(total).padStart(2, "0")}</span>;
}

function ChapterContent({ chapters: chs, activeMV }: { chapters: Chapter[]; activeMV: ReturnType<typeof useMotionValue<number>> }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lastIndex = useRef(0);

  useMotionValueEvent(activeMV, "change", (v) => {
    const idx = Math.round(v);
    if (idx === lastIndex.current || !containerRef.current) return;
    lastIndex.current = idx;

    const ch = chs[idx];
    if (!ch) return;

    const els = containerRef.current.children;
    const catEl = els[0] as HTMLElement;
    const stmtEl = els[1] as HTMLElement;
    const bodyEl = els[2] as HTMLElement;
    const ctaEl = els[3] as HTMLElement;
    const linkEl = ctaEl.querySelector("a");

    catEl.style.opacity = "0";
    catEl.style.transform = "translateY(-10px)";
    stmtEl.style.opacity = "0";
    stmtEl.style.transform = "translateY(-8px)";
    bodyEl.style.opacity = "0";
    bodyEl.style.transform = "translateY(-6px)";
    ctaEl.style.opacity = "0";

    setTimeout(() => {
      catEl.textContent = ch.category;
      stmtEl.textContent = ch.statement;
      bodyEl.textContent = ch.body;
      if (linkEl) {
        linkEl.href = `/shop?category=${ch.slug}`;
        linkEl.lastChild!.textContent = ` Explore ${ch.category}`;
      }

      requestAnimationFrame(() => {
        catEl.style.transition = "opacity 0.4s ease, transform 0.4s ease";
        catEl.style.opacity = "1";
        catEl.style.transform = "translateY(0)";
        stmtEl.style.transition = "opacity 0.4s ease 0.06s, transform 0.4s ease 0.06s";
        stmtEl.style.opacity = "1";
        stmtEl.style.transform = "translateY(0)";
        bodyEl.style.transition = "opacity 0.4s ease 0.12s, transform 0.4s ease 0.12s";
        bodyEl.style.opacity = "1";
        bodyEl.style.transform = "translateY(0)";
        ctaEl.style.transition = "opacity 0.3s ease 0.18s";
        ctaEl.style.opacity = "1";
      });
    }, 200);
  });

  const ch = chs[0];
  return (
    <div ref={containerRef} className="max-w-2xl">
      <h3 className="font-display text-[clamp(3.5rem,7vw,7rem)] font-bold uppercase leading-[0.8] tracking-[-0.04em] text-foreground transition-all duration-400">
        {ch.category}
      </h3>
      <p className="mt-3 text-[clamp(1.3rem,2.5vw,2rem)] font-medium uppercase leading-tight tracking-wide text-silver transition-all duration-400">
        {ch.statement}
      </p>
      <p className="mt-5 max-w-lg text-base leading-relaxed text-white/70 md:text-lg transition-all duration-400">
        {ch.body}
      </p>
      <div className="mt-8 transition-opacity duration-300">
        <Link
          href={`/shop?category=${ch.slug}`}
          className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-cyan transition-colors hover:text-cyan-light"
        >
          Explore {ch.category}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

function ChapterDot({ index, chapter, activeMV }: { index: number; chapter: Chapter; activeMV: ReturnType<typeof useMotionValue<number>> }) {
  const dotRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useMotionValueEvent(activeMV, "change", (v) => {
    const isActive = Math.round(v) === index;
    if (dotRef.current) {
      dotRef.current.className = `h-1.5 rounded-full transition-all duration-500 ${isActive ? "w-8 bg-cyan" : "w-1.5 bg-white/20"}`;
    }
    if (labelRef.current) {
      labelRef.current.className = `font-mono text-[8px] uppercase tracking-[0.15em] transition-colors duration-300 ${isActive ? "text-cyan" : "text-white/20"}`;
    }
  });

  return (
    <div className="flex items-center gap-3">
      <div ref={dotRef} className={`h-1.5 rounded-full transition-all duration-500 ${index === 0 ? "w-8 bg-cyan" : "w-1.5 bg-white/20"}`} />
      <span ref={labelRef} className={`font-mono text-[8px] uppercase tracking-[0.15em] transition-colors duration-300 ${index === 0 ? "text-cyan" : "text-white/20"}`}>
        {chapter.number}
      </span>
    </div>
  );
}

function PinnedUpgradeStory() {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeMotionValue = useMotionValue(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const idx = Math.min(chapters.length - 1, Math.floor(v * chapters.length));
    if (activeMotionValue.get() !== idx) {
      activeMotionValue.set(idx);
    }
  });

  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div ref={containerRef} className="relative h-[500vh]">
      <div className="sticky top-0 h-svh overflow-hidden bg-background">
        {/* Background images — each in its own component with valid hook usage */}
        {chapters.map((chapter, i) => (
          <ChapterBackground
            key={chapter.key}
            chapter={chapter}
            index={i}
            total={chapters.length}
            scrollYProgress={scrollYProgress}
          />
        ))}

        <div className="noise-overlay pointer-events-none absolute inset-0 z-[1] opacity-[0.02]" />

        {/* Content layer */}
        <div className="relative z-10 flex h-full flex-col justify-center px-4 md:px-8 lg:px-16">
          <div className="mx-auto w-full max-w-[1600px]">
            <div className="mb-8 flex items-center gap-4">
              <span className="font-mono text-[11px] font-bold tracking-[0.2em] text-cyan">
                <ActiveIndexDisplay mv={activeMotionValue} total={chapters.length} />
              </span>
              <div className="h-px w-16 bg-cyan/30" />
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-silver-muted">
                Transformation Sequence
              </span>
            </div>

            <ChapterContent chapters={chapters} activeMV={activeMotionValue} />
          </div>
        </div>

        {/* Bottom progress indicator */}
        <div className="absolute inset-x-0 bottom-0 z-20 h-px bg-white/[0.06]">
          <motion.div
            style={{ width: progressWidth }}
            className="h-full bg-cyan"
          />
        </div>

        {/* Chapter dots */}
        <div className="absolute right-6 top-1/2 z-20 hidden -translate-y-1/2 flex-col gap-3 xl:flex">
          {chapters.map((chapter, i) => (
            <ChapterDot key={chapter.key} index={i} chapter={chapter} activeMV={activeMotionValue} />
          ))}
        </div>
      </div>
    </div>
  );
}

function StaticUpgradeStory() {
  return (
    <div className="space-y-0">
      {chapters.map((chapter) => (
        <div key={chapter.key} className="relative min-h-[70vh] overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src={chapter.image}
              alt={chapter.category}
              fill
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/55" />
            <div className="absolute inset-0 bg-gradient-to-r from-[rgba(3,4,5,0.95)] via-[rgba(3,4,5,0.6)] to-transparent" />
          </div>
          <div className="relative z-10 flex h-full items-center px-4 py-20 md:px-8">
            <div className="mx-auto w-full max-w-[1600px]">
              <div className="max-w-xl">
                <p className="mb-2 font-mono text-[11px] font-bold tracking-[0.2em] text-cyan">
                  {chapter.number}
                </p>
                <h3 className="font-display text-[clamp(3rem,5.5vw,4.5rem)] font-bold uppercase leading-[0.9] tracking-tight text-foreground">
                  {chapter.category}
                </h3>
                <p className="mt-3 text-[clamp(1.4rem,2.5vw,2rem)] font-medium uppercase leading-tight tracking-wide text-silver">
                  {chapter.statement}
                </p>
                <p className="mt-5 max-w-[500px] text-lg leading-relaxed text-white/70">
                  {chapter.body}
                </p>
                <Link
                  href={`/shop?category=${chapter.slug}`}
                  className="mt-8 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-cyan transition-colors hover:text-cyan-light"
                >
                  Explore {chapter.category}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function UpgradeStory() {
  const reducedMotion = useReducedMotion();

  return (
    <section className="relative z-20 bg-background">
      <div className="mx-auto max-w-[1600px] px-4 pt-20 pb-8 md:px-8 md:pt-28 md:pb-12">
        <span className="mb-3 inline-block font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-cyan">
          03 / Transform It
        </span>
        <h2 className="font-display text-5xl font-bold uppercase leading-[0.9] tracking-tight text-foreground md:text-7xl">
          Every Upgrade.
          <br />
          <span className="text-silver">One Vision.</span>
        </h2>
      </div>

      {reducedMotion ? <StaticUpgradeStory /> : <PinnedUpgradeStory />}
    </section>
  );
}
