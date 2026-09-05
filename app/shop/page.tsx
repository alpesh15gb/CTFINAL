"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
  CarFront,
  ArrowRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductCard } from "@/components/product/ProductCard";
import type { Category, Product } from "@/types";
import { listStoreCategories, listStoreCollections, listStoreProducts } from "@/lib/medusa";
import {
  adaptStoreCategory,
  adaptStoreProduct,
  type MedusaStoreCategory,
  type MedusaStoreCollection,
  type MedusaStoreProduct,
} from "@/lib/store-adapter";
import { useVehicle } from "@/hooks/useVehicle";
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
        <div className="mt-8 h-64 rounded-xl bg-raised" />
      </div>
    </main>
  );
}

function ShopContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { selected, clearVehicle } = useVehicle();

  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Live catalog from Medusa — no local fallback (an empty/error state is
  // always preferable to showing products we don't sell).
  const [catalog, setCatalog] = useState<Product[] | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [collections, setCollections] = useState<MedusaStoreCollection[]>([]);
  const [loadError, setLoadError] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setCatalog(null);
    setLoadError(false);
    (async () => {
      try {
        const [rawProducts, rawCategories, rawCollections] = await Promise.all([
          listStoreProducts({ limit: 100 }),
          listStoreCategories().catch(() => [] as unknown[]),
          listStoreCollections().catch(() => [] as unknown[]),
        ]);
        if (cancelled) return;
        setCatalog(
          (rawProducts as MedusaStoreProduct[]).map(adaptStoreProduct)
        );
        setCategories(
          (rawCategories as MedusaStoreCategory[]).map(adaptStoreCategory)
        );
        setCollections(rawCollections as MedusaStoreCollection[]);
      } catch (error) {
        console.error("[shop] failed to load live catalog:", error);
        if (!cancelled) setLoadError(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [attempt]);

  const products = useMemo(() => catalog ?? [], [catalog]);

  const categoryParam = searchParams.get("category");
  const collectionParam = searchParams.get("collection");
  const sortParam = searchParams.get("sort") ?? "featured";
  const compatibleOnly = searchParams.get("compatible") === "true";

  const activeCategory =
    categories.find((c) => c.slug === categoryParam) ?? null;
  const activeCollection =
    collections.find((c) => c.handle === collectionParam) ?? null;

  const filtered = useMemo(() => {
    let list = [...products];

    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    if (activeCategory) {
      list = list.filter((p) => p.categorySlug === activeCategory.slug);
    }

    if (activeCollection) {
      list = list.filter((p) => p.collectionId === activeCollection.id);
    }

    if (selected && compatibleOnly) {
      // Products without fitment info are treated as universal fit.
      list = list.filter(
        (p) =>
          p.compatibility.length === 0 ||
          p.compatibility.includes(selected.slug)
      );
    }

    switch (sortParam) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        list.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }

    return list;
  }, [query, activeCategory, activeCollection, sortParam, selected, compatibleOnly]);

  const updateParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === null || value === "") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`/shop?${params.toString()}`, { scroll: false });
  };

  const resetFilters = () => {
    setQuery("");
    router.push("/shop", { scroll: false });
  };

  if (loadError) {
    return (
      <main className="min-h-screen bg-background pb-24 pt-28">
        <div className="mx-auto max-w-[1600px] px-4 md:px-8">
          <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-raised py-24 text-center">
            <Search className="h-10 w-10 text-silver-muted" />
            <h3 className="mt-4 font-display text-2xl uppercase text-foreground">
              Store unavailable
            </h3>
            <p className="mt-2 max-w-xs text-silver-muted">
              We couldn&apos;t reach the live catalog. Check your connection
              and try again.
            </p>
            <Button
              onClick={() => setAttempt((a) => a + 1)}
              className="mt-6 bg-cyan text-black hover:bg-cyan-light"
            >
              Retry
            </Button>
          </div>
        </div>
      </main>
    );
  }

  if (catalog === null) {
    return <ShopSkeleton />;
  }

  const filterCount =
    (activeCategory ? 1 : 0) +
    (activeCollection ? 1 : 0) +
    (query ? 1 : 0) +
    (compatibleOnly ? 1 : 0);

  return (
    <main className="relative min-h-screen bg-background pb-24 pt-28">
      <div className="mx-auto max-w-[1600px] px-4 md:px-8">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="mb-8"
        >
          <motion.h1
            variants={fadeInUp}
            className="font-display text-5xl font-bold uppercase tracking-tight text-foreground md:text-6xl"
          >
            Shop
          </motion.h1>

          {selected ? (
            <motion.div
              variants={fadeInUp}
              className="mt-4 flex flex-col gap-4 rounded-lg border border-border bg-raised p-4 md:flex-row md:items-center md:justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-cyan/40 text-cyan">
                  <CarFront className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-silver-muted">
                    Shopping For
                  </p>
                  <p className="font-display text-lg uppercase text-foreground">
                    {selected.year} {selected.brand} {selected.model}{" "}
                    {selected.variant}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={compatibleOnly ? "default" : "outline"}
                  size="sm"
                  onClick={() =>
                    updateParam("compatible", compatibleOnly ? null : "true")
                  }
                  className={
                    compatibleOnly
                      ? "bg-cyan text-black hover:bg-cyan-light"
                      : "border-border bg-transparent text-foreground hover:border-cyan hover:text-cyan"
                  }
                >
                  Fits {selected.model} only
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearVehicle}
                  className="text-silver-muted hover:text-foreground"
                >
                  Change Vehicle
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              variants={fadeInUp}
              className="mt-4 flex items-center gap-2 text-silver-muted"
            >
              <CarFront className="h-4 w-4" />
              <span className="text-sm">
                Select your vehicle for fitment-matched results.
              </span>
              <Link
                href="/#vehicle-selector"
                className="inline-flex items-center gap-1 text-sm font-medium text-cyan hover:underline"
              >
                Find My Car <ArrowRight className="h-3 w-3" />
              </Link>
            </motion.div>
          )}
        </motion.div>

        {/* Controls */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 md:max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-silver-muted" />
            <Input
              type="search"
              placeholder="Search products..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="border-border bg-raised pl-10 text-foreground placeholder:text-silver-muted focus-visible:ring-cyan"
            />
          </div>

          <div className="flex items-center gap-3">
            <Select
              value={sortParam}
              onValueChange={(v) => updateParam("sort", v)}
            >
              <SelectTrigger className="w-[180px] border-border bg-raised text-foreground">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="border-border bg-raised text-foreground">
                {sortOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Sheet
              open={mobileFiltersOpen}
              onOpenChange={setMobileFiltersOpen}
            >
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  className="border-border bg-transparent text-foreground hover:border-cyan hover:text-cyan md:hidden"
                >
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  Filters
                  {filterCount > 0 && (
                    <Badge className="ml-2 bg-cyan text-black">{filterCount}</Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent
                side="bottom"
                className="h-[80vh] border-border bg-raised text-foreground"
              >
                <SheetHeader>
                  <SheetTitle className="text-left font-display uppercase tracking-wide text-foreground">
                    Filters
                  </SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-6">
                  <FilterContent
                    categories={categories}
                    activeCategory={activeCategory}
                    updateParam={updateParam}
                    resetFilters={resetFilters}
                    selected={selected}
                    compatibleOnly={compatibleOnly}
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
          {/* Desktop filters */}
          <aside className="hidden space-y-8 md:block">
            <FilterContent
              categories={categories}
              activeCategory={activeCategory}
              updateParam={updateParam}
              resetFilters={resetFilters}
              selected={selected}
              compatibleOnly={compatibleOnly}
            />
          </aside>

          {/* Results */}
          <div>
            <div className="mb-4 flex items-center justify-between text-sm text-silver-muted">
              <span>
                {filtered.length} product{filtered.length !== 1 ? "s" : ""}
                {activeCollection ? ` by ${activeCollection.title}` : ""}
              </span>
              {filterCount > 0 && (
                <button
                  onClick={resetFilters}
                  className="inline-flex items-center gap-1 text-cyan hover:underline"
                >
                  <X className="h-3 w-3" /> Reset filters
                </button>
              )}
            </div>

            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-raised py-24 text-center">
                <Search className="h-10 w-10 text-silver-muted" />
                <h3 className="mt-4 font-display text-2xl uppercase text-foreground">
                  No products found
                </h3>
                <p className="mt-2 max-w-xs text-silver-muted">
                  Try adjusting filters or search terms.
                </p>
                <Button
                  onClick={resetFilters}
                  className="mt-6 bg-cyan text-black hover:bg-cyan-light"
                >
                  Reset Filters
                </Button>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

function FilterContent({
  categories,
  activeCategory,
  updateParam,
  resetFilters,
  selected,
  compatibleOnly,
}: {
  categories: Category[];
  activeCategory: Category | null;
  updateParam: (key: string, value: string | null) => void;
  resetFilters: () => void;
  selected: ReturnType<typeof useVehicle>["selected"];
  compatibleOnly: boolean;
}) {
  return (
    <>
      <div className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-foreground">
          Categories
        </h3>
        <div className="space-y-1">
          <button
            onClick={() => updateParam("category", null)}
            className={`block w-full text-left text-sm transition-colors ${
              !activeCategory
                ? "font-medium text-cyan"
                : "text-silver-muted hover:text-foreground"
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => updateParam("category", cat.slug)}
              className={`block w-full text-left text-sm transition-colors ${
                activeCategory?.slug === cat.slug
                  ? "font-medium text-cyan"
                  : "text-silver-muted hover:text-foreground"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {selected && (
        <div className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-foreground">
            Fitment
          </h3>
          <label className="flex cursor-pointer items-center gap-3 text-sm text-silver-muted">
            <input
              type="checkbox"
              checked={compatibleOnly}
              onChange={(e) =>
                updateParam("compatible", e.target.checked ? "true" : null)
              }
              className="h-4 w-4 accent-cyan"
            />
            Fits my {selected.model}
          </label>
        </div>
      )}

      <Button
        onClick={resetFilters}
        variant="outline"
        className="w-full border-border bg-transparent text-foreground hover:border-cyan hover:text-cyan"
      >
        Reset Filters
      </Button>
    </>
  );
}
