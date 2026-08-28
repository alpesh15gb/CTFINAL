"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, X, CarFront, ArrowRight, PackageSearch } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProductCard } from "@/components/product/ProductCard";
import { useVehicle } from "@/hooks/useVehicle";
import { getProducts } from "@/lib/medusa";
import type { Product } from "@/types";
import { staggerContainer, fadeInUp } from "@/lib/animations";

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
];

export default function ShopPage() {
  return (
    <Suspense fallback={<ShopSkeleton />}>
      <ShopContent />
    </Suspense>
  );
}

function ShopSkeleton() {
  return (
    <main className="min-h-screen bg-background pb-24 pt-28">
      <div className="mx-auto max-w-[1600px] px-4 md:px-8">
        <div className="h-12 w-48 animate-pulse rounded bg-raised" />
        <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((item) => <div key={item} className="aspect-square animate-pulse rounded-xl bg-raised" />)}
        </div>
      </div>
    </main>
  );
}

function ShopContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { selected, clearVehicle } = useVehicle();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [catalogError, setCatalogError] = useState(false);
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    void getProducts({ limit: 100 }).then((result) => {
      if (!active) return;
      setProducts(result);
      setCatalogError(result.length === 0);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  const categoryParam = searchParams.get("category");
  const sortParam = searchParams.get("sort") ?? "featured";
  const compatibleOnly = searchParams.get("compatible") === "true";
  const availableCategories = useMemo(() => {
    const seen = new Map<string, { slug: string; name: string }>();
    products.forEach((product) => {
      if (product.categorySlug && !seen.has(product.categorySlug)) {
        seen.set(product.categorySlug, { slug: product.categorySlug, name: product.category });
      }
    });
    return Array.from(seen.values());
  }, [products]);
  const activeCategory = availableCategories.find((category) => category.slug === categoryParam) ?? null;

  const filtered = useMemo(() => {
    let list = [...products];
    if (query.trim()) {
      const normalized = query.toLowerCase();
      list = list.filter((product) =>
        product.name.toLowerCase().includes(normalized) ||
        product.category.toLowerCase().includes(normalized) ||
        product.description.toLowerCase().includes(normalized)
      );
    }
    if (activeCategory) list = list.filter((product) => product.categorySlug === activeCategory.slug);
    if (selected && compatibleOnly) list = list.filter((product) => product.compatibility.includes(selected.slug));

    if (sortParam === "price-asc") list.sort((a, b) => a.price - b.price);
    if (sortParam === "price-desc") list.sort((a, b) => b.price - a.price);
    if (sortParam === "rating") list.sort((a, b) => b.rating - a.rating);
    return list;
  }, [products, query, activeCategory, selected, compatibleOnly, sortParam]);

  const updateParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (!value) params.delete(key);
    else params.set(key, value);
    router.push(`/shop${params.size ? `?${params.toString()}` : ""}`, { scroll: false });
  };

  const resetFilters = () => {
    setQuery("");
    router.push("/shop", { scroll: false });
  };

  const filterCount = (activeCategory ? 1 : 0) + (query ? 1 : 0) + (compatibleOnly ? 1 : 0);

  return (
    <main className="relative min-h-screen bg-background pb-24 pt-28">
      <div className="mx-auto max-w-[1600px] px-4 md:px-8">
        <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="mb-8">
          <motion.h1 variants={fadeInUp} className="font-display text-5xl font-bold uppercase tracking-tight text-foreground md:text-6xl">Shop</motion.h1>
          {selected ? (
            <motion.div variants={fadeInUp} className="mt-4 flex flex-col gap-4 rounded-lg border border-border bg-raised p-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-cyan/40 text-cyan"><CarFront className="h-5 w-5" /></div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-silver-muted">Shopping For</p>
                  <p className="font-display text-lg uppercase text-foreground">{selected.year} {selected.brand} {selected.model} {selected.variant}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant={compatibleOnly ? "default" : "outline"} size="sm" onClick={() => updateParam("compatible", compatibleOnly ? null : "true")} className={compatibleOnly ? "bg-cyan text-black hover:bg-cyan-light" : "border-border bg-transparent text-foreground hover:border-cyan hover:text-cyan"}>Fits {selected.model} only</Button>
                <Button variant="ghost" size="sm" onClick={clearVehicle} className="text-silver-muted hover:text-foreground">Change Vehicle</Button>
              </div>
            </motion.div>
          ) : (
            <motion.div variants={fadeInUp} className="mt-4 flex items-center gap-2 text-silver-muted">
              <CarFront className="h-4 w-4" />
              <span className="text-sm">Select your vehicle for fitment-matched results.</span>
              <Link href="/#vehicle-selector" className="inline-flex items-center gap-1 text-sm font-medium text-cyan hover:underline">Find My Car <ArrowRight className="h-3 w-3" /></Link>
            </motion.div>
          )}
        </motion.div>

        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 md:max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-silver-muted" />
            <Input type="search" placeholder="Search Medusa products..." value={query} onChange={(event) => setQuery(event.target.value)} className="border-border bg-raised pl-10 text-foreground placeholder:text-silver-muted focus-visible:ring-cyan" />
          </div>
          <div className="flex items-center gap-3">
            <Select value={sortParam} onValueChange={(value) => updateParam("sort", value)}>
              <SelectTrigger className="w-[180px] border-border bg-raised text-foreground"><SelectValue placeholder="Sort by" /></SelectTrigger>
              <SelectContent className="border-border bg-raised text-foreground">
                {sortOptions.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
              </SelectContent>
            </Select>
            <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="border-border bg-transparent text-foreground hover:border-cyan hover:text-cyan md:hidden">
                  <SlidersHorizontal className="mr-2 h-4 w-4" /> Filters
                  {filterCount > 0 && <Badge className="ml-2 bg-cyan text-black">{filterCount}</Badge>}
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[80vh] border-border bg-raised text-foreground">
                <SheetHeader><SheetTitle className="text-left font-display uppercase tracking-wide text-foreground">Filters</SheetTitle></SheetHeader>
                <div className="mt-6 space-y-6"><FilterContent categories={availableCategories} activeCategory={activeCategory} updateParam={updateParam} resetFilters={resetFilters} selected={selected} compatibleOnly={compatibleOnly} /></div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
          <aside className="hidden space-y-8 md:block"><FilterContent categories={availableCategories} activeCategory={activeCategory} updateParam={updateParam} resetFilters={resetFilters} selected={selected} compatibleOnly={compatibleOnly} /></aside>
          <div>
            <div className="mb-4 flex items-center justify-between text-sm text-silver-muted">
              <span>{loading ? "Loading catalog…" : `${filtered.length} product${filtered.length === 1 ? "" : "s"}`}</span>
              {filterCount > 0 && <button onClick={resetFilters} className="inline-flex items-center gap-1 text-cyan hover:underline"><X className="h-3 w-3" /> Reset filters</button>}
            </div>

            {loading ? (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">{[0, 1, 2, 3, 4, 5].map((item) => <div key={item} className="aspect-square animate-pulse rounded-xl border border-border bg-raised" />)}</div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-raised py-24 text-center">
                <PackageSearch className="h-10 w-10 text-silver-muted" />
                <h3 className="mt-4 font-display text-2xl uppercase text-foreground">{catalogError && products.length === 0 ? "No published Medusa products" : "No products found"}</h3>
                <p className="mt-2 max-w-sm text-silver-muted">{catalogError && products.length === 0 ? "Publish products in Medusa Admin. The storefront no longer falls back to demo product data." : "Try adjusting filters or search terms."}</p>
                {filterCount > 0 && <Button onClick={resetFilters} className="mt-6 bg-cyan text-black hover:bg-cyan-light">Reset Filters</Button>}
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">{filtered.map((product) => <ProductCard key={product.id} product={product} />)}</div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

function FilterContent({ categories, activeCategory, updateParam, resetFilters, selected, compatibleOnly }: {
  categories: Array<{ slug: string; name: string }>;
  activeCategory: { slug: string; name: string } | null;
  updateParam: (key: string, value: string | null) => void;
  resetFilters: () => void;
  selected: ReturnType<typeof useVehicle>["selected"];
  compatibleOnly: boolean;
}) {
  return (
    <>
      <div className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-foreground">Categories</h3>
        <div className="space-y-1">
          <button onClick={() => updateParam("category", null)} className={`block w-full text-left text-sm transition-colors ${!activeCategory ? "font-medium text-cyan" : "text-silver-muted hover:text-foreground"}`}>All Categories</button>
          {categories.map((category) => (
            <button key={category.slug} onClick={() => updateParam("category", category.slug)} className={`block w-full text-left text-sm transition-colors ${activeCategory?.slug === category.slug ? "font-medium text-cyan" : "text-silver-muted hover:text-foreground"}`}>{category.name}</button>
          ))}
        </div>
      </div>
      {selected && (
        <div className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-foreground">Fitment</h3>
          <label className="flex cursor-pointer items-center gap-3 text-sm text-silver-muted">
            <input type="checkbox" checked={compatibleOnly} onChange={(event) => updateParam("compatible", event.target.checked ? "true" : null)} className="h-4 w-4 accent-cyan" />
            Fits my {selected.model}
          </label>
        </div>
      )}
      <Button onClick={resetFilters} variant="outline" className="w-full border-border bg-transparent text-foreground hover:border-cyan hover:text-cyan">Reset Filters</Button>
    </>
  );
}
