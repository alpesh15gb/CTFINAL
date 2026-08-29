import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight, Instagram, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";

const footerLinks = [
  {
    title: "Upgrade",
    links: [
      { label: "All products", href: "/shop" },
      { label: "Exterior", href: "/shop?category=exterior" },
      { label: "Interior", href: "/shop?category=interior" },
      { label: "Lighting", href: "/shop?category=lighting" },
      { label: "Performance", href: "/shop?category=performance" },
    ],
  },
  {
    title: "Discover",
    links: [
      { label: "Curated builds", href: "/builds" },
      { label: "Vehicle fitment", href: "/#vehicle-selector" },
      { label: "Our approach", href: "/about" },
      { label: "Talk to an expert", href: "/contact" },
    ],
  },
  {
    title: "Ownership",
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
    <footer className="precision-grid relative overflow-hidden border-t border-border bg-[#020303]">
      <div className="site-container relative pt-16 md:pt-24">
        <div className="grid items-end gap-10 border-b border-border pb-14 lg:grid-cols-12 lg:pb-20">
          <div className="lg:col-span-8">
            <p className="technical-label">Performance, made personal</p>
            <p className="mt-6 max-w-4xl font-display text-5xl font-bold uppercase leading-[0.84] tracking-tight text-foreground md:text-7xl">
              Build something
              <span className="display-outline block">unmistakably yours.</span>
            </p>
          </div>
          <div className="lg:col-span-4 lg:justify-self-end">
            <Button asChild size="lg">
              <Link href="/#vehicle-selector" className="gap-3">
                Start with your car <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-12 py-14 md:grid-cols-2 lg:grid-cols-5 lg:py-20">
          <div className="lg:col-span-2">
            <Link href="/" aria-label="Cartunez home" className="inline-flex min-h-11 items-center">
              <Image
                src="/logo/cartunez-logo.png"
                alt="Cartunez"
                width={180}
                height={64}
                className="h-12 w-auto object-contain"
              />
            </Link>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-silver-muted">
              Premium automotive upgrades, fitment guidance and considered builds for drivers who care about every detail.
            </p>
            <div className="mt-7 flex items-center gap-3">
              <a
                href="https://instagram.com/cartunez_hyd"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 w-11 items-center justify-center border border-border text-silver transition hover:border-cyan hover:text-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan"
                aria-label="Cartunez on Instagram"
              >
                <Instagram className="h-4 w-4" aria-hidden="true" />
              </a>
              <a
                href="https://youtube.com/cartunez"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 w-11 items-center justify-center border border-border text-silver transition hover:border-cyan hover:text-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan"
                aria-label="Cartunez on YouTube"
              >
                <Youtube className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>

          {footerLinks.map((group) => (
            <div key={group.title}>
              <h3 className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-foreground">
                {group.title}
              </h3>
              <ul className="mt-5 space-y-1">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="group inline-flex min-h-11 items-center gap-1.5 text-sm text-silver-muted transition-colors hover:text-cyan focus-visible:outline-none focus-visible:text-cyan"
                    >
                      {link.label}
                      <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4 border-t border-border py-7 font-mono text-[10px] uppercase tracking-[0.14em] text-silver-muted md:flex-row md:items-center md:justify-between">
          <p>&copy; {new Date().getFullYear()} Cartunez. Engineered in Hyderabad.</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Link href="/privacy" className="py-2 transition-colors hover:text-foreground">Privacy</Link>
            <Link href="/terms" className="py-2 transition-colors hover:text-foreground">Terms</Link>
          </div>
        </div>
      </div>

      <div className="pointer-events-none relative select-none overflow-hidden" aria-hidden="true">
        <span className="display-outline block translate-y-[18%] whitespace-nowrap text-center font-display text-[19vw] font-bold uppercase leading-[0.78] tracking-[-0.055em] opacity-20">
          Cartunez
        </span>
      </div>
    </footer>
  );
}
