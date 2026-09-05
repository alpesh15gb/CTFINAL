"use client";

import { useState, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, MapPin, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getBuildBySlug } from "@/data/builds";
import { staggerContainer, fadeInUp } from "@/lib/animations";

export const dynamic = "force-dynamic";

export default function BuildDetailPage() {
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : "";
  const build = getBuildBySlug(slug);

  if (!build) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background pt-20">
        <div className="text-center">
          <h1 className="font-display text-4xl uppercase text-foreground">
            Build Not Found
          </h1>
          <Button asChild className="mt-6 bg-cyan text-black hover:bg-cyan-light">
            <Link href="/builds">Back to Builds</Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background pb-24 pt-28">
      <div className="mx-auto max-w-[1600px] px-4 md:px-8">
        <Link
          href="/builds"
          className="mb-6 inline-flex items-center gap-2 text-sm text-silver-muted transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to builds
        </Link>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="grid gap-10 lg:grid-cols-2"
        >
          {/* Media */}
          <motion.div variants={fadeInUp} className="space-y-4">
            <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-border bg-raised">
              <Image
                src={build.image}
                alt={build.title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              {build.detailImages.map((img, idx) => (
                <div
                  key={idx}
                  className="relative aspect-square overflow-hidden rounded-lg border border-border bg-raised"
                >
                  <Image
                    src={img}
                    alt={`${build.title} detail ${idx + 1}`}
                    fill
                    className="object-cover"
                    sizes="200px"
                  />
                </div>
              ))}
            </div>

            {build.beforeImage && build.afterImage && (
              <div className="pt-6">
                <h3 className="mb-4 font-display text-xl uppercase text-foreground">
                  Before / After
                </h3>
                <BeforeAfter before={build.beforeImage} after={build.afterImage} />
              </div>
            )}
          </motion.div>

          {/* Info */}
          <motion.div variants={fadeInUp} className="space-y-8">
            <div>
              <div className="flex flex-wrap items-center gap-3 text-sm uppercase tracking-widest text-silver-muted">
                <span>{build.year}</span>
                <span className="h-1 w-1 rounded-full bg-silver-muted" />
                <span>{build.vehicle}</span>
                <span className="h-1 w-1 rounded-full bg-silver-muted" />
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" /> {build.location}
                </span>
              </div>
              <h1 className="mt-3 font-display text-4xl font-bold uppercase leading-tight text-foreground md:text-6xl">
                {build.title}
              </h1>
            </div>

            <div className="rounded-lg border border-border bg-raised p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-cyan-deep/40 text-cyan-deep">
                  <Wrench className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-display text-2xl font-semibold text-foreground">
                    {build.upgradeCount}
                  </p>
                  <p className="text-sm text-silver-muted">Upgrades installed</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xs font-semibold uppercase tracking-widest text-foreground">
                The Build Story
              </h2>
              <p className="mt-3 leading-relaxed text-silver-muted">
                {build.story}
              </p>
            </div>

            <Separator className="bg-border" />

            <div>
              <h2 className="text-xs font-semibold uppercase tracking-widest text-foreground">
                Installed Products
              </h2>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {build.upgrades.map((upgrade, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-2 text-sm text-silver-muted"
                  >
                    <span className="text-cyan-deep">{String(idx + 1).padStart(2, "0")}</span>
                    {upgrade}
                  </li>
                ))}
              </ul>
            </div>

            <Button
              asChild
              size="lg"
              className="w-full gap-2 bg-red text-white hover:bg-red-deep md:w-auto"
            >
              <Link href="/shop" className="gap-2">
                Shop This Build <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}

function BeforeAfter({ before, after }: { before: string; after: string }) {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setPosition((x / rect.width) * 100);
  }, []);

  const startDrag = (clientX: number) => {
    dragging.current = true;
    updatePosition(clientX);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    e.preventDefault();
    updatePosition(e.clientX);
  };

  const onPointerUp = () => {
    dragging.current = false;
  };

  return (
    <div
      ref={containerRef}
      className="relative aspect-video cursor-ew-resize select-none overflow-hidden rounded-lg border border-border"
      onPointerDown={(e) => startDrag(e.clientX)}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
    >
      <Image
        src={before}
        alt="Before"
        fill
        className="object-cover"
        sizes="(max-width: 1024px) 100vw, 50vw"
        draggable={false}
      />
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <Image
          src={after}
          alt="After"
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
          draggable={false}
        />
      </div>

      {/* Divider */}
      <div
        className="absolute top-0 bottom-0 w-px bg-cyan"
        style={{ left: `${position}%` }}
      >
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan bg-raised p-2 text-cyan shadow-[0_0_20px_rgba(2,187,252,0.4)]">
          <ArrowLeft className="h-3 w-3" />
        </div>
      </div>

      <div className="absolute left-3 top-3 rounded bg-raised/80 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-foreground">
        Before
      </div>
      <div className="absolute right-3 top-3 rounded bg-raised/80 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-foreground">
        After
      </div>
    </div>
  );
}
