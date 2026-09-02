"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { ArrowRight, Menu, X } from "lucide-react";

const links = [
  { label: "Shop", href: "/shop" },
  { label: "Builds", href: "/builds" },
  { label: "Fitment", href: "/#vehicle-selector" },
  { label: "Studio", href: "/about" },
];

export function ApexHomeNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    const siteHeader = document.querySelector("header.fixed") as HTMLElement | null;
    if (!siteHeader) return;
    const previousDisplay = siteHeader.style.display;
    siteHeader.style.display = "none";
    return () => {
      siteHeader.style.display = previousDisplay;
    };
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 36);
  });

  return (
    <>
      <motion.nav
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 1.05, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed inset-x-0 top-0 z-[70] border-b transition-colors duration-500 ${
          scrolled
            ? "border-white/10 bg-black/80 backdrop-blur-xl"
            : "border-transparent bg-gradient-to-b from-black/75 via-black/25 to-transparent"
        }`}
      >
        <div className="mx-auto flex h-[76px] max-w-[1680px] items-center justify-between px-5 md:h-20 md:px-10">
          <Link
            href="/"
            aria-label="Cartunez home"
            className="font-display text-2xl font-semibold uppercase tracking-[-0.04em] text-white md:text-3xl"
          >
            Cartunez
          </Link>

          <div className="hidden items-center gap-8 lg:flex">
            {links.map((link, index) => (
              <Link
                key={link.label}
                href={link.href}
                className="group relative flex min-h-11 items-center gap-2 font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-white/58 transition-colors hover:text-white"
              >
                <span className="text-[7px] text-white/28">0{index + 1}</span>
                {link.label}
                <span className="absolute inset-x-0 bottom-1 h-px origin-left scale-x-0 bg-white transition-transform duration-300 group-hover:scale-x-100" />
              </Link>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex min-h-11 items-center gap-3 border-l border-white/15 pl-5 font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-white"
            aria-label="Open navigation menu"
          >
            Menu
            <Menu className="h-4 w-4" />
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[90] bg-[#030303]"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="noise-overlay pointer-events-none absolute inset-0 opacity-[0.03]" />
            <div className="relative mx-auto flex h-full max-w-[1680px] flex-col px-5 md:px-10">
              <div className="flex h-[76px] items-center justify-between border-b border-white/12 md:h-20">
                <span className="font-display text-2xl font-semibold uppercase tracking-[-0.04em] text-white md:text-3xl">
                  Cartunez
                </span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex min-h-11 items-center gap-3 font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-white"
                  aria-label="Close navigation menu"
                >
                  Close
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="grid flex-1 items-center py-10 lg:grid-cols-12">
                <div className="lg:col-span-9">
                  {links.map((link, index) => (
                    <motion.div
                      key={link.label}
                      initial={{ opacity: 0, y: 34 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.55, delay: 0.14 + index * 0.07, ease: [0.22, 1, 0.36, 1] }}
                      className="border-b border-white/12"
                    >
                      <Link
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className="group flex min-h-[86px] items-center justify-between py-4 md:min-h-[108px]"
                      >
                        <span className="font-mono text-[9px] uppercase tracking-[0.24em] text-white/35">0{index + 1}</span>
                        <span className="font-display text-[clamp(3.6rem,8vw,8rem)] font-semibold uppercase leading-none tracking-[-0.05em] text-white transition-transform duration-500 group-hover:translate-x-3">
                          {link.label}
                        </span>
                        <ArrowRight className="h-5 w-5 text-white/35 transition-all duration-300 group-hover:translate-x-1 group-hover:text-white" />
                      </Link>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-10 border-t border-white/12 pt-6 lg:col-span-3 lg:ml-12 lg:mt-0">
                  <p className="font-mono text-[8px] uppercase tracking-[0.24em] text-white/35">Performance division</p>
                  <p className="mt-5 max-w-xs text-sm leading-6 text-white/55">
                    Vehicle-specific performance, styling and fitment engineered around your car.
                  </p>
                  <Link
                    href="/contact"
                    onClick={() => setOpen(false)}
                    className="mt-8 inline-flex min-h-11 items-center gap-3 border-b border-white pb-2 font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-white"
                  >
                    Contact studio
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
