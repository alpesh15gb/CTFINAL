"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { builds } from "@/data/builds";
import { Drift, MaskLines, Reveal, useSectionProgress } from "./fx";
import { cn } from "@/lib/utils";

/**
 * Builds showcase — alternating parallax rows. Photos drift inside their
 * frames while captions rise on entry. Real customer builds, live links.
 */
export function BuildsLight() {
  const ref = useRef<HTMLElement>(null);
  const progress = useSectionProgress(ref);
  const featured = builds.slice(0, 3);

  return (
    <section ref={ref} className="relative overflow-hidden bg-background py-24 md:py-36">
      <div className="site-container">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <Reveal>
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-red-deep">
                03 / Proof on wheels
              </p>
            </Reveal>
            <MaskLines
              className="font-display mt-4 text-5xl font-bold uppercase leading-[0.9] tracking-tight text-ink md:text-8xl"
              lines={["Built,", "not bought."]}
            />
          </div>
          <Reveal delay={0.15}>
            <Link
              href="/builds"
              className="inline-flex min-h-12 items-center gap-2 rounded-sm border border-ink/20 px-6 font-mono text-xs font-bold uppercase tracking-[0.16em] text-ink transition hover:border-ink hover:bg-ink hover:text-paper"
            >
              All builds <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </Reveal>
        </div>

        <div className="mt-14 space-y-16 md:mt-20 md:space-y-24">
          {featured.map((build, i) => (
            <article
              key={build.id}
              className={cn(
                "grid items-center gap-6 md:gap-10 lg:grid-cols-12",
                i % 2 === 1 && "lg:[&>*:first-child]:order-2"
              )}
            >
              <Link
                href={`/builds/${build.slug}`}
                className="group relative block overflow-hidden rounded-sm lg:col-span-7"
                aria-label={`View the ${build.title} ${build.vehicle} build`}
              >
                <div className="relative aspect-[16/10]">
                  <Drift
                    progress={progress}
                    from={i % 2 === 0 ? 46 : -46}
                    to={i % 2 === 0 ? -46 : 46}
                    className="absolute inset-0"
                  >
                    <Image
                      src={build.image}
                      alt={`${build.title} ${build.vehicle}`}
                      fill
                      sizes="(max-width: 1024px) 100vw, 58vw"
                      className="scale-[1.12] object-cover transition duration-700 group-hover:scale-[1.16]"
                    />
                  </Drift>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                  <span className="absolute bottom-4 left-4 flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-white/90">
                    <span className="inline-block h-[6px] w-[6px] bg-red" aria-hidden />
                    {build.location} — {build.year}
                  </span>
                </div>
              </Link>
              <Reveal delay={0.1} className="lg:col-span-5">
                <p className="font-mono text-[10px] font-bold tracking-[0.3em] text-ink-mute">
                  / {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="font-display mt-3 text-4xl font-bold uppercase leading-[0.9] tracking-tight text-ink md:text-6xl">
                  {build.title}
                </h3>
                <p className="mt-3 font-mono text-xs uppercase tracking-[0.2em] text-ink-soft">
                  {build.vehicle} — {build.upgradeCount} upgrades
                </p>
                <Link
                  href={`/builds/${build.slug}`}
                  className="mt-6 inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.18em] text-red-deep transition hover:text-red"
                >
                  View build <ArrowUpRight className="h-4 w-4" aria-hidden />
                </Link>
              </Reveal>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
