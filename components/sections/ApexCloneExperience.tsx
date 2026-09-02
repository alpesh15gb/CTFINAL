"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { TEMPORARY_MACRO_ASSET } from "@/lib/heroConfig";

const HeroStudio = dynamic(
  () => import("@/components/three/HeroStudio").then((mod) => mod.HeroStudio),
  {
    ssr: false,
    loading: () => <div className="absolute inset-0 bg-[#050505]" />,
  }
);

const BLACK_SUPERCAR =
  "https://images.unsplash.com/photo-1577975396515-a6a5271697f3?auto=format&fit=crop&q=88&w=2400";
const GTR_SUNSET =
  "https://images.unsplash.com/photo-1773364710462-83e613f2a6ff?auto=format&fit=crop&q=88&w=2400";
const NIGHT_REAR =
  "https://images.unsplash.com/photo-1767272374026-178111631eca?auto=format&fit=crop&q=88&w=2400";
const TAILLIGHT =
  "https://images.unsplash.com/photo-1748988378280-008ea183d5f4?auto=format&fit=crop&q=88&w=2400";

const ease = [0.22, 1, 0.36, 1] as const;

function IntroCurtain() {
  const reducedMotion = useReducedMotion();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(false), reducedMotion ? 80 : 1180);
    return () => window.clearTimeout(timer);
  }, [reducedMotion]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] grid place-items-center overflow-hidden bg-[#020202]"
          initial={{ clipPath: "inset(0 0 0 0)" }}
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: reducedMotion ? 0.01 : 0.78, ease }}
        >
          <div className="relative flex flex-col items-center">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.55, ease }}
              className="mb-7 h-px w-24 origin-left bg-white/80"
            />
            <div className="overflow-hidden">
              <motion.p
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.62, delay: 0.12, ease }}
                className="font-display text-5xl font-semibold uppercase leading-none tracking-[-0.045em] text-white sm:text-7xl"
              >
                Cartunez
              </motion.p>
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="mt-4 font-mono text-[8px] uppercase tracking-[0.34em] text-white/45"
            >
              Performance / Design / Engineering
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function CinematicHero() {
  const ref = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const isInView = useInView(ref, { margin: "220px 0px" });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    mass: 0.5,
  });

  const openingOpacity = useTransform(progress, [0, 0.05, 0.28, 0.37], [0, 1, 1, 0]);
  const openingY = useTransform(progress, [0, 0.12, 0.36], [70, 0, -70]);
  const numberOpacity = useTransform(progress, [0.30, 0.39, 0.56, 0.64], [0, 1, 1, 0]);
  const numberScale = useTransform(progress, [0.34, 0.52, 0.64], [0.88, 1, 1.05]);
  const futureOpacity = useTransform(progress, [0.58, 0.70, 0.96], [0, 1, 1]);
  const futureY = useTransform(progress, [0.58, 0.74], [70, 0]);
  const canvasScale = useTransform(progress, [0, 0.48, 1], [1.05, 1, 1.12]);
  const shadeOpacity = useTransform(progress, [0.52, 0.78], [0.16, 0.52]);

  return (
    <section ref={ref} className="relative h-[300vh] bg-[#020202]">
      <div className="sticky top-0 h-svh min-h-[640px] overflow-hidden bg-[#020202]">
        <motion.div style={{ scale: canvasScale }} className="absolute inset-0 z-0">
          <HeroStudio
            scrollProgress={progress}
            reducedMotion={reducedMotion}
            active={isInView}
          />
        </motion.div>

        <div className="pointer-events-none absolute inset-0 z-[2] bg-[radial-gradient(circle_at_56%_52%,transparent_24%,rgba(0,0,0,.32)_57%,rgba(0,0,0,.9)_100%)]" />
        <motion.div
          style={{ opacity: shadeOpacity }}
          className="pointer-events-none absolute inset-0 z-[3] bg-black"
        />
        <div className="noise-overlay pointer-events-none absolute inset-0 z-[4] opacity-[0.035]" />

        <div className="absolute left-5 top-24 z-20 md:left-10 md:top-28">
          <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-white/55">
            Cartunez / Performance Division
          </p>
        </div>

        <motion.div
          style={{ opacity: openingOpacity, y: openingY }}
          className="pointer-events-none absolute inset-x-0 bottom-[12%] z-20 px-5 md:px-10"
        >
          <p className="max-w-[1280px] font-display text-[clamp(4.5rem,12vw,12.5rem)] font-semibold uppercase leading-[0.72] tracking-[-0.055em] text-white">
            Built beyond
            <br />
            factory.
          </p>
        </motion.div>

        <motion.div
          style={{ opacity: numberOpacity, scale: numberScale }}
          className="pointer-events-none absolute inset-0 z-20 flex items-center px-5 md:px-10"
        >
          <div className="w-full">
            <div className="flex items-center gap-6 md:gap-10">
              <span className="font-display text-[clamp(8rem,30vw,31rem)] font-semibold leading-[0.7] tracking-[-0.075em] text-white">
                480
              </span>
              <div className="hidden h-px flex-1 bg-white/70 md:block" />
            </div>
            <div className="mt-5 flex max-w-xl items-start justify-between border-t border-white/20 pt-4 font-mono text-[8px] uppercase tracking-[0.22em] text-white/55 md:text-[9px]">
              <span>CTZ / Design Study</span>
              <span>Performance / 01</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          style={{ opacity: futureOpacity, y: futureY }}
          className="absolute inset-0 z-20 flex items-center justify-center px-5 text-center md:px-10"
        >
          <div>
            <p className="font-display text-[clamp(4rem,11vw,11.5rem)] font-semibold uppercase leading-[0.76] tracking-[-0.055em] text-white">
              The future
              <br />
              has arrived.
            </p>
            <Link
              href="#every-angle"
              className="group pointer-events-auto mt-8 inline-flex min-h-11 items-center gap-3 border border-white/35 bg-black/20 px-5 font-mono text-[9px] font-bold uppercase tracking-[0.24em] text-white backdrop-blur-sm transition-colors hover:bg-white hover:text-black"
            >
              Discover
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </motion.div>

        <div className="absolute inset-x-5 bottom-6 z-30 flex items-end justify-between font-mono text-[8px] uppercase tracking-[0.22em] text-white/45 md:inset-x-10 md:text-[9px]">
          <span>01 / The machine</span>
          <span className="hidden sm:block">Scroll to direct the reveal</span>
          <span>2026 / Cartunez</span>
        </div>
      </div>
    </section>
  );
}

function ImagePanel({
  src,
  alt,
  className,
  objectPosition,
  delay = 0,
}: {
  src: string;
  alt: string;
  className?: string;
  objectPosition?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });

  return (
    <motion.div
      ref={ref}
      initial={{ clipPath: "inset(100% 0 0 0)" }}
      animate={inView ? { clipPath: "inset(0% 0 0 0)" } : undefined}
      transition={{ duration: 0.95, delay, ease }}
      className={`group relative overflow-hidden bg-[#080808] ${className ?? ""}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover brightness-[0.72] saturate-[0.78] contrast-[1.12] transition duration-1000 ease-out group-hover:scale-[1.035] group-hover:brightness-[0.88]"
        style={{ objectPosition: objectPosition ?? "center" }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/10" />
    </motion.div>
  );
}

function EveryAngle() {
  const titleRef = useRef<HTMLDivElement>(null);
  const titleInView = useInView(titleRef, { once: true, amount: 0.4 });

  return (
    <section id="every-angle" className="relative bg-[#050505] px-4 py-24 sm:px-6 md:py-32 lg:px-10 lg:py-40">
      <div className="mx-auto max-w-[1600px]">
        <div ref={titleRef} className="mb-10 overflow-hidden md:mb-14">
          <motion.h2
            initial={{ y: "105%" }}
            animate={titleInView ? { y: 0 } : undefined}
            transition={{ duration: 0.9, ease }}
            className="font-display text-[clamp(4.2rem,10vw,10rem)] font-semibold uppercase leading-[0.72] tracking-[-0.055em] text-white"
          >
            Every angle,
            <br />
            <span className="text-white/46">an argument.</span>
          </motion.h2>
        </div>

        <div className="grid auto-rows-[36vh] grid-cols-1 gap-2 md:grid-cols-12 md:auto-rows-[58vh]">
          <ImagePanel
            src={BLACK_SUPERCAR}
            alt="Dark performance car from the front quarter"
            className="md:col-span-5"
            objectPosition="50% 55%"
          />
          <ImagePanel
            src={TEMPORARY_MACRO_ASSET}
            alt="Forged wheel engineering detail"
            className="md:col-span-4"
            objectPosition="40% 50%"
            delay={0.08}
          />
          <ImagePanel
            src={GTR_SUNSET}
            alt="Performance car side and front stance"
            className="md:col-span-3"
            objectPosition="55% 65%"
            delay={0.16}
          />
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-white/15 pt-4 font-mono text-[8px] uppercase tracking-[0.22em] text-white/45 md:text-[9px]">
          <span>02 / Surface study</span>
          <span>Form follows force</span>
        </div>
      </div>
    </section>
  );
}

function CampaignFrame() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], [-35, 35]);
  const titleY = useTransform(scrollYProgress, [0, 1], [35, -35]);

  return (
    <section ref={ref} className="relative h-[120svh] min-h-[760px] overflow-hidden bg-black">
      <motion.div style={{ y: imageY }} className="absolute -inset-y-16 inset-x-0">
        <Image
          src={BLACK_SUPERCAR}
          alt="Black performance car in a cinematic frame"
          fill
          sizes="100vw"
          className="object-cover object-center brightness-[0.48] contrast-[1.18] saturate-[0.65]"
        />
      </motion.div>
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,.88)_0%,rgba(0,0,0,.45)_36%,rgba(0,0,0,.10)_68%,rgba(0,0,0,.48)_100%)]" />
      <div className="noise-overlay pointer-events-none absolute inset-0 opacity-[0.03]" />

      <motion.div style={{ y: titleY }} className="absolute inset-x-5 top-[21%] z-10 md:inset-x-10">
        <p className="font-mono text-[9px] uppercase tracking-[0.27em] text-white/55">Cartunez / Series 01</p>
        <p className="mt-8 font-display text-[clamp(9rem,31vw,34rem)] font-semibold leading-[0.58] tracking-[-0.075em] text-white">
          480
        </p>
      </motion.div>

      <div className="absolute inset-x-5 bottom-8 z-10 grid grid-cols-2 gap-6 border-t border-white/25 pt-4 md:inset-x-10 md:grid-cols-4">
        {[
          ["01", "Silhouette"],
          ["02", "Aero"],
          ["03", "Stance"],
          ["04", "Control"],
        ].map(([index, label]) => (
          <div key={index} className="font-mono text-[8px] uppercase tracking-[0.22em] text-white/50 md:text-[9px]">
            <span className="text-white">{index}</span>
            <span className="ml-3">{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function FutureFrame() {
  const ref = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const progress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, mass: 0.5 });
  const rearOpacity = useTransform(progress, [0, 0.38, 0.58], [1, 1, 0]);
  const tailOpacity = useTransform(progress, [0.32, 0.56, 1], [0, 1, 1]);
  const tailScale = useTransform(progress, [0.32, 1], [1.08, 1]);
  const textOpacity = useTransform(progress, [0.08, 0.22, 0.90], [0, 1, 1]);
  const textY = useTransform(progress, [0.08, 0.28], [70, 0]);

  return (
    <section ref={ref} className="relative h-[190vh] bg-black">
      <div className="sticky top-0 h-svh min-h-[640px] overflow-hidden bg-black">
        <motion.div style={{ opacity: rearOpacity }} className="absolute inset-0">
          <Image
            src={NIGHT_REAR}
            alt="Dark performance sedan at night"
            fill
            sizes="100vw"
            className="object-cover brightness-[0.46] contrast-[1.25] saturate-[0.78]"
          />
        </motion.div>
        <motion.div style={{ opacity: tailOpacity, scale: reducedMotion ? 1 : tailScale }} className="absolute inset-0">
          <Image
            src={TAILLIGHT}
            alt="Red taillight in darkness"
            fill
            sizes="100vw"
            className="object-cover object-center brightness-[0.55] contrast-[1.26] saturate-[1.08]"
          />
        </motion.div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_48%,transparent_15%,rgba(0,0,0,.36)_55%,rgba(0,0,0,.86)_100%)]" />
        <div className="absolute inset-0 bg-black/15" />
        <div className="noise-overlay pointer-events-none absolute inset-0 opacity-[0.035]" />

        <motion.div
          style={{ opacity: textOpacity, y: textY }}
          className="absolute inset-0 z-10 flex items-center justify-center px-5 text-center md:px-10"
        >
          <div>
            <p className="font-display text-[clamp(4.5rem,12vw,12.5rem)] font-semibold uppercase leading-[0.74] tracking-[-0.055em] text-white">
              The future
              <br />
              has arrived.
            </p>
            <p className="mx-auto mt-7 max-w-xl font-mono text-[9px] uppercase leading-6 tracking-[0.23em] text-white/52 md:text-[10px]">
              Performance, fitment and finish engineered as one system.
            </p>
          </div>
        </motion.div>

        <div className="absolute inset-x-5 bottom-6 z-20 flex items-end justify-between font-mono text-[8px] uppercase tracking-[0.22em] text-white/45 md:inset-x-10 md:text-[9px]">
          <span>03 / Arrival</span>
          <span>Cartunez / India</span>
        </div>
      </div>
    </section>
  );
}

function Manifesto() {
  return (
    <section className="bg-[#050505] px-5 py-28 md:px-10 md:py-40">
      <div className="mx-auto grid max-w-[1600px] gap-12 border-y border-white/12 py-16 md:grid-cols-12 md:py-24">
        <div className="md:col-span-3">
          <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-white/50">04 / Cartunez</p>
        </div>
        <div className="md:col-span-9">
          <h2 className="font-display text-[clamp(4rem,8vw,8rem)] font-semibold uppercase leading-[0.8] tracking-[-0.05em] text-white">
            We don&apos;t modify cars.
            <br />
            <span className="text-white/40">We re-engineer the experience.</span>
          </h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              ["01", "Performance", "Power delivery calibrated around the complete vehicle."],
              ["02", "Design", "Proportion, finish and detail considered from every angle."],
              ["03", "Fitment", "Vehicle-specific hardware, measured and verified before install."],
            ].map(([index, title, copy]) => (
              <div key={index} className="border-t border-white/16 pt-4">
                <p className="font-mono text-[8px] uppercase tracking-[0.24em] text-white/42">{index}</p>
                <h3 className="mt-6 font-display text-3xl font-semibold uppercase tracking-tight text-white">{title}</h3>
                <p className="mt-3 max-w-xs text-sm leading-6 text-white/50">{copy}</p>
              </div>
            ))}
          </div>
          <Link
            href="#vehicle-selector"
            className="group mt-14 inline-flex min-h-12 items-center gap-4 border-b border-white pb-2 font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-white"
          >
            Configure your car
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export function ApexCloneExperience() {
  return (
    <>
      <IntroCurtain />
      <CinematicHero />
      <CampaignFrame />
      <EveryAngle />
      <FutureFrame />
      <Manifesto />
    </>
  );
}
