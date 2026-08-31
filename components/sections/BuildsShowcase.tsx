"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { builds } from "@/data/builds";
import { staggerContainer, fadeInUp } from "@/lib/animations";
import { TextReveal } from "@/components/animations";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function BuildsShowcase() {
  const reducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const heroImageY = useTransform(scrollYProgress, [0, 1], reducedMotion ? ["0%", "0%"] : ["-8%", "8%"]);
  const heroImageScale = useTransform(scrollYProgress, [0, 0.5, 1], reducedMotion ? [1, 1, 1] : [1.06, 1, 1.03]);

  return (
    <section ref={containerRef} className="relative z-20 overflow-hidden bg-background pt-16 pb-24 md:pt-20 md:pb-32">
      <div className="atmo-glow pointer-events-none absolute inset-0" />

      <div className="relative mx-auto max-w-[1600px] px-4 md:px-8">
        {/* Editorial header with asymmetric layout */}
        <div className="mb-16 lg:grid lg:grid-cols-12 lg:gap-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="lg:col-span-7 lg:flex lg:flex-col lg:justify-end"
          >
            <motion.span
              variants={fadeInUp}
              className="mb-3 inline-block font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-cyan"
            >
              05 / Portfolio
            </motion.span>
            <motion.h2
              variants={fadeInUp}
              className="font-display text-[clamp(3.5rem,8vw,8rem)] font-bold uppercase leading-[0.8] tracking-[-0.05em] text-foreground"
            >
              <TextReveal by="word" stagger={0.03}>Built By</TextReveal>
              <br />
              <span className="text-silver">
                <TextReveal by="word" stagger={0.03}>Cartunez.</TextReveal>
              </span>
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="mt-6 max-w-md text-lg leading-relaxed text-silver-muted"
            >
              Every build is a statement. Explore transformations engineered for
              presence, performance and precision.
            </motion.p>
            <motion.div variants={fadeInUp} className="mt-8">
              <Button
                asChild
                variant="outline"
                className="border-border bg-transparent text-foreground hover:border-cyan hover:text-cyan"
              >
                <Link href="/builds" className="gap-2">
                  View All Builds <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Hero build — large cinematic image */}
          <motion.div
            style={{ y: heroImageY, scale: heroImageScale }}
            className="relative mt-10 aspect-[4/3] overflow-hidden lg:col-span-5 lg:mt-0 lg:aspect-[3/4]"
          >
            <Image
              src={builds[0]?.image ?? ""}
              alt={builds[0]?.title ?? "Featured build"}
              fill
              sizes="(max-width: 1024px) 100vw, 42vw"
              className="object-cover saturate-[0.85]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-cyan">Featured Build</p>
              <p className="mt-2 font-display text-4xl font-bold uppercase leading-none text-foreground md:text-5xl">
                {builds[0]?.title}
              </p>
              <div className="mt-3 flex items-center gap-4 font-mono text-[10px] uppercase tracking-wider text-silver-muted">
                <span>{builds[0]?.year}</span>
                <span className="h-1 w-1 rounded-full bg-silver-muted" />
                <span>{builds[0]?.vehicle}</span>
                <span className="h-1 w-1 rounded-full bg-silver-muted" />
                <span>{builds[0]?.upgradeCount} Upgrades</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Remaining builds — editorial asymmetric grid */}
        <div className="grid gap-1 sm:grid-cols-2 lg:grid-cols-12 lg:gap-2">
          {builds.slice(1).map((build, idx) => {
            const wide = idx % 3 === 0;
            return (
              <motion.div
                key={build.id}
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: idx * 0.08 }}
                className={`group relative overflow-hidden border-b border-border ${
                  wide ? "lg:col-span-7" : "lg:col-span-5"
                }`}
              >
                <Link href={`/builds/${build.slug}`} className="block">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={build.image}
                      alt={build.title}
                      fill
                      sizes={wide ? "(max-width: 1024px) 100vw, 58vw" : "(max-width: 1024px) 100vw, 42vw"}
                      className="object-cover saturate-[0.8] transition duration-1000 ease-out-expo group-hover:scale-[1.04] group-hover:saturate-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  </div>
                  <div className="bg-raised px-5 py-5 md:px-6 md:py-6">
                    <div className="flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.15em] text-silver-muted">
                      <span>{build.year}</span>
                      <span className="h-1 w-1 rounded-full bg-silver-muted" />
                      <span>{build.vehicle}</span>
                    </div>
                    <h3 className="mt-2 font-display text-2xl font-semibold uppercase text-foreground transition-colors group-hover:text-cyan md:text-3xl">
                      {build.title}
                    </h3>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-silver-muted">
                        <Wrench className="h-3.5 w-3.5 text-cyan" />
                        {build.upgradeCount} Upgrades
                      </div>
                      <span className="inline-flex items-center gap-1 text-xs font-medium uppercase tracking-wider text-cyan opacity-0 transition-opacity group-hover:opacity-100">
                        View Build <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
