"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Instagram, ExternalLink, Play } from "lucide-react";
import { staggerContainer, fadeInUp } from "@/lib/animations";

interface Reel {
  id: string;
  caption: string;
  thumbnail: string;
  permalink: string;
  timestamp: string;
}

const fallbackReels = [
  {
    id: "1",
    caption: "Build Transformations",
    thumbnail: "https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=800&auto=format&fit=crop",
    permalink: "https://instagram.com/cartunez_hyd",
    timestamp: new Date().toISOString(),
  },
  {
    id: "2",
    caption: "LED Upgrades",
    thumbnail: "https://images.unsplash.com/photo-1542282088-fe8426682b8f?q=80&w=800&auto=format&fit=crop",
    permalink: "https://instagram.com/cartunez_hyd",
    timestamp: new Date().toISOString(),
  },
  {
    id: "3",
    caption: "Custom Wheels",
    thumbnail: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=800&auto=format&fit=crop",
    permalink: "https://instagram.com/cartunez_hyd",
    timestamp: new Date().toISOString(),
  },
];

export function InstagramReels() {
  const [reels, setReels] = useState<Reel[]>(fallbackReels);

  useEffect(() => {
    async function fetchReels() {
      try {
        const res = await fetch("/api/instagram");
        if (res.ok) {
          const data = await res.json();
          if (data.reels && data.reels.length > 0) {
            setReels(data.reels);
          }
        }
      } catch {
        // Using fallback reels
      }
    }
    fetchReels();
  }, []);

  return (
    <section className="relative z-20 bg-raised py-24 md:py-32">
      <div className="mx-auto max-w-[1600px] px-4 md:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="mb-14 flex items-end justify-between border-b border-white/[0.06] pb-6"
        >
          <div>
            <motion.span
              variants={fadeInUp}
              className="mb-2 inline-block font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-cyan"
            >
              Social Feed
            </motion.span>
            <motion.h2
              variants={fadeInUp}
              className="font-display text-4xl font-bold uppercase leading-[0.9] tracking-tight text-foreground md:text-6xl"
            >
              Latest Reels
            </motion.h2>
          </div>
          <motion.a
            variants={fadeInUp}
            href="https://instagram.com/cartunez_hyd"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-2 font-mono text-[10px] uppercase tracking-[0.15em] text-silver-muted transition-colors hover:text-cyan md:flex"
          >
            <Instagram className="h-4 w-4" /> @cartunez_hyd
            <ExternalLink className="h-3 w-3" />
          </motion.a>
        </motion.div>

        {/* Reel grid — clean editorial layout */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
        >
          {reels.map((reel) => (
            <motion.a
              key={reel.id}
              href={reel.permalink}
              target="_blank"
              rel="noopener noreferrer"
              variants={fadeInUp}
              className="group relative aspect-[9/16] overflow-hidden border border-border bg-background"
            >
              <Image
                src={reel.thumbnail}
                alt={reel.caption}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover saturate-[0.8] transition duration-700 ease-out-expo group-hover:scale-[1.04] group-hover:saturate-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

              {/* Play icon — minimal */}
              <div className="absolute inset-0 flex items-center justify-center opacity-80 transition-opacity group-hover:opacity-100">
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/30 bg-black/40 text-white backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                  <Play className="h-5 w-5 fill-current" />
                </div>
              </div>

              {/* Caption */}
              <div className="absolute inset-x-0 bottom-0 p-5">
                <p className="line-clamp-2 font-display text-lg font-semibold uppercase text-foreground">
                  {reel.caption}
                </p>
                <p className="mt-2 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.15em] text-silver-muted">
                  <Instagram className="h-3 w-3" /> Watch on Instagram
                </p>
              </div>
            </motion.a>
          ))}
        </motion.div>

        {/* Mobile-only follow CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-10 text-center md:hidden"
        >
          <a
            href="https://instagram.com/cartunez_hyd"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-sm bg-cyan px-6 py-3 text-xs font-bold uppercase tracking-wider text-black transition-colors hover:bg-cyan-light"
          >
            <Instagram className="h-4 w-4" /> Follow @cartunez_hyd
          </a>
        </motion.div>
      </div>
    </section>
  );
}
