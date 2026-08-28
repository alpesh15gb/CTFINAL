"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Plus, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { staggerContainer, fadeInUp, scaleIn } from "@/lib/animations";

interface ConfigOption {
  id: string;
  name: string;
  value: string;
  price: number;
  image: string;
}

const configGroups = [
  {
    key: "wheels",
    label: "Wheels",
    options: [
      { id: "w1", name: "Performance Alloy — V01", value: "Satin Black", price: 28999, image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=600&auto=format&fit=crop" },
      { id: "w2", name: "Forged Alloy — V02", value: "Gunmetal", price: 34999, image: "https://images.unsplash.com/photo-1542377281-73d08e3a10aa?q=80&w=600&auto=format&fit=crop" },
    ],
  },
  {
    key: "lighting",
    label: "Ambient Lighting",
    options: [
      { id: "l1", name: "Cyan Ambient Kit", value: "64 Colors", price: 8499, image: "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?q=80&w=600&auto=format&fit=crop" },
      { id: "l2", name: "LED Headlight Upgrade", value: "Projector", price: 12999, image: "https://images.unsplash.com/photo-1542282088-fe8426682b8f?q=80&w=600&auto=format&fit=crop" },
    ],
  },
  {
    key: "exterior",
    label: "Exterior Trim",
    options: [
      { id: "e1", name: "Carbon Mirror Caps", value: "Dry Carbon", price: 4999, image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=600&auto=format&fit=crop" },
      { id: "e2", name: "Gloss Black Spoiler", value: "OEM Profile", price: 6999, image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=600&auto=format&fit=crop" },
    ],
  },
];

export function Configurator() {
  const [selected, setSelected] = useState<Record<string, ConfigOption>>({});

  const toggleOption = (groupKey: string, option: ConfigOption) => {
    setSelected((prev) => {
      const next = { ...prev };
      if (next[groupKey]?.id === option.id) {
        delete next[groupKey];
      } else {
        next[groupKey] = option;
      }
      return next;
    });
  };

  const total = Object.values(selected).reduce((sum, opt) => sum + opt.price, 0);

  return (
    <section className="relative z-30 -mt-[32vh] border-t border-border bg-raised pt-16 pb-24 md:pt-20 md:pb-32">
      <div className="mx-auto max-w-[1600px] px-4 md:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="mb-12 md:mb-16"
        >
          <motion.span
            variants={fadeInUp}
            className="mb-3 inline-block text-xs font-semibold uppercase tracking-[0.25em] text-cyan"
          >
            06 / Configurator
          </motion.span>
          <motion.h2
            variants={fadeInUp}
            className="font-display text-5xl font-bold uppercase leading-[0.9] tracking-tight text-foreground md:text-7xl"
          >
            Make It
            <br />
            <span className="text-silver">Yours.</span>
          </motion.h2>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Visual */}
          <motion.div
            variants={scaleIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-black md:aspect-square"
          >
            <Image
              src="https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=1600&auto=format&fit=crop"
              alt="Configurator preview"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-raised/60 via-transparent to-raised/60" />

            {/* Active option badges */}
            <div className="absolute left-4 top-4 flex flex-wrap gap-2">
              <AnimatePresence>
                {Object.entries(selected).map(([key, opt]) => (
                  <motion.span
                    key={key}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="rounded-full border border-cyan/40 bg-cyan/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-cyan"
                  >
                    {opt.name}
                  </motion.span>
                ))}
              </AnimatePresence>
            </div>

            <div className="absolute bottom-4 left-4 right-4 rounded-lg border border-border bg-raised/90 p-4 backdrop-blur">
              <p className="text-xs uppercase tracking-widest text-silver-muted">Build Total</p>
              <p className="font-display text-3xl font-semibold text-foreground">
                ₹{total.toLocaleString("en-IN")}
              </p>
            </div>
          </motion.div>

          {/* Controls */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-8"
          >
            {configGroups.map((group) => (
              <motion.div key={group.key} variants={fadeInUp} className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-cyan">{group.label}</span>
                  <span className="h-px flex-1 bg-border" />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {group.options.map((option) => {
                    const active = selected[group.key]?.id === option.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => toggleOption(group.key, option)}
                        className={cn(
                          "relative flex items-center gap-3 rounded-lg border p-3 text-left transition-all",
                          active
                            ? "border-cyan bg-cyan/10 text-foreground"
                            : "border-border bg-surface text-silver hover:border-silver hover:text-foreground"
                        )}
                      >
                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md">
                          <Image
                            src={option.image}
                            alt={option.name}
                            fill
                            className="object-cover"
                            sizes="56px"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold uppercase tracking-wide">
                            {option.name}
                          </p>
                          <p className="text-xs text-silver-muted">{option.value}</p>
                          <p className="mt-1 text-sm font-medium text-cyan">
                            ₹{option.price.toLocaleString("en-IN")}
                          </p>
                        </div>
                        {active && <Check className="h-4 w-4 text-cyan" />}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            ))}

            <motion.div variants={fadeInUp} className="flex gap-3 pt-4">
              <Button className="flex-1 gap-2 bg-cyan text-black hover:bg-cyan-light">
                <Plus className="h-4 w-4" /> Add to Build
              </Button>
              <Button
                variant="outline"
                onClick={() => setSelected({})}
                className="border-border bg-transparent text-foreground hover:border-cyan hover:text-cyan"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
