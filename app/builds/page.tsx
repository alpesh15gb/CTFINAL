"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Wrench } from "lucide-react";
import { builds } from "@/data/builds";
import { staggerContainer, fadeInUp } from "@/lib/animations";

export default function BuildsPage() {
  return (
    <main className="min-h-screen bg-background pb-24 pt-28">
      <div className="mx-auto max-w-[1600px] px-4 md:px-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="mb-12"
        >
          <motion.h1
            variants={fadeInUp}
            className="font-display text-5xl font-bold uppercase tracking-tight text-foreground md:text-7xl"
          >
            Built By Cartunez.
          </motion.h1>
          <motion.p
            variants={fadeInUp}
            className="mt-4 max-w-xl text-lg text-silver-muted"
          >
            Real customer builds, real transformations. Each project is a
            collaboration between driver and tuner.
          </motion.p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {builds.map((build, idx) => (
            <motion.div
              key={build.id}
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: idx * 0.1 }}
              className="group relative overflow-hidden rounded-xl border border-border bg-raised"
            >
              <Link href={`/builds/${build.slug}`}>
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={build.image}
                    alt={build.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-raised via-raised/30 to-transparent" />
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-silver-muted">
                    <span>{build.year}</span>
                    <span className="h-1 w-1 rounded-full bg-silver-muted" />
                    <span>{build.vehicle}</span>
                  </div>
                  <h2 className="mt-2 font-display text-2xl font-semibold uppercase text-foreground transition-colors group-hover:text-cyan">
                    {build.title}
                  </h2>
                  <p className="mt-3 line-clamp-2 text-sm text-silver-muted">
                    {build.story}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm text-silver-muted">
                      <Wrench className="h-4 w-4 text-cyan" />
                      {build.upgradeCount} upgrades
                    </span>
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-cyan">
                      View Build <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
