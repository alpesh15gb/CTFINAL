"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Check, CarFront } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  vehicleBrands,
  getModelsForBrand,
  getYearsForBrandAndModel,
  getVariantsForBrandModelYear,
  findVehicle,
} from "@/data/vehicles";
import { useVehicle } from "@/hooks/useVehicle";
import { staggerContainer, fadeInUp } from "@/lib/animations";

export function VehicleSelector() {
  const { selected, setVehicle } = useVehicle();
  const [brand, setBrand] = useState<string>(selected?.brand ?? "");
  const [model, setModel] = useState<string>(selected?.model ?? "");
  const [year, setYear] = useState<number | null>(selected?.year ?? null);
  const [variant, setVariant] = useState<string>(selected?.variant ?? "");

  const models = useMemo(() => (brand ? getModelsForBrand(brand) : []), [brand]);
  const years = useMemo(
    () => (brand && model ? getYearsForBrandAndModel(brand, model) : []),
    [brand, model]
  );
  const variants = useMemo(
    () => (brand && model && year ? getVariantsForBrandModelYear(brand, model, year) : []),
    [brand, model, year]
  );

  const isComplete = brand && model && year && variant;

  const handleBrand = (b: string) => {
    setBrand(b);
    setModel("");
    setYear(null);
    setVariant("");
  };
  const handleModel = (m: string) => {
    setModel(m);
    setYear(null);
    setVariant("");
  };
  const handleYear = (y: number) => {
    setYear(y);
    setVariant("");
  };
  const handleVariant = (v: string) => {
    setVariant(v);
    const found = findVehicle(brand, model, year!, v);
    if (found) setVehicle(found);
  };

  return (
    <section
      id="vehicle-selector"
      className="relative z-30 overflow-hidden border-b border-border bg-background py-24 md:py-32 lg:py-40"
    >
      <div className="precision-grid pointer-events-none absolute inset-0 opacity-50" />
      <div className="pointer-events-none absolute left-0 top-1/3 h-96 w-96 -translate-x-1/2 rounded-full bg-cyan/[0.055] blur-[100px]" />
      <div className="site-container relative">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid items-start gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20"
        >
          {/* Copy */}
          <div className="max-w-xl">
            <motion.span variants={fadeInUp} className="technical-label mb-5">
              <CarFront className="h-4 w-4" />
              01 / Vehicle fitment
            </motion.span>
            <motion.h2
              variants={fadeInUp}
              className="font-display text-6xl font-bold uppercase leading-[0.82] tracking-[-0.035em] text-foreground md:text-8xl"
            >
              One car.
              <br />
              <span className="display-outline">Zero guesswork.</span>
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="mt-7 max-w-lg text-base leading-relaxed text-silver-muted md:text-lg"
            >
              Choose your vehicle and discover upgrades made for it. We&apos;ll filter
              products, builds and recommendations around your exact model.
            </motion.p>

            {selected && (
              <motion.div
                variants={fadeInUp}
                className="premium-card edge-highlight mt-9 rounded-sm p-6"
              >
                <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-silver-muted">
                  Selected vehicle
                </p>
                <p className="mt-2 font-display text-3xl font-semibold uppercase text-foreground">
                  {selected.year} {selected.brand} {selected.model} {selected.variant}
                </p>
                <Button asChild className="mt-4 bg-cyan text-black hover:bg-cyan-light">
                  <Link href="/shop" className="gap-2">
                    Find Upgrades <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </motion.div>
            )}
          </div>

          {/* Selector */}
          <motion.div
            variants={staggerContainer}
            className="glass-panel relative space-y-8 overflow-hidden rounded-sm p-6 md:p-10 lg:p-12"
          >
            <div className="precision-grid pointer-events-none absolute inset-0 opacity-35" />
            {/* Brand */}
            <Step label="01" title="Brand">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {vehicleBrands.map((b) => (
                  <OptionButton
                    key={b}
                    active={brand === b}
                    onClick={() => handleBrand(b)}
                  >
                    {b}
                  </OptionButton>
                ))}
              </div>
            </Step>

            {/* Model */}
            <Step label="02" title="Model" disabled={!brand}>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {models.map((m) => (
                  <OptionButton
                    key={m}
                    active={model === m}
                    onClick={() => handleModel(m)}
                    disabled={!brand}
                  >
                    {m}
                  </OptionButton>
                ))}
              </div>
            </Step>

            {/* Year */}
            <Step label="03" title="Year" disabled={!model}>
              <div className="flex flex-wrap gap-3">
                {years.map((y) => (
                  <OptionButton
                    key={y}
                    active={year === y}
                    onClick={() => handleYear(y)}
                    disabled={!model}
                  >
                    {y}
                  </OptionButton>
                ))}
              </div>
            </Step>

            {/* Variant */}
            <Step label="04" title="Variant" disabled={!year}>
              <div className="flex flex-wrap gap-3">
                {variants.map((v) => (
                  <OptionButton
                    key={v}
                    active={variant === v}
                    onClick={() => handleVariant(v)}
                    disabled={!year}
                  >
                    {v}
                  </OptionButton>
                ))}
              </div>
            </Step>

            <motion.div variants={fadeInUp} className="relative pt-4">
              {isComplete ? (
                <Button asChild size="lg" className="w-full">
                  <Link href="/shop">
                    Find my upgrades <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              ) : (
                <Button size="lg" disabled className="w-full">
                  Complete vehicle selection
                </Button>
              )}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function Step({
  label,
  title,
  children,
  disabled,
}: {
  label: string;
  title: string;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <motion.div variants={fadeInUp} className={cn("relative space-y-3", disabled && "opacity-45")}>
      <div className="flex items-center gap-3">
        <span className="font-mono text-[9px] font-bold tracking-widest text-cyan">{label}</span>
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-foreground">
          {title}
        </span>
      </div>
      {children}
    </motion.div>
  );
}

function OptionButton({
  active,
  onClick,
  disabled,
  children,
}: {
  active: boolean;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "relative flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-sm border px-4 py-3 font-mono text-[10px] font-bold uppercase tracking-[0.12em] transition-all duration-300",
        active
          ? "border-cyan bg-cyan/[0.11] text-cyan shadow-[inset_0_0_24px_rgba(49,207,255,0.05)]"
          : "border-border bg-black/20 text-silver hover:border-silver/60 hover:bg-white/[0.035] hover:text-foreground",
        disabled && "cursor-not-allowed opacity-40 hover:border-border hover:text-silver"
      )}
    >
      {active && <Check className="h-3.5 w-3.5" />}
      {children}
    </button>
  );
}
