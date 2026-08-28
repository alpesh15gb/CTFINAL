"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { builds } from "@/data/builds";
import { staggerContainer, fadeInUp } from "@/lib/animations";
import { ImageReveal, TextReveal } from "@/components/animations";

export function BuildsShowcase() {
  return (
    <section className="relative z-20 overflow-hidden bg-background pt-16 pb-24 md:pt-20 md:pb-32">
      {/* Atmospheric background */}
      <div className="atmo-glow pointer-events-none absolute inset-0" />
      <div className="ghost-type pointer-events-none absolute -right-10 top-10 select-none font-display text-[20vw] font-bold uppercase leading-none tracking-tighter opacity-60">
        Builds
      </div>

      <div className="relative mx-auto max-w-[1600px] px-4 md:px-8">
        {/* Editorial header: left typography + right cinematic image */}
        <div className="mb-16 grid items-center gap-10 lg:grid-cols-2">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.span
              variants={fadeInUp}
              className="mb-3 inline-block text-xs font-semibold uppercase tracking-[0.25em] text-cyan"
            >
              05 / Portfolio
            </motion.span>
            <motion.h2
              variants={fadeInUp}
              className="font-display text-6xl font-bold uppercase leading-[0.9] tracking-tight text-foreground md:text-8xl"
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

          {/* Right cinematic image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative hidden aspect-[4/3] overflow-hidden rounded-xl border border-border lg:block"
          >
            <Image
              src={builds[0]?.image ?? ""}
              alt={builds[0]?.title ?? "Featured build"}
              fill
              sizes="50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6">
              <p className="text-xs uppercase tracking-widest text-cyan">Featured</p>
              <p className="mt-1 font-display text-3xl font-semibold uppercase text-foreground">
                {builds[0]?.title}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Builds grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {builds.map((build, idx) => (
            <motion.div
              key={build.id}
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: idx * 0.1 }}
              className="group relative overflow-hidden rounded-lg border border-border bg-raised"
            >
              <Link href={`/builds/${build.slug}`}>
                <ImageReveal
                  src={build.image}
                  alt={build.title}
                  aspectRatio="aspect-[4/3]"
                  direction="up"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />

                <div className="p-5 md:p-6">
                  <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-silver-muted">
                    <span>{build.year}</span>
                    <span className="h-1 w-1 rounded-full bg-silver-muted" />
                    <span>{build.vehicle}</span>
                  </div>
                  <h3 className="mt-2 font-display text-2xl font-semibold uppercase text-foreground transition-colors group-hover:text-cyan">
                    {build.title}
                  </h3>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-silver-muted">
                      <Wrench className="h-4 w-4 text-cyan" />
                      {build.upgradeCount} Upgrades
                    </div>
                    <span className="inline-flex items-center gap-1 text-sm font-medium uppercase tracking-wider text-cyan">
                      Shop This Build <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
