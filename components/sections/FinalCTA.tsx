"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, MessageSquareText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { staggerContainer, fadeInUp } from "@/lib/animations";

export function FinalCTA() {
  const containerRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], reducedMotion ? ["0%", "0%"] : ["-5%", "5%"]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], reducedMotion ? [1, 1, 1] : [1.06, 1, 1.03]);

  return (
    <section
      ref={containerRef}
      className="relative z-20 min-h-[80vh] overflow-hidden bg-background md:h-svh"
    >
      {/* Parallax background image */}
      <motion.div
        style={{ y: reducedMotion ? 0 : y, scale: reducedMotion ? 1 : scale }}
        className="absolute -inset-y-[6%] inset-x-0"
      >
        <Image
          src="https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=2400&auto=format&fit=crop"
          alt="A premium Cartunez vehicle build at night"
          fill
          className="object-cover object-center saturate-[0.7]"
          sizes="100vw"
        />
      </motion.div>

      <div className="absolute inset-0 bg-black/50" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,4,5,0.97)_0%,rgba(3,4,5,0.75)_50%,rgba(3,4,5,0.1)_85%)]" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/60" />
      <div className="precision-grid absolute inset-0 opacity-30" />
      <div className="noise-overlay absolute inset-0 opacity-[0.02]" />

      {/* Oversized ghosted brand text */}
      <div className="pointer-events-none absolute inset-0 flex items-end justify-center">
        <span className="ghost-type select-none translate-y-[15%] font-display text-[22vw] font-bold uppercase leading-none tracking-tighter">
          CARTUNEZ
        </span>
      </div>

      <div className="site-container relative z-10 flex min-h-[80vh] flex-col justify-end py-16 md:h-full md:py-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid w-full items-end gap-12 lg:grid-cols-12"
        >
          <div className="lg:col-span-9">
            <motion.p variants={fadeInUp} className="technical-label">
              Start Your Build
            </motion.p>
            <motion.h2
              variants={fadeInUp}
              className="mt-6 max-w-6xl font-display text-[clamp(3.5rem,9vw,8.5rem)] font-bold uppercase leading-[0.76] tracking-[-0.045em] text-foreground"
            >
              Your car.
              <br />
              Your spec.
              <span className="display-outline block">Built beyond factory.</span>
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="mt-8 max-w-xl text-lg leading-relaxed text-white/60 md:text-xl"
            >
              Tell us what you drive and where you want to take it. We&apos;ll build a fitment-checked shortlist around your taste.
            </motion.p>
            <motion.div variants={fadeInUp} className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/#vehicle-selector" className="gap-3">
                  Match my vehicle <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white/20 bg-black/25 text-white backdrop-blur-sm hover:bg-white/10">
                <Link href="/contact" className="gap-3">
                  <MessageSquareText className="h-4 w-4" aria-hidden="true" /> Expert consultation
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white/20 bg-black/25 text-white backdrop-blur-sm hover:bg-white/10">
                <Link href="/shop" className="gap-3">
                  Shop upgrades
                </Link>
              </Button>
            </motion.div>
          </div>

          <motion.div variants={fadeInUp} className="glass-panel hidden p-6 lg:col-span-3 lg:block">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan">Build support</p>
            <p className="mt-3 font-display text-2xl uppercase leading-none text-foreground">Human advice. Exact parts.</p>
            <p className="mt-4 text-sm leading-relaxed text-silver-muted">From first concept to final install, our team helps keep every choice cohesive.</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
