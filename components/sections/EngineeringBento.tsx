"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Zap,
  Volume2,
  Sliders,
  Scale,
  Sparkles,
  Layers,
  ArrowUpRight,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function EngineeringBento() {
  // Module 1: Weight Reduction Slider state (0 to 100)
  const [sliderVal, setSliderVal] = useState(65);

  // Module 2: Custom Finish Studio
  const [activeFinish, setActiveFinish] = useState("titanium");

  // Module 3: Exhaust Sound Visualizer
  const [isPlayingSound, setIsPlayingSound] = useState(false);
  const [exhaustMode, setExhaustMode] = useState<"sport" | "race" | "stealth">("race");

  // Module 4: Fitment Verification search input
  const [carQuery, setCarQuery] = useState("");
  const [fitmentChecked, setFitmentChecked] = useState(false);

  const finishes = [
    { id: "obsidian", name: "Satin Obsidian", class: "bg-[#0c0e11] border-white/20", desc: "Nano-ceramic matte clearcoat over dark graphite" },
    { id: "titanium", name: "Brushed Titan", class: "bg-[#94A3B8] border-white/40", desc: "Directional hand-brushed aerospace aluminum" },
    { id: "bronze", name: "Matte Bronze", class: "bg-[#785434] border-white/20", desc: "High-temperature motorsport anodized finish" },
    { id: "silver", name: "Liquid Hyper-Silver", class: "bg-[#E2E8F0] border-white/40", desc: "Multi-stage mirror polished liquid metallic" },
  ];

  const handleCheckFitment = (e: React.FormEvent) => {
    e.preventDefault();
    if (carQuery.trim().length > 0) {
      setFitmentChecked(true);
    }
  };

  return (
    <section className="relative overflow-hidden bg-background py-24 md:py-32">
      {/* Precision Ambient Background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(49,207,255,0.05),transparent_40rem),radial-gradient(circle_at_20%_80%,rgba(255,59,48,0.04),transparent_45rem)]" />

      <div className="site-container relative z-10">
        {/* Section Header */}
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-2 text-cyan">
              <Layers className="h-4 w-4" />
              <span className="font-mono text-xs uppercase tracking-[0.28em] text-silver-muted">
                Aerospace Metallurgy &amp; Telemetry
              </span>
            </div>
            <h2 className="mt-2 font-display text-[clamp(2.5rem,6vw,5.5rem)] font-bold uppercase leading-none tracking-[-0.03em] text-foreground">
              Engineering <span className="text-silver-muted">Bento Box</span>
            </h2>
          </div>
          <p className="max-w-md font-sans text-sm leading-relaxed text-silver-muted md:text-base">
            Every component is subjected to structural finite element analysis (FEA), rotational inertia testing, and acoustic tuning.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-12">
          {/* Module 1: Weight & Rotational Mass (7 Cols) */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            className="group relative flex flex-col justify-between overflow-hidden rounded-sm border border-white/10 bg-surface p-6 backdrop-blur-md transition-colors hover:border-cyan/40 md:col-span-7 md:p-8"
          >
            <div>
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="border-cyan/30 bg-cyan/10 font-mono text-[10px] text-cyan">
                  01 / METALLURGY
                </Badge>
                <Scale className="h-5 w-5 text-silver-muted transition-colors group-hover:text-cyan" />
              </div>
              <h3 className="mt-4 font-display text-2xl font-bold uppercase tracking-tight text-foreground md:text-3xl">
                Rotational Inertia &amp; Mass Reduction
              </h3>
              <p className="mt-2 text-sm text-silver-muted">
                Forged 6061-T6 aluminum eliminates unsprung mass, delivering sharper steering turn-in and reduced braking distance.
              </p>
            </div>

            {/* Interactive Weight Comparison Slider */}
            <div className="my-8 space-y-4">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="text-silver-muted">Standard Cast Alloy (12.7 kg)</span>
                <span className="font-bold text-cyan">Cartunez Forged (8.9 kg)</span>
              </div>

              <div className="relative">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sliderVal}
                  onChange={(e) => setSliderVal(Number(e.target.value))}
                  className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-raised accent-cyan"
                />
              </div>

              <div className="grid grid-cols-3 gap-3 pt-2 font-mono text-center">
                <div className="rounded-sm border border-white/5 bg-raised p-2.5">
                  <span className="text-[9px] uppercase tracking-wider text-silver-muted">Weight Delta</span>
                  <p className="mt-0.5 text-sm font-bold text-hyperRed">-3.8 KG / Corner</p>
                </div>
                <div className="rounded-sm border border-white/5 bg-raised p-2.5">
                  <span className="text-[9px] uppercase tracking-wider text-silver-muted">Inertia Delta</span>
                  <p className="mt-0.5 text-sm font-bold text-cyan">-28.4%</p>
                </div>
                <div className="rounded-sm border border-white/5 bg-raised p-2.5">
                  <span className="text-[9px] uppercase tracking-wider text-silver-muted">Tensile Yield</span>
                  <p className="mt-0.5 text-sm font-bold text-amber">48,000 PSI</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="font-mono text-xs uppercase tracking-wider text-silver-muted">FEA Certified Rigidity</span>
              <span className="font-mono text-xs font-semibold text-cyan">JWL/VIA Standard</span>
            </div>
          </motion.div>

          {/* Module 2: Custom Finishing Studio (5 Cols) */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: 0.1 }}
            className="group relative flex flex-col justify-between overflow-hidden rounded-sm border border-white/10 bg-surface p-6 backdrop-blur-md transition-colors hover:border-amber/40 md:col-span-5 md:p-8"
          >
            <div>
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="border-amber/30 bg-amber/10 font-mono text-[10px] text-amber">
                  02 / SURFACE STUDIO
                </Badge>
                <Sparkles className="h-5 w-5 text-silver-muted transition-colors group-hover:text-amber" />
              </div>
              <h3 className="mt-4 font-display text-2xl font-bold uppercase tracking-tight text-foreground md:text-3xl">
                Bespoke Metallurgy Finishes
              </h3>
              <p className="mt-2 text-sm text-silver-muted">
                Multi-stage powder coating, liquid hand-polishing, and ceramic anti-corrosion barrier.
              </p>
            </div>

            {/* Finish Grid */}
            <div className="my-6 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                {finishes.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setActiveFinish(f.id)}
                    className={`flex items-center gap-2.5 rounded-sm border p-2.5 text-left font-mono text-xs transition-all ${
                      activeFinish === f.id
                        ? "border-amber bg-raised text-foreground shadow-[0_0_12px_rgba(255,159,10,0.15)]"
                        : "border-white/10 bg-surface text-silver-muted hover:border-white/20"
                    }`}
                  >
                    <span className={`h-4 w-4 rounded-full border ${f.class}`} />
                    <span className="truncate">{f.name}</span>
                  </button>
                ))}
              </div>

              <div className="rounded-sm border border-white/5 bg-raised p-3">
                <span className="font-mono text-[9px] uppercase tracking-wider text-amber">Active Selection Spec</span>
                <p className="mt-1 text-xs text-silver-muted">
                  {finishes.find((f) => f.id === activeFinish)?.desc}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="font-mono text-xs uppercase tracking-wider text-silver-muted">Coating Thickness</span>
              <span className="font-mono text-xs font-semibold text-foreground">65 Micron Hardcoat</span>
            </div>
          </motion.div>

          {/* Module 3: Acoustic & Performance Waveform (5 Cols) */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: 0.15 }}
            className="group relative flex flex-col justify-between overflow-hidden rounded-sm border border-white/10 bg-surface p-6 backdrop-blur-md transition-colors hover:border-hyperRed/40 md:col-span-5 md:p-8"
          >
            <div>
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="border-hyperRed/30 bg-hyperRed/10 font-mono text-[10px] text-hyperRed">
                  03 / ACOUSTIC TUNING
                </Badge>
                <Volume2 className="h-5 w-5 text-silver-muted transition-colors group-hover:text-hyperRed" />
              </div>
              <h3 className="mt-4 font-display text-2xl font-bold uppercase tracking-tight text-foreground md:text-3xl">
                Valved Acoustic Harmonization
              </h3>
              <p className="mt-2 text-sm text-silver-muted">
                T304 stainless titanium valved exhaust maps optimized for deep bass tones and anti-drone highway cruising.
              </p>
            </div>

            {/* Simulated Audio Waveform */}
            <div className="my-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex gap-1.5 font-mono text-xs">
                  {(["stealth", "sport", "race"] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setExhaustMode(mode)}
                      className={`rounded-sm border px-2.5 py-1 uppercase transition-all ${
                        exhaustMode === mode
                          ? "border-hyperRed bg-hyperRed/20 text-foreground font-bold"
                          : "border-white/10 text-silver-muted hover:border-white/20"
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setIsPlayingSound(!isPlayingSound)}
                  className="flex items-center gap-1.5 font-mono text-xs text-hyperRed"
                >
                  <Activity className={`h-4 w-4 ${isPlayingSound ? "animate-pulse" : ""}`} />
                  <span>{isPlayingSound ? "Active" : "Preview"}</span>
                </button>
              </div>

              {/* Animated Waveform Bars */}
              <div className="flex h-16 items-end gap-1 rounded-sm border border-white/5 bg-raised p-3">
                {Array.from({ length: 28 }).map((_, i) => {
                  const height = isPlayingSound
                    ? Math.sin(i * 0.4 + (exhaustMode === "race" ? 2 : 1)) * 30 + 35
                    : 12 + ((i % 5) * 4);
                  return (
                    <motion.div
                      key={i}
                      animate={{ height: `${height}%` }}
                      transition={{ duration: 0.25, repeat: isPlayingSound ? Infinity : 0, repeatType: "reverse" }}
                      className={`flex-1 rounded-t-sm transition-colors ${
                        exhaustMode === "race"
                          ? "bg-hyperRed"
                          : exhaustMode === "sport"
                          ? "bg-amber"
                          : "bg-silver-muted"
                      }`}
                    />
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="font-mono text-xs uppercase tracking-wider text-silver-muted">Decibel Rating</span>
              <span className="font-mono text-xs font-semibold text-hyperRed">
                {exhaustMode === "race" ? "108 dB (Open Valve)" : exhaustMode === "sport" ? "94 dB" : "78 dB (Anti-Drone)"}
              </span>
            </div>
          </motion.div>

          {/* Module 4: Fitment Guarantee HUD (7 Cols) */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: 0.2 }}
            className="group relative flex flex-col justify-between overflow-hidden rounded-sm border border-white/10 bg-surface p-6 backdrop-blur-md transition-colors hover:border-cyan/40 md:col-span-7 md:p-8"
          >
            <div>
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="border-cyan/30 bg-cyan/10 font-mono text-[10px] text-cyan">
                  04 / 100% FITMENT PROMISE
                </Badge>
                <ShieldCheck className="h-5 w-5 text-silver-muted transition-colors group-hover:text-cyan" />
              </div>
              <h3 className="mt-4 font-display text-2xl font-bold uppercase tracking-tight text-foreground md:text-3xl">
                Instant Garage Fitment Verification
              </h3>
              <p className="mt-2 text-sm text-silver-muted">
                Laser-scanned wheel well tolerances, brake caliper clearance verification, and fender scrub prevention.
              </p>
            </div>

            {/* Search and Verified Results */}
            <div className="my-6 space-y-3">
              <form onSubmit={handleCheckFitment} className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. BMW M3 G80, Porsche 911 992, Creta N-Line..."
                  value={carQuery}
                  onChange={(e) => setCarQuery(e.target.value)}
                  className="flex-1 rounded-sm border border-white/10 bg-raised px-4 py-2.5 font-mono text-xs text-foreground placeholder:text-silver-muted/50 focus:border-cyan focus:outline-none"
                />
                <Button type="submit" size="sm" className="gap-1.5 font-mono">
                  <span>Verify</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Button>
              </form>

              {fitmentChecked && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-sm border border-green-500/30 bg-green-950/20 p-3 font-mono text-xs text-green-400"
                >
                  <div className="flex items-center gap-2 font-bold">
                    <ShieldCheck className="h-4 w-4 text-green-400" />
                    <span>VERIFIED FITMENT MATCH: {carQuery.toUpperCase()}</span>
                  </div>
                  <p className="mt-1 text-[11px] text-silver-muted">
                    Clearance verified for standard &amp; carbon-ceramic brakes. Hub-centric rings (66.5mm / 72.6mm) pre-packaged.
                  </p>
                </motion.div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="font-mono text-xs uppercase tracking-wider text-silver-muted">Brake Clearance Guarantee</span>
              <span className="font-mono text-xs font-semibold text-green-400">Zero Rub / Direct Bolt-on</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
