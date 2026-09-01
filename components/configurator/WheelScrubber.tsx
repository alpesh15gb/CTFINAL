"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Gauge, ShieldCheck, Zap, Sliders, ChevronRight, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTilt3D } from "@/hooks/useTilt3D";
import { useCart } from "@/hooks/useCart";

interface FitmentProfile {
  id: string;
  name: string;
  category: string;
  tagline: string;
  image: string;
  price: number;
  diameter: string;
  width: string;
  offset: string;
  pcd: string;
  weight: string;
  loadRating: string;
  construction: string;
  finishes: { id: string; name: string; color: string; hex: string }[];
}

const PROFILES: FitmentProfile[] = [
  {
    id: "ct-track-v01",
    name: "CT-01 Forged Track Monoblock",
    category: "Motorsport Spec",
    tagline: "Ultra-low rotational inertia engineered for apex carving & track abuse.",
    image: "https://images.unsplash.com/photo-1611633859589-7990d2fbb56b?q=80&w=1200&auto=format&fit=crop",
    price: 68500,
    diameter: "19-inch",
    width: "9.5J Front / 10.5J Rear",
    offset: "ET25 / ET28",
    pcd: "5x112 / 5x120",
    weight: "8.4 kg",
    loadRating: "850 kg",
    construction: "Aerospace 6061-T6 Forged Billet",
    finishes: [
      { id: "satin-black", name: "Satin Obsidian", color: "bg-[#121417]", hex: "#121417" },
      { id: "brushed-titan", name: "Brushed Titan", color: "bg-[#94A3B8]", hex: "#94A3B8" },
      { id: "matte-bronze", name: "Matte Bronze", color: "bg-[#785434]", hex: "#785434" },
    ],
  },
  {
    id: "ct-concave-v02",
    name: "CT-02 Deep Concave Modular",
    category: "Stance / Street",
    tagline: "Aggressive drop-center profile with exposed titanium assembly hardware.",
    image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=1200&auto=format&fit=crop",
    price: 84000,
    diameter: "20-inch",
    width: "10.0J Front / 11.5J Rear",
    offset: "ET18 / ET15",
    pcd: "5x112 / 5x114.3",
    weight: "9.6 kg",
    loadRating: "920 kg",
    construction: "2-Piece Modular Forged",
    finishes: [
      { id: "brushed-titan", name: "Brushed Titan", color: "bg-[#94A3B8]", hex: "#94A3B8" },
      { id: "satin-black", name: "Satin Obsidian", color: "bg-[#121417]", hex: "#121417" },
      { id: "gloss-gold", name: "Champagne Gold", color: "bg-[#C4A052]", hex: "#C4A052" },
    ],
  },
  {
    id: "ct-aero-v03",
    name: "CT-03 Carbon Aero-Disc",
    category: "Aero Hybrid",
    tagline: "Integrated carbon-fiber cooling blades maximizing high-speed brake ventilation.",
    image: "https://images.unsplash.com/photo-1542282088-fe8426682b8f?q=80&w=1200&auto=format&fit=crop",
    price: 96000,
    diameter: "20-inch",
    width: "9.5J Front / 10.5J Rear",
    offset: "ET32 / ET30",
    pcd: "5x112 / 5x130",
    weight: "8.8 kg",
    loadRating: "890 kg",
    construction: "Forged Alloy + Dry Carbon Fibre",
    finishes: [
      { id: "raw-carbon", name: "Gloss Dry Carbon", color: "bg-[#0A0C0E]", hex: "#0A0C0E" },
      { id: "satin-black", name: "Satin Obsidian", color: "bg-[#121417]", hex: "#121417" },
    ],
  },
  {
    id: "ct-executive-v04",
    name: "CT-04 Directional Billet GT",
    category: "Luxury Grand Tourer",
    tagline: "Hand-finished directional spokes designed for flagship performance saloons.",
    image: "https://images.unsplash.com/photo-1601673632676-12f89e430aa3?q=80&w=1200&auto=format&fit=crop",
    price: 92000,
    diameter: "21-inch",
    width: "9.5J Front / 11.0J Rear",
    offset: "ET35 / ET38",
    pcd: "5x112 / 5x120",
    weight: "10.2 kg",
    loadRating: "980 kg",
    construction: "Monoblock Forged Aluminum",
    finishes: [
      { id: "hyper-silver", name: "Liquid Hyper-Silver", color: "bg-[#E2E8F0]", hex: "#E2E8F0" },
      { id: "satin-black", name: "Satin Obsidian", color: "bg-[#121417]", hex: "#121417" },
      { id: "matte-bronze", name: "Matte Bronze", color: "bg-[#785434]", hex: "#785434" },
    ],
  },
];

export function WheelScrubber() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [selectedFinish, setSelectedFinish] = useState(PROFILES[0].finishes[0].id);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  const activeProfile = PROFILES[activeIdx];
  const tilt = useTilt3D({ maxTilt: 10, scale: 1.02 });

  const handleSelectProfile = (idx: number) => {
    setActiveIdx(idx);
    setSelectedFinish(PROFILES[idx].finishes[0].id);
    setAdded(false);
  };

  const handleAddToSpec = () => {
    addItem({
      id: activeProfile.id,
      slug: activeProfile.id,
      name: activeProfile.name,
      category: "Alloy Wheels",
      categorySlug: "alloy-wheels",
      price: activeProfile.price,
      currency: "₹",
      rating: 4.9,
      reviewCount: 38,
      compatibility: ["all"],
      images: [activeProfile.image],
      description: activeProfile.tagline,
      features: [
        `Diameter: ${activeProfile.diameter}`,
        `Offset: ${activeProfile.offset}`,
        `PCD: ${activeProfile.pcd}`,
        `Weight: ${activeProfile.weight}`,
        `Finish: ${activeProfile.finishes.find((f) => f.id === selectedFinish)?.name || "Standard"}`,
      ],
      inStock: true,
      badge: "Forged Spec",
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <section className="relative overflow-hidden bg-background py-24 md:py-32">
      {/* Precision Ambient Mesh */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_25%,rgba(49,207,255,0.06),transparent_40rem),radial-gradient(circle_at_80%_75%,rgba(255,159,10,0.04),transparent_45rem)]" />

      <div className="site-container relative z-10">
        {/* Section Header */}
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-2 text-cyan">
              <Sliders className="h-4 w-4" />
              <span className="font-mono text-xs uppercase tracking-[0.28em] text-silver-muted">
                Interactive Spec Deck
              </span>
            </div>
            <h2 className="mt-2 font-display text-[clamp(2.5rem,6vw,5.5rem)] font-bold uppercase leading-none tracking-[-0.03em] text-foreground">
              Alloy Scrubber <span className="text-silver-muted">&amp; Fitment</span>
            </h2>
          </div>
          <p className="max-w-md font-sans text-sm leading-relaxed text-silver-muted md:text-base">
            Real-time telemetry analysis for bespoke wheel profiles. Scrub through track-engineered geometries and load ratings.
          </p>
        </div>

        {/* Profile Selector Pills */}
        <div className="mt-10 flex gap-2 overflow-x-auto pb-3 scrollbar-none md:gap-3">
          {PROFILES.map((p, idx) => (
            <button
              key={p.id}
              onClick={() => handleSelectProfile(idx)}
              className={`group relative flex shrink-0 items-center gap-2.5 rounded-sm border px-4 py-2.5 font-mono text-xs uppercase tracking-wider transition-all duration-300 ${
                activeIdx === idx
                  ? "border-cyan/50 bg-surface text-foreground shadow-[0_0_20px_rgba(49,207,255,0.15)]"
                  : "border-white/10 bg-raised text-silver-muted hover:border-white/20 hover:text-foreground"
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full transition-colors ${activeIdx === idx ? "bg-cyan" : "bg-white/20"}`} />
              <span>{p.name.split(" ")[0]}</span>
              <span className="hidden text-[10px] text-silver-muted sm:inline">({p.diameter})</span>
            </button>
          ))}
        </div>

        {/* Interactive 3D Showcase & Telemetry Grid */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
          {/* 3D Visual Card (7 Cols) */}
          <div className="lg:col-span-7">
            <div
              ref={tilt.ref}
              onMouseMove={tilt.handleMouseMove}
              onMouseLeave={tilt.handleMouseLeave}
              className="group relative aspect-[4/3] w-full overflow-hidden rounded-sm border border-white/10 bg-surface transition-all duration-500 hover:border-cyan/40"
              style={{
                perspective: 1000,
                transformStyle: "preserve-3d",
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeProfile.id}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.04 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="relative h-full w-full"
                >
                  <Image
                    src={activeProfile.image}
                    alt={activeProfile.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Subtle Lighting Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/30" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_30%,rgba(3,4,5,0.70)_95%)]" />

                  {/* Badges on Card */}
                  <div className="absolute left-5 top-5 flex items-center gap-2">
                    <Badge variant="outline" className="border-cyan/40 bg-background/80 font-mono text-[10px] text-cyan backdrop-blur-md">
                      {activeProfile.category}
                    </Badge>
                    <Badge variant="outline" className="border-white/20 bg-background/80 font-mono text-[10px] text-silver-muted backdrop-blur-md">
                      {activeProfile.construction}
                    </Badge>
                  </div>

                  <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-widest text-silver-muted">MSRP Per Corner</p>
                      <p className="font-display text-2xl font-bold uppercase text-foreground">
                        ₹{activeProfile.price.toLocaleString("en-IN")}
                      </p>
                    </div>
                    <span className="font-mono text-xs uppercase tracking-wider text-cyan">
                      360° Fitment Calibrated
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Telemetry Dashboard (5 Cols) */}
          <div className="flex flex-col gap-6 lg:col-span-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeProfile.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.35 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="font-display text-3xl font-bold uppercase tracking-tight text-foreground md:text-4xl">
                    {activeProfile.name}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-silver-muted">
                    {activeProfile.tagline}
                  </p>
                </div>

                {/* Telemetry Matrix */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  <div className="rounded-sm border border-white/10 bg-raised p-3">
                    <span className="font-mono text-[9px] uppercase tracking-wider text-silver-muted">Rotational Mass</span>
                    <p className="mt-1 font-mono text-sm font-bold text-hyperRed">{activeProfile.weight}</p>
                  </div>

                  <div className="rounded-sm border border-white/10 bg-raised p-3">
                    <span className="font-mono text-[9px] uppercase tracking-wider text-silver-muted">Offset Range</span>
                    <p className="mt-1 font-mono text-sm font-bold text-foreground">{activeProfile.offset}</p>
                  </div>

                  <div className="rounded-sm border border-white/10 bg-raised p-3">
                    <span className="font-mono text-[9px] uppercase tracking-wider text-silver-muted">PCD Bolt Pattern</span>
                    <p className="mt-1 font-mono text-sm font-bold text-amber">{activeProfile.pcd}</p>
                  </div>

                  <div className="rounded-sm border border-white/10 bg-raised p-3">
                    <span className="font-mono text-[9px] uppercase tracking-wider text-silver-muted">Width Geometry</span>
                    <p className="mt-1 font-mono text-sm font-bold text-foreground">{activeProfile.width}</p>
                  </div>

                  <div className="rounded-sm border border-white/10 bg-raised p-3">
                    <span className="font-mono text-[9px] uppercase tracking-wider text-silver-muted">Load Rating</span>
                    <p className="mt-1 font-mono text-sm font-bold text-cyan">{activeProfile.loadRating}</p>
                  </div>

                  <div className="rounded-sm border border-white/10 bg-raised p-3">
                    <span className="font-mono text-[9px] uppercase tracking-wider text-silver-muted">Verification</span>
                    <p className="mt-1 font-mono text-sm font-bold text-green-400">JWL / VIA Spec</p>
                  </div>
                </div>

                {/* Finish Switcher */}
                <div>
                  <label className="font-mono text-[10px] uppercase tracking-widest text-silver-muted">
                    Bespoke Finish Selection
                  </label>
                  <div className="mt-2.5 flex items-center gap-3">
                    {activeProfile.finishes.map((f) => (
                      <button
                        key={f.id}
                        onClick={() => setSelectedFinish(f.id)}
                        className={`group relative flex items-center gap-2 rounded-sm border px-3 py-1.5 font-mono text-xs transition-all ${
                          selectedFinish === f.id
                            ? "border-cyan bg-surface text-foreground shadow-[0_0_12px_rgba(49,207,255,0.2)]"
                            : "border-white/10 bg-raised text-silver-muted hover:border-white/20 hover:text-foreground"
                        }`}
                      >
                        <span className={`h-3 w-3 rounded-full border border-white/20 ${f.color}`} />
                        <span>{f.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Action CTAs */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Button
                    onClick={handleAddToSpec}
                    size="lg"
                    className="relative flex-1 gap-2"
                  >
                    {added ? (
                      <>
                        <Check className="h-4 w-4 text-black" />
                        <span>Added to Vehicle Spec</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        <span>Add to Vehicle Spec</span>
                      </>
                    )}
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href={`/products/${activeProfile.id}`}>
                      Full Engineering Sheet <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
