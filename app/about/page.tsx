"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { staggerContainer, fadeInUp } from "@/lib/animations";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background pb-24 pt-28">
      <div className="mx-auto max-w-[1600px] px-4 md:px-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="grid gap-12 lg:grid-cols-2"
        >
          <motion.div variants={fadeInUp}>
            <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-[0.25em] text-cyan">
              About Cartunez
            </span>
            <h1 className="font-display text-5xl font-bold uppercase leading-[0.9] tracking-tight text-foreground md:text-7xl">
              Performance
              <br />
              <span className="text-silver">In Every Detail.</span>
            </h1>
            <div className="mt-8 space-y-4 text-lg leading-relaxed text-silver-muted">
              <p>
                Cartunez is a premium automotive accessories and customization
                destination built for drivers who refuse to settle for stock.
              </p>
              <p>
                We curate styling, protection, lighting, wheels and performance
                upgrades around real vehicles, so every product we sell is
                engineered to fit and finished to stand out.
              </p>
              <p>
                From our configurator to our build showcases, the experience is
                designed to help you visualize, select and install upgrades with
                confidence.
              </p>
            </div>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-raised lg:aspect-auto"
          >
            <Image
              src="https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=1600&auto=format&fit=crop"
              alt="Cartunez workshop"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </motion.div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="mt-24 grid gap-8 border-t border-border pt-16 sm:grid-cols-2 lg:grid-cols-4"
        >
          {[
            { value: "10,000+", label: "Cars transformed" },
            { value: "500+", label: "Premium products" },
            { value: "12", label: "Cities served" },
            { value: "2yr", label: "Warranty on upgrades" },
          ].map((stat) => (
            <motion.div key={stat.label} variants={fadeInUp}>
              <p className="font-display text-4xl font-semibold text-cyan">
                {stat.value}
              </p>
              <p className="mt-1 text-sm uppercase tracking-widest text-silver-muted">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </main>
  );
}
