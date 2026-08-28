"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

type Chapter = {
  key: string;
  slug: string;
  number: string;
  category: string;
  statement: string;
  body: string;
  image: string;
  side: "left" | "right";
  pos: string;
};

const chapters: Chapter[] = [
  {
    key: "performance",
    slug: "performance",
    number: "01",
    category: "Performance",
    statement: "Power, Engineered.",
    body: "ECU tuning, intake, exhaust and performance upgrades selected for your vehicle and driving goals.",
    image: "https://images.unsplash.com/photo-1552656967-7a0991a13906?q=80&w=2400&auto=format&fit=crop",
    side: "left",
    pos: "center",
  },
  {
    key: "wheels",
    slug: "wheels",
    number: "02",
    category: "Wheels & Stance",
    statement: "Built From The Ground Up.",
    body: "Forged alloys, premium tyres and fitment engineered to give your car the right stance.",
    image: "https://images.unsplash.com/photo-1698533188477-5fd401563eaa?q=80&w=2400&auto=format&fit=crop",
    side: "right",
    pos: "right center",
  },
  {
    key: "interior",
    slug: "interior",
    number: "03",
    category: "Interior",
    statement: "Your Cabin. Your Spec.",
    body: "Premium materials, trim, steering and interior upgrades tailored around the driver.",
    image: "https://images.unsplash.com/photo-1629820408206-e9fc918abf63?q=80&w=2400&auto=format&fit=crop",
    side: "left",
    pos: "center",
  },
  {
    key: "exterior",
    slug: "exterior",
    number: "04",
    category: "Exterior",
    statement: "Presence By Design.",
    body: "Aero, body styling and exterior upgrades that sharpen the vehicle without compromising its character.",
    image: "https://images.unsplash.com/photo-1714434087915-27cfbdd3b048?q=80&w=2400&auto=format&fit=crop",
    side: "right",
    pos: "center",
  },
  {
    key: "lighting",
    slug: "lighting",
    number: "05",
    category: "Lighting",
    statement: "Seen. Remembered.",
    body: "Headlights, ambient lighting and illumination upgrades designed for presence day and night.",
    image: "https://images.unsplash.com/photo-1616761879141-f485e5fed5df?q=80&w=2400&auto=format&fit=crop",
    side: "left",
    pos: "left center",
  },
  {
    key: "audio",
    slug: "audio",
    number: "06",
    category: "Car Audio",
    statement: "Sound, Sculpted.",
    body: "Premium speakers, amplifiers and subwoofer systems engineered specifically for the vehicle cabin.",
    image: "https://images.unsplash.com/photo-1776176359206-a1d34436ddff?q=80&w=2400&auto=format&fit=crop",
    side: "right",
    pos: "center",
  },
  {
    key: "protection",
    slug: "protection",
    number: "07",
    category: "Paint & Protection",
    statement: "Preserved. Protected.",
    body: "PPF, ceramic coating and detailing solutions designed to preserve the vehicle's finish.",
    image: "https://images.unsplash.com/photo-1620584898989-d39f7f9ed1b7?q=80&w=2400&auto=format&fit=crop",
    side: "left",
    pos: "center",
  },
];

function ChapterBlock({ chapter, isLast }: { chapter: Chapter; isLast: boolean }) {
  const reducedMotion = useReducedMotion();

  return (
    <div className="relative min-h-[90vh] overflow-hidden">
      {/* Full-bleed image — always painted for entire chapter */}
      <motion.div
        initial={reducedMotion ? false : { scale: 1 }}
        whileInView={{ scale: 1.05 }}
        viewport={{ once: true }}
        transition={{ duration: 8, ease: "linear" }}
        className="absolute inset-0"
      >
        <Image
          src={chapter.image}
          alt={chapter.category}
          fill
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: chapter.pos }}
        />
      </motion.div>

      {/* Local readability gradient — only behind text, image stays lit */}
      <div
        className={cn(
          "absolute inset-y-0 w-full md:w-[58%]",
          chapter.side === "left"
            ? "left-0 bg-gradient-to-r from-[rgba(5,6,7,0.92)] via-[rgba(5,6,7,0.65)] to-transparent"
            : "right-0 bg-gradient-to-l from-[rgba(5,6,7,0.92)] via-[rgba(5,6,7,0.65)] to-transparent"
        )}
      />

      {/* Transition overlap zone at bottom — next chapter fades in here */}
      {!isLast && (
        <div className="absolute inset-x-0 bottom-0 z-20 h-[6vh] bg-gradient-to-b from-transparent to-background" />
      )}

      {/* Content */}
      <div className="relative z-10 flex h-full items-center px-4 py-20 md:px-8">
        <div className="mx-auto w-full max-w-[1600px]">
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              "max-w-[540px]",
              chapter.side === "right" && "ml-auto text-right"
            )}
          >
            {/* Category number */}
            <p className="mb-2 text-[14px] font-semibold uppercase tracking-[0.3em] text-cyan md:text-[15px]">
              {chapter.number}
            </p>

            {/* CATEGORY NAME — large, primary hierarchy */}
            <h3 className="font-display text-[clamp(3rem,5.5vw,4.5rem)] font-bold uppercase leading-[0.9] tracking-tight text-foreground">
              {chapter.category}
            </h3>

            {/* Creative statement — secondary */}
            <p className="mt-3 text-[clamp(1.4rem,2.5vw,2rem)] font-medium uppercase leading-tight tracking-wide text-silver">
              {chapter.statement}
            </p>

            {/* Body copy — readable contrast */}
            <p className="mt-5 max-w-[500px] text-[18px] leading-[1.55] text-white/80 md:text-[19px]">
              {chapter.body}
            </p>

            {/* Explore CTA */}
            <Link
              href={`/shop?category=${chapter.slug}`}
              className={cn(
                "mt-8 inline-flex items-center gap-2 text-[15px] font-semibold uppercase tracking-wider text-cyan transition-colors hover:text-cyan-light",
                chapter.side === "right" && "flex-row-reverse"
              )}
            >
              Explore {chapter.category}
              <ArrowRight className={cn("h-4 w-4", chapter.side === "right" && "rotate-180")} />
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export function UpgradeStory() {
  return (
    <section className="relative z-20 bg-background">
      {/* Section intro */}
      <div className="mx-auto max-w-[1600px] px-4 pt-20 pb-8 md:px-8 md:pt-28 md:pb-12">
        <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-[0.25em] text-cyan">
          03 / Transform It
        </span>
        <h2 className="font-display text-5xl font-bold uppercase leading-[0.9] tracking-tight text-foreground md:text-7xl">
          Every Upgrade.
          <br />
          <span className="text-silver">One Vision.</span>
        </h2>
      </div>

      {/* Chapters — no black spacers, transitions via gradient overlap */}
      <div>
        {chapters.map((chapter, i) => (
          <ChapterBlock
            key={chapter.key}
            chapter={chapter}
            isLast={i === chapters.length - 1}
          />
        ))}
      </div>
    </section>
  );
}
