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
      className="relative z-30 -mt-[18vh] border-t border-border bg-raised py-16 md:py-24"
    >
      <div className="atmo-glow pointer-events-none absolute inset-0" />
      <div className="relative mx-auto max-w-[1600px] px-4 md:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid gap-12 lg:grid-cols-2"
        >
          {/* Copy */}
          <div className="max-w-xl">
            <motion.span
              variants={fadeInUp}
              className="mb-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-cyan"
            >
              <CarFront className="h-4 w-4" />
              Vehicle Fitment
            </motion.span>
            <motion.h2
              variants={fadeInUp}
              className="font-display text-5xl font-bold uppercase leading-[0.9] tracking-tight text-foreground md:text-7xl"
            >
              Your Car.
              <br />
              <span className="text-silver">Your Tune.</span>
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="mt-6 text-lg leading-relaxed text-silver-muted"
            >
              Choose your vehicle and discover upgrades made for it. We&apos;ll filter
              products, builds and recommendations around your exact model.
            </motion.p>

            {selected && (
              <motion.div
                variants={fadeInUp}
                className="mt-8 rounded-lg border border-border bg-surface p-6"
              >
                <p className="text-xs uppercase tracking-widest text-silver-muted">
                  Selected vehicle
                </p>
                <p className="mt-1 font-display text-2xl uppercase text-foreground">
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
            className="space-y-8 rounded-xl border border-border bg-raised p-6 md:p-10"
          >
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

            <motion.div variants={fadeInUp} className="pt-4">
              <Button
                asChild
                disabled={!isComplete}
                className="w-full bg-cyan text-black hover:bg-cyan-light disabled:opacity-40"
              >
                <Link href="/shop" className="gap-2">
                  Find My Upgrades
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
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
    <motion.div variants={fadeInUp} className={cn("space-y-3", disabled && "opacity-50")}>
      <div className="flex items-center gap-3">
        <span className="text-xs font-bold text-cyan">{label}</span>
        <span className="text-xs font-semibold uppercase tracking-widest text-foreground">
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
      className={cn(
        "relative flex items-center justify-center gap-2 rounded-md border px-4 py-3 text-sm font-medium uppercase tracking-wider transition-all duration-200",
        active
          ? "border-cyan bg-cyan/10 text-cyan"
          : "border-border bg-surface text-silver hover:border-silver hover:text-foreground",
        disabled && "cursor-not-allowed opacity-40 hover:border-border hover:text-silver"
      )}
    >
      {active && <Check className="h-3.5 w-3.5" />}
      {children}
    </button>
  );
}
