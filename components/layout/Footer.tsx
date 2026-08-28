"use client";

import Link from "next/link";
import Image from "next/image";
import { Instagram, Youtube, ArrowUpRight, ArrowRight } from "lucide-react";

const footerLinks = [
  {
    title: "Shop",
    links: [
      { label: "All Products", href: "/shop" },
      { label: "Exterior", href: "/shop?category=exterior" },
      { label: "Interior", href: "/shop?category=interior" },
      { label: "Lighting", href: "/shop?category=lighting" },
      { label: "Wheels", href: "/shop?category=wheels" },
      { label: "Performance", href: "/shop?category=performance" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Builds", href: "/builds" },
      { label: "Vehicle Fitment", href: "/#vehicle-selector" },
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Shipping", href: "/shipping" },
      { label: "Returns", href: "/returns" },
      { label: "Installation", href: "/installation" },
      { label: "FAQs", href: "/faqs" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-border bg-raised">
      <div className="relative mx-auto max-w-[1600px] px-4 pt-16 md:px-8 md:pt-24">
        {/* Top: brand statement / CTA */}
        <div className="mb-16 flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan">
              Get Your Car Rolling In Style.
            </p>
            <p className="mt-2 max-w-md font-display text-3xl font-semibold uppercase leading-tight text-foreground md:text-4xl">
              Built Around Your Ride.
            </p>
          </div>
          <Link
            href="/shop"
            className="group inline-flex items-center gap-2 rounded-full bg-cyan px-6 py-3 text-sm font-semibold uppercase tracking-wider text-black transition-colors hover:bg-cyan-light"
          >
            Start Your Build
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Middle: navigation */}
        <div className="grid gap-12 border-t border-border pt-12 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" aria-label="Cartunez home">
              <Image
                src="/logo/cartunez-logo.png"
                alt="Cartunez"
                width={160}
                height={56}
                className="mb-6 h-12 w-auto object-contain"
              />
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-silver-muted">
              Premium accessories, styling and performance upgrades built around
              your ride. Get your car rolling in style.
            </p>
            <div className="mt-6 flex items-center gap-4">
              <a
                href="https://instagram.com/cartunez_hyd"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-silver transition-colors hover:border-cyan hover:text-cyan"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://youtube.com/cartunez"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-silver transition-colors hover:border-cyan hover:text-cyan"
                aria-label="YouTube"
              >
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>

          {footerLinks.map((group) => (
            <div key={group.title}>
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-foreground">
                {group.title}
              </h3>
              <ul className="space-y-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center gap-1 text-sm text-silver-muted transition-colors hover:text-cyan"
                    >
                      {link.label}
                      <ArrowUpRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-border py-8 text-xs text-silver-muted md:flex-row">
          <p>&copy; {new Date().getFullYear()} Cartunez. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-foreground">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-foreground">Terms of Service</Link>
          </div>
        </div>
      </div>

      {/* Bottom: huge cropped CARTUNEZ wordmark */}
      <div className="pointer-events-none relative select-none overflow-hidden">
        <div className="atmo-horizon absolute left-1/2 top-0 w-2/3 -translate-x-1/2" />
        <span
          className="block translate-y-[18%] whitespace-nowrap text-center font-display text-[19vw] font-bold uppercase leading-[0.8] tracking-tighter"
          style={{
            background: "linear-gradient(180deg, rgba(242,242,242,0.14) 0%, rgba(242,242,242,0.03) 60%, transparent 100%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          Cartunez
        </span>
      </div>
    </footer>
  );
}
