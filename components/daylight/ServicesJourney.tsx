"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useTransform } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Drift, MaskLines, Reveal, useMountedReducedMotion, usePinnedProgress } from "./fx";
import { cn } from "@/lib/utils";

const SERVICES = [
  { n: "01", title: "Performance Tuning", note: "ECU / Intake / Exhaust mapping", img: "https://images.unsplash.com/photo-1489824904134-891ab64532f1?q=80&w=1600&auto=format&fit=crop" },
  { n: "02", title: "Exhaust Systems", note: "Valved / Titanium / Carbon", img: "https://images.unsplash.com/photo-1614026480209-cd9934144671?q=80&w=1600&auto=format&fit=crop" },
  { n: "03", title: "Audio", note: "Speakers / DSP / Subwoofers", img: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=1600&auto=format&fit=crop" },
  { n: "04", title: "Wheels", note: "Alloys / Tires / Alignment", img: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?q=80&w=1600&auto=format&fit=crop" },
  { n: "05", title: "Protection Films", note: "PPF / Ceramic / Sunfilm", img: "https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=1600&auto=format&fit=crop" },
];

/**
 * Services journey — pinned horizontal scrub on desktop (each panel photo
 * drifts internally for parallax-within-parallax), calm vertical stack on
 * mobile and under reduced motion.
 */
export function ServicesJourney() {
  const ref = useRef<HTMLElement>(null);
  const progress = usePinnedProgress(ref);
  const reduce = useMountedReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const [shift, setShift] = useState(0);
  const x = useTransform(progress, [0, 1], [0, -shift]);

  useEffect(() => {
    const measure = () => {
      const el = trackRef.current;
      if (el) setShift(Math.max(0, el.scrollWidth - window.innerWidth));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  if (reduce) {
    return (
      <section className="bg-surface py-24 md:py-32">
        <div className="site-container">
          <SectionHead />
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {SERVICES.map((s) => (
              <ServiceCard key={s.n} service={s} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* Desktop: pinned horizontal journey */}
      <section ref={ref} className="relative hidden h-[420vh] bg-surface lg:block">
        <div className="sticky top-0 flex h-svh min-h-[620px] flex-col justify-center overflow-hidden">
          <div className="site-container mb-10 flex items-end justify-between">
            <div>
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-red-deep">
                02 / What we do
              </p>
              <h2 className="font-display mt-4 text-6xl font-bold uppercase leading-[0.9] tracking-tight text-ink">
                Five crafts.
              </h2>
            </div>
            <p className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-ink-mute">
              Scroll to travel <ArrowRight className="h-4 w-4 text-red" aria-hidden />
            </p>
          </div>
          <motion.div ref={trackRef} style={{ x }} className="flex w-max gap-6 px-[7vw]">
            {SERVICES.map((s, i) => (
              <article
                key={s.n}
                className="group relative w-[62vw] max-w-[760px] shrink-0 overflow-hidden rounded-sm bg-raised"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Drift progress={progress} from={36 - i * 6} to={-36 + i * 6} className="absolute inset-0">
                    <Image
                      src={s.img}
                      alt={s.title}
                      fill
                      sizes="60vw"
                      className="scale-[1.15] object-cover transition duration-700 group-hover:saturate-125"
                    />
                  </Drift>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <span className="absolute left-5 top-5 font-display text-5xl font-bold text-white/85">
                    {s.n}
                  </span>
                  <span className="absolute bottom-5 right-5 flex h-11 w-11 items-center justify-center rounded-sm bg-white/15 text-white backdrop-blur-md transition group-hover:bg-red">
                    <ArrowUpRight className="h-4 w-4" aria-hidden />
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4 p-5 md:p-6">
                  <div>
                    <h3 className="font-display text-2xl font-bold uppercase tracking-tight text-ink md:text-3xl">
                      {s.title}
                    </h3>
                    <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-mute">
                      {s.note}
                    </p>
                  </div>
                  <Link
                    href="/shop"
                    aria-label={`${s.title} in the shop`}
                    className="shrink-0 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-red-deep hover:text-red"
                  >
                    Shop →
                  </Link>
                </div>
              </article>
            ))}
            {/* End cap */}
            <div className="flex w-[30vw] shrink-0 items-center justify-center">
              <Link
                href="/shop"
                className="inline-flex min-h-12 items-center gap-2 rounded-sm bg-ink px-6 font-mono text-xs font-bold uppercase tracking-[0.16em] text-paper transition hover:bg-red"
              >
                All upgrades <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mobile / tablet: calm stack */}
      <section className="bg-surface py-24 md:py-32 lg:hidden">
        <div className="site-container">
          <SectionHead />
          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {SERVICES.map((s) => (
              <ServiceCard key={s.n} service={s} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function SectionHead() {
  return (
    <Reveal>
      <p className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-red-deep">
        02 / What we do
      </p>
      <h2 className="font-display mt-4 text-5xl font-bold uppercase leading-[0.9] tracking-tight text-ink md:text-7xl">
        Five crafts.
      </h2>
    </Reveal>
  );
}

function ServiceCard({ service: s }: { service: (typeof SERVICES)[number] }) {
  return (
    <Reveal className="h-full">
      <article className="group flex h-full flex-col overflow-hidden rounded-sm bg-raised">
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={s.img}
            alt={s.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition duration-700 group-hover:scale-[1.04]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <span className="absolute left-4 top-4 font-display text-4xl font-bold text-white/85">
            {s.n}
          </span>
        </div>
        <div className="flex flex-1 items-center justify-between gap-4 p-5">
          <div>
            <h3 className="font-display text-xl font-bold uppercase tracking-tight text-ink">
              {s.title}
            </h3>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-mute">
              {s.note}
            </p>
          </div>
          <Link
            href="/shop"
            aria-label={`${s.title} in the shop`}
            className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-sm border border-ink/15",
              "text-ink transition hover:border-red hover:bg-red hover:text-white"
            )}
          >
            <ArrowUpRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </article>
    </Reveal>
  );
}

export function ServicesHeading() {
  return (
    <MaskLines
      className="font-display text-6xl font-bold uppercase leading-[0.9] tracking-tight text-ink"
      lines={["Five crafts."]}
    />
  );
}
