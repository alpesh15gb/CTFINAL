"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { staggerContainer, fadeInUp } from "@/lib/animations";

const accessoryGroups = [
  {
    id: "exterior",
    label: "Exterior",
    title: "Aero & Stance",
    image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=1600&auto=format&fit=crop",
    hotspots: [
      { x: 22, y: 42, label: "Carbon Mirror Caps", price: "₹4,999", slug: "carbon-fibre-mirror-caps" },
      { x: 52, y: 66, label: "Aero Body Kit", price: "₹45,999", slug: "aero-body-kit" },
      { x: 78, y: 38, label: "Rear Spoiler", price: "₹6,999", slug: "rear-spoiler-gloss-black" },
    ],
  },
  {
    id: "wheels",
    label: "Wheels",
    title: "Forged Performance",
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1600&auto=format&fit=crop",
    hotspots: [
      { x: 28, y: 55, label: "Forged Alloy V01", price: "₹28,999", slug: "forged-alloy-wheels-v01" },
      { x: 72, y: 58, label: "Forged Alloy V02", price: "₹34,999", slug: "forged-alloy-wheels-v01" },
    ],
  },
  {
    id: "lighting",
    label: "Lighting",
    title: "Light The Night",
    image: "https://images.unsplash.com/photo-1542282088-fe8426682b8f?q=80&w=1600&auto=format&fit=crop",
    hotspots: [
      { x: 35, y: 48, label: "LED Headlights", price: "₹12,999", slug: "led-headlight-upgrade" },
      { x: 68, y: 62, label: "Ambient Kit", price: "₹8,499", slug: "ambient-interior-lighting-kit" },
    ],
  },
  {
    id: "interior",
    label: "Interior",
    title: "Driver-Focused Cabin",
    image: "https://images.unsplash.com/photo-1549064233-945d7063292f?q=80&w=1600&auto=format&fit=crop",
    hotspots: [
      { x: 40, y: 55, label: "Steering Wheel", price: "₹15,999", slug: "performance-steering-wheel" },
      { x: 62, y: 72, label: "Floor Mats", price: "₹3,999", slug: "premium-all-weather-floor-mats" },
    ],
  },
  {
    id: "performance",
    label: "Performance",
    title: "Power & Sound",
    image: "https://images.unsplash.com/photo-1527383418406-f85a3b146499?q=80&w=1600&auto=format&fit=crop",
    hotspots: [
      { x: 50, y: 50, label: "Cold Air Intake", price: "₹18,999", slug: "cold-air-intake-system" },
    ],
  },
];

export function AccessoryStory() {
  const [active, setActive] = useState(accessoryGroups[0]);

  return (
    <section className="relative z-20 bg-background py-24 md:py-32">
      <div className="mx-auto max-w-[1600px] px-4 md:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="mb-10"
        >
          <motion.span
            variants={fadeInUp}
            className="mb-3 inline-block text-xs font-semibold uppercase tracking-[0.25em] text-cyan"
          >
            02 / Accessory Story
          </motion.span>
          <motion.h2
            variants={fadeInUp}
            className="font-display text-5xl font-bold uppercase leading-[0.9] tracking-tight text-foreground md:text-7xl"
          >
            Explore Every
            <br />
            <span className="text-silver">Upgrade Zone.</span>
          </motion.h2>
        </motion.div>

        {/* Tabs */}
        <div className="mb-8 flex flex-wrap gap-2">
          {accessoryGroups.map((group) => (
            <button
              key={group.id}
              type="button"
              onClick={() => setActive(group)}
              className={cn(
                "rounded-full border px-5 py-2 text-sm font-medium uppercase tracking-wider transition-all",
                active.id === group.id
                  ? "border-cyan bg-cyan text-black"
                  : "border-border bg-raised text-silver hover:border-silver hover:text-foreground"
              )}
            >
              {group.label}
            </button>
          ))}
        </div>

        {/* Stage */}
        <div className="relative overflow-hidden rounded-xl border border-border bg-black">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="relative aspect-[16/9] md:aspect-[21/9]"
            >
              <Image
                src={active.image}
                alt={active.title}
                fill
                className="object-cover"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/20 to-transparent" />

              <div className="absolute inset-y-0 left-0 flex flex-col justify-center p-6 md:w-1/3 md:p-12">
                <h3 className="font-display text-4xl font-bold uppercase text-foreground md:text-6xl">
                  {active.title}
                </h3>
                <p className="mt-3 text-silver-muted">
                  Tap a hotspot to shop the upgrade.
                </p>
              </div>

              {/* Hotspots */}
              {active.hotspots.map((spot, idx) => (
                <Hotspot key={idx} spot={spot} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function Hotspot({
  spot,
}: {
  spot: { x: number; y: number; label: string; price: string; slug: string };
}) {
  return (
    <Link
      href={`/products/${spot.slug}`}
      className="group absolute"
      style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
    >
      <span className="relative flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-cyan bg-cyan/20 text-cyan shadow-[0_0_20px_rgba(2,187,252,0.4)] transition-all group-hover:scale-110 group-hover:bg-cyan group-hover:text-black">
        <span className="h-1.5 w-1.5 rounded-full bg-current" />
      </span>
      <span className="pointer-events-none absolute left-6 top-0 w-40 -translate-y-1/2 rounded-md border border-border bg-raised/95 p-3 opacity-0 transition-opacity group-hover:opacity-100 md:pointer-events-auto">
        <span className="block text-xs font-semibold uppercase tracking-wider text-foreground">
          {spot.label}
        </span>
        <span className="mt-1 block text-sm font-medium text-cyan">
          {spot.price}
        </span>
        <span className="mt-2 inline-flex items-center gap-1 text-[10px] uppercase tracking-widest text-silver-muted">
          View <ArrowRight className="h-3 w-3" />
        </span>
      </span>
    </Link>
  );
}
