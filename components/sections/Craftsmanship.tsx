"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { TextReveal } from "@/components/animations";

const steps = [
  {
    number: "01",
    title: "Design",
    subtitle: "Precision Engineering",
    description: "Every accessory begins as a 3D scan of your vehicle, ensuring millimeter-perfect fitment.",
    image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=1600&auto=format&fit=crop",
  },
  {
    number: "02",
    title: "Material",
    subtitle: "Premium Selection",
    description: "Carbon fibre, forged aluminium, OEM-grade plastics — only the finest materials make the cut.",
    image: "https://images.unsplash.com/photo-1558556579-a8fef2bf1861?q=80&w=1600&auto=format&fit=crop",
  },
  {
    number: "03",
    title: "Craft",
    subtitle: "Hand-Finished",
    description: "CNC-machined accents, hand-polished surfaces, and UV-protected coatings for lasting beauty.",
    image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=1600&auto=format&fit=crop",
  },
  {
    number: "04",
    title: "Install",
    subtitle: "Factory-Grade Fit",
    description: "Plug-and-play harnesses and OEM mounting points mean no drilling, no cutting, no compromise.",
    image: "https://images.unsplash.com/photo-1619405399517-d7fce0f13302?q=80&w=1600&auto=format&fit=crop",
  },
];

export function Craftsmanship() {
  const reducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-58%"]);

  if (reducedMotion) {
    return (
      <section className="relative z-20 bg-raised py-20 md:py-28">
        <div className="atmo-glow pointer-events-none absolute inset-0" />
        <div className="relative mx-auto max-w-[1600px] px-4 md:px-8">
          <span className="mb-3 inline-block font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-cyan">
            05 / Process
          </span>
          <h2 className="font-display text-5xl font-bold uppercase leading-[0.9] tracking-tight text-foreground md:text-7xl">
            How We Build
            <br />
            <span className="text-silver">Your Upgrades.</span>
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <div key={step.number} className="relative overflow-hidden border border-border bg-surface p-8">
                <span className="font-display text-6xl font-bold text-cyan/15">{step.number}</span>
                <h3 className="mt-4 font-display text-3xl font-bold uppercase text-foreground">{step.title}</h3>
                <p className="mt-1 font-mono text-[10px] font-medium uppercase tracking-[0.15em] text-cyan">{step.subtitle}</p>
                <p className="mt-4 text-sm leading-relaxed text-silver-muted">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={containerRef} className="relative z-20 h-[200vh] bg-raised">
      <div className="atmo-glow pointer-events-none absolute inset-0" />
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div className="mx-auto grid w-full max-w-[1600px] items-center gap-10 px-4 md:px-8 lg:grid-cols-[380px_1fr]">
          {/* Sticky left title */}
          <div className="hidden lg:block">
            <span className="mb-3 inline-block font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-cyan">
              05 / Process
            </span>
            <h2 className="font-display text-6xl font-bold uppercase leading-[0.9] tracking-tight text-foreground xl:text-7xl">
              <TextReveal by="word" stagger={0.03}>How We Build</TextReveal>
              <br />
              <span className="text-silver">
                <TextReveal by="word" stagger={0.03}>Your Upgrades.</TextReveal>
              </span>
            </h2>
            <p className="mt-6 max-w-xs text-base leading-relaxed text-silver-muted">
              From 3D scan to finished product — every step engineered for perfection.
            </p>

            {/* Progress indicator */}
            <motion.div
              style={{ scaleX: scrollYProgress }}
              className="mt-10 h-px w-48 origin-left bg-cyan"
            />
          </div>

          {/* Horizontal cards */}
          <motion.div style={{ x, willChange: "transform" }} className="flex gap-5">
            {steps.map((step) => (
              <div
                key={step.number}
                className="relative w-[80vw] shrink-0 overflow-hidden border border-border bg-surface sm:w-[55vw] lg:w-[28vw]"
              >
                {/* Background image */}
                <div className="absolute inset-0">
                  <Image src={step.image} alt={step.title} fill sizes="28vw" className="object-cover opacity-20 saturate-[0.7]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/90 to-surface/50" />
                </div>

                <div className="relative z-10 flex h-[55vh] flex-col justify-between p-8 md:p-10">
                  <div>
                    <span className="font-display text-7xl font-bold text-cyan/15">{step.number}</span>
                    <h3 className="mt-2 font-display text-4xl font-bold uppercase tracking-tight text-foreground">
                      {step.title}
                    </h3>
                    <p className="mt-2 font-mono text-[10px] font-medium uppercase tracking-[0.15em] text-cyan">
                      {step.subtitle}
                    </p>
                  </div>
                  <p className="max-w-sm text-base leading-relaxed text-silver-muted">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
