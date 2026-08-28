"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { staggerContainer, fadeInUp } from "@/lib/animations";

export function FinalCTA() {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], reducedMotion ? ["0%", "0%"] : ["-8%", "8%"]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], reducedMotion ? [1, 1, 1] : [1.1, 1, 1.05]);

  return (
    <section
      ref={containerRef}
      className="relative z-20 h-screen min-h-[600px] overflow-hidden bg-background"
    >
      {/* Background image with parallax */}
      <motion.div style={{ y: reducedMotion ? 0 : y, scale: reducedMotion ? 1 : scale }} className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=2400&auto=format&fit=crop"
          alt="Cartunez build"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/60" />
      </motion.div>

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="max-w-4xl"
        >
          <motion.span
            variants={fadeInUp}
            className="mb-4 inline-block text-xs font-semibold uppercase tracking-[0.25em] text-cyan"
          >
            Start Your Build
          </motion.span>
          <motion.h2
            variants={fadeInUp}
            className="font-display text-5xl font-bold uppercase leading-[0.9] tracking-tight text-foreground md:text-8xl"
          >
            Get Your Car
            <br />
            <span className="text-silver">Rolling In Style.</span>
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="mx-auto mt-6 max-w-lg text-lg leading-relaxed text-silver-muted"
          >
            Built around your car. Finished your way.
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Button asChild size="lg" className="bg-cyan text-black hover:bg-cyan-light">
              <Link href="/#vehicle-selector" className="gap-2">
                Start Your Build <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-border bg-transparent text-foreground hover:border-cyan hover:text-cyan"
            >
              <Link href="/shop" className="gap-2">
                <ShoppingBag className="h-4 w-4" /> Shop Accessories
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
