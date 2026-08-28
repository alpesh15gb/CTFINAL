"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Instagram, ExternalLink, Play } from "lucide-react";
import { staggerContainer, fadeInUp } from "@/lib/animations";
import { TextReveal } from "@/components/animations";

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
  const [loading, setLoading] = useState(true);

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
      } catch (error) {
        console.log("Using fallback reels");
      } finally {
        setLoading(false);
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
          className="mb-12 text-center"
        >
          <motion.span
            variants={fadeInUp}
            className="mb-3 inline-block text-xs font-semibold uppercase tracking-[0.25em] text-cyan"
          >
            Follow Us
          </motion.span>
          <motion.h2
            variants={fadeInUp}
            className="font-display text-5xl font-bold uppercase leading-[0.9] tracking-tight text-foreground md:text-7xl"
          >
            <TextReveal by="word" stagger={0.03}>
              Latest Reels
            </TextReveal>
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="mx-auto mt-6 max-w-lg text-lg text-silver-muted"
          >
            Check out our latest builds, transformations, and car content on Instagram.
          </motion.p>
        </motion.div>

        {/* Reel Thumbnails Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {reels.map((reel, idx) => (
            <motion.a
              key={reel.id}
              href={reel.permalink}
              target="_blank"
              rel="noopener noreferrer"
              variants={fadeInUp}
              className="group relative aspect-[9/16] overflow-hidden rounded-xl border border-border bg-background"
            >
              <Image
                src={reel.thumbnail}
                alt={reel.caption}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              {/* Play Icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-cyan/90 text-black transition-transform duration-300 group-hover:scale-110">
                  <Play className="h-8 w-8 fill-current" />
                </div>
              </div>

              {/* Caption */}
              <div className="absolute inset-x-0 bottom-0 p-6">
                <p className="line-clamp-2 font-display text-lg font-semibold uppercase text-foreground">
                  {reel.caption}
                </p>
                <p className="mt-2 flex items-center gap-2 text-sm text-silver-muted">
                  <Instagram className="h-4 w-4" /> Watch on Instagram
                  <ExternalLink className="h-3 w-3" />
                </p>
              </div>
            </motion.a>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <a
            href="https://instagram.com/cartunez_hyd"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-cyan px-8 py-4 text-sm font-semibold uppercase tracking-wider text-black transition-colors hover:bg-cyan-light"
          >
            <Instagram className="h-5 w-5" /> Follow @cartunez_hyd
          </a>
          <p className="mt-4 text-sm text-silver-muted">
            Want your feature? Tag <span className="font-semibold text-cyan">@cartunez_hyd</span> in your builds!
          </p>
        </motion.div>
      </div>
    </section>
  );
}
