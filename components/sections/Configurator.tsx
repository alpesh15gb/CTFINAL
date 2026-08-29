"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2, Plus, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { getProducts } from "@/lib/medusa";
import type { Product } from "@/types";
import { staggerContainer, fadeInUp, scaleIn } from "@/lib/animations";

export function Configurator() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selected, setSelected] = useState<Record<string, Product>>({});
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const { addItem, loading: cartLoading } = useCart();

  useEffect(() => {
    let active = true;
    void getProducts({ limit: 30 }).then((catalog) => {
      if (!active) return;
      setProducts(catalog.filter((product) => product.inStock && product.variantId));
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  const configGroups = useMemo(() => {
    const grouped = new Map<string, Product[]>();
    products.forEach((product) => {
      const key = product.categorySlug || "upgrades";
      const current = grouped.get(key) || [];
      if (current.length < 3) grouped.set(key, [...current, product]);
    });
    return Array.from(grouped.entries()).slice(0, 3).map(([key, options]) => ({ key, label: options[0]?.category || "Upgrades", options }));
  }, [products]);

  const toggleOption = (groupKey: string, product: Product) => {
    setSelected((previous) => {
      const next = { ...previous };
      if (next[groupKey]?.id === product.id) delete next[groupKey];
      else next[groupKey] = product;
      return next;
    });
  };

  const selectedProducts = Object.values(selected);
  const total = selectedProducts.reduce((sum, product) => sum + product.price, 0);
  const previewImage = selectedProducts.at(-1)?.images[0] || products[0]?.images[0] || "https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=1600&auto=format&fit=crop";

  const addSelected = async () => {
    if (!selectedProducts.length) return;
    let allAdded = true;
    for (const product of selectedProducts) {
      const ok = await addItem(product, 1);
      if (!ok) allAdded = false;
    }
    if (allAdded) {
      setAdded(true);
      window.setTimeout(() => setAdded(false), 1800);
    }
  };

  return (
    <section className="relative z-30 -mt-[32vh] border-t border-border bg-raised pb-24 pt-16 md:pb-32 md:pt-20">
      <div className="mx-auto max-w-[1600px] px-4 md:px-8">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="mb-12 md:mb-16">
          <motion.span variants={fadeInUp} className="mb-3 inline-block text-xs font-semibold uppercase tracking-[0.25em] text-cyan">06 / Configurator</motion.span>
          <motion.h2 variants={fadeInUp} className="font-display text-5xl font-bold uppercase leading-[0.9] tracking-tight text-foreground md:text-7xl">Make It<br /><span className="text-silver">Yours.</span></motion.h2>
          <motion.p variants={fadeInUp} className="mt-4 max-w-xl text-silver-muted">Choose live products from Medusa. Prices, stock and cart line items stay connected to the backend.</motion.p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-2">
          <motion.div variants={scaleIn} initial="hidden" whileInView="visible" viewport={{ once: true }} className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-black md:aspect-square">
            <Image src={previewImage} alt="Selected Medusa product preview" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
            <div className="absolute inset-0 bg-gradient-to-r from-raised/60 via-transparent to-raised/60" />
            <div className="absolute left-4 top-4 flex flex-wrap gap-2">
              <AnimatePresence>
                {Object.entries(selected).map(([key, product]) => (
                  <motion.span key={key} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="rounded-full border border-cyan/40 bg-cyan/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-cyan">{product.name}</motion.span>
                ))}
              </AnimatePresence>
            </div>
            <div className="absolute bottom-4 left-4 right-4 rounded-lg border border-border bg-raised/90 p-4 backdrop-blur">
              <p className="text-xs uppercase tracking-widest text-silver-muted">Selected Products</p>
              <p className="font-display text-3xl font-semibold text-foreground">₹{total.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</p>
            </div>
          </motion.div>

          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="space-y-8">
            {loading ? (
              <div className="flex min-h-60 items-center justify-center rounded-xl border border-border bg-surface text-silver-muted"><Loader2 className="mr-3 h-5 w-5 animate-spin text-cyan" /> Loading Medusa catalog…</div>
            ) : configGroups.length === 0 ? (
              <div className="rounded-xl border border-border bg-surface p-8 text-silver-muted">Publish in-stock Medusa products to populate this configurator.</div>
            ) : (
              configGroups.map((group) => (
                <motion.div key={group.key} variants={fadeInUp} className="space-y-4">
                  <div className="flex items-center gap-3"><span className="text-xs font-bold uppercase text-cyan">{group.label}</span><span className="h-px flex-1 bg-border" /></div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {group.options.map((product) => {
                      const active = selected[group.key]?.id === product.id;
                      return (
                        <button key={product.id} type="button" onClick={() => toggleOption(group.key, product)} className={cn("relative flex items-center gap-3 rounded-lg border p-3 text-left transition-all", active ? "border-cyan bg-cyan/10 text-foreground" : "border-border bg-surface text-silver hover:border-silver hover:text-foreground")}>
                          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md"><Image src={product.images[0]} alt={product.name} fill className="object-cover" sizes="56px" /></div>
                          <div className="flex-1"><p className="text-sm font-semibold uppercase tracking-wide">{product.name}</p><p className="mt-1 text-sm font-medium text-cyan">{product.currency}{product.price.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</p></div>
                          {active && <Check className="h-4 w-4 text-cyan" />}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              ))
            )}

            <motion.div variants={fadeInUp} className="flex gap-3 pt-4">
              <Button disabled={!selectedProducts.length || cartLoading} onClick={addSelected} className="flex-1 gap-2 bg-cyan text-black hover:bg-cyan-light"><Plus className="h-4 w-4" /> {added ? "Added to Cart" : "Add Selected to Cart"}</Button>
              <Button variant="outline" onClick={() => setSelected({})} className="border-border bg-transparent text-foreground hover:border-cyan hover:text-cyan"><RotateCcw className="h-4 w-4" /></Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
