"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { ArrowRight, CarFront, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { CartSheet } from "@/components/cart/CartSheet";

const navLinks = [
  { label: "Shop", href: "/shop" },
  { label: "Builds", href: "/builds" },
  { label: "Fitment", href: "/#vehicle-selector" },
  { label: "About", href: "/about" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const { totalItems } = useCart();
  const cartCount = totalItems();

  const isHome = pathname === "/";
  // Cinematic act (hero + bridge) keeps only logo/cart/menu visible
  const [navHidden, setNavHidden] = useState(isHome);

  useEffect(() => {
    if (!isHome) return;
    const sync = () => setNavHidden(window.scrollY < window.innerHeight * 2);
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, [isHome]);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const next = latest > 32;
    setScrolled((current) => (current === next ? current : next));
    if (isHome) {
      const hidden = latest < window.innerHeight * 2;
      setNavHidden((current) => (current === hidden ? current : hidden));
    }
  });

  const isActive = (href: string) => {
    if (href.includes("#") || href.includes("?")) return false;
    return pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));
  };

  return (
    <motion.header
      initial={{ y: -28, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-all duration-500",
        scrolled && !navHidden
          ? "border-white/[0.09] bg-[rgba(3,4,5,0.88)] shadow-[0_18px_55px_rgba(0,0,0,0.28)] backdrop-blur-xl"
          : "border-white/[0.06] bg-gradient-to-b from-black/70 to-transparent"
      )}
    >
      <div
        className={cn(
          "hidden overflow-hidden bg-black/30 transition-all duration-500 lg:block",
          navHidden ? "h-0" : "h-7 border-b border-white/[0.06]"
        )}
      >
        <div className="site-container flex h-full items-center justify-between font-mono text-[9px] uppercase tracking-[0.2em] text-silver-muted">
          <span>Vehicle-specific upgrades / verified fitment</span>
          <div className="flex items-center gap-6">
            <span>India / INR</span>
            <Link href="/contact" className="transition-colors hover:text-white">
              Expert consultation
            </Link>
          </div>
        </div>
      </div>

      <div className="site-container flex h-[76px] items-center justify-between lg:h-20">
        <Link href="/" className="relative z-10 flex min-h-11 items-center" aria-label="Cartunez home">
          <Image
            src="/logo/cartunez-logo.png"
            alt="Cartunez"
            width={156}
            height={54}
            className="h-10 w-auto object-contain lg:h-11"
            priority
          />
        </Link>

        <nav
          className={cn(
            "hidden items-center gap-9 transition-opacity duration-500 lg:flex",
            navHidden ? "pointer-events-none opacity-0" : "opacity-100"
          )}
          aria-label="Main navigation"
        >
          {navLinks.map((link, index) => (
            <Link
              key={link.label}
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={cn(
                "group relative flex min-h-11 items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.18em] transition-colors",
                isActive(link.href) ? "text-white" : "text-silver hover:text-foreground"
              )}
            >
              <span className="text-[8px] text-silver-muted/60">0{index + 1}</span>
              {link.label}
              <span
                className={cn(
                  "absolute inset-x-0 bottom-0 h-px origin-left bg-white transition-transform duration-300",
                  isActive(link.href) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                )}
              />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1.5 md:gap-2">
          <Link
            href="/shop"
            className="hidden h-11 w-11 items-center justify-center rounded-sm border border-transparent text-silver transition-all hover:border-border hover:bg-white/[0.04] hover:text-white md:flex"
            aria-label="Search products"
          >
            <Search className="h-[18px] w-[18px]" />
          </Link>

          <Link
            href="/account"
            className="hidden h-11 w-11 items-center justify-center rounded-sm border border-transparent text-silver transition-all hover:border-border hover:bg-white/[0.04] hover:text-white md:flex"
            aria-label="Account"
          >
            <User className="h-[18px] w-[18px]" />
          </Link>

          <CartSheet>
            <button
              type="button"
              className="relative flex h-11 w-11 cursor-pointer items-center justify-center rounded-sm border border-transparent text-silver transition-all hover:border-border hover:bg-white/[0.04] hover:text-white"
              aria-label={`Cart with ${cartCount} item${cartCount === 1 ? "" : "s"}`}
            >
              <ShoppingBag className="h-[18px] w-[18px]" />
              {cartCount > 0 && (
                <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-white px-1 font-mono text-[8px] font-bold text-black">
                  {cartCount}
                </span>
              )}
            </button>
          </CartSheet>

          <Button
            asChild
            className={cn(
              "ml-2 hidden transition-opacity duration-500 xl:inline-flex",
              navHidden && "pointer-events-none opacity-0"
            )}
          >
            <Link href="/#vehicle-selector">
              Match my vehicle <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-full border-border/70 bg-[rgba(5,7,9,0.97)] p-0 backdrop-blur-2xl sm:max-w-md"
            >
              <div className="precision-grid pointer-events-none absolute inset-0 opacity-60" />
              <div className="relative flex h-full flex-col px-6">
                <div className="flex h-24 items-center justify-between border-b border-border">
                  <Image
                    src="/logo/cartunez-logo.png"
                    alt="Cartunez"
                    width={140}
                    height={48}
                    className="h-10 w-auto object-contain"
                  />
                  <SheetClose asChild>
                    <Button variant="ghost" size="icon" aria-label="Close menu">
                      <X className="h-5 w-5" />
                    </Button>
                  </SheetClose>
                </div>

                <nav className="flex flex-1 flex-col justify-center" aria-label="Mobile navigation">
                  {navLinks.map((link, index) => (
                    <SheetClose key={link.label} asChild>
                      <Link
                        href={link.href}
                        className="group flex min-h-16 items-center justify-between border-b border-border/70 py-4 font-display text-4xl font-semibold uppercase tracking-tight text-foreground transition-colors hover:text-white"
                      >
                        <span className="font-mono text-[10px] tracking-widest text-silver-muted">0{index + 1}</span>
                        {link.label}
                        <ArrowRight className="h-5 w-5 text-silver-muted transition-transform group-hover:translate-x-1 group-hover:text-white" />
                      </Link>
                    </SheetClose>
                  ))}
                </nav>

                <div className="space-y-4 border-t border-border py-7">
                  <Button asChild size="lg" className="w-full">
                    <Link href="/#vehicle-selector">
                      <CarFront className="h-4 w-4" /> Match my vehicle
                    </Link>
                  </Button>
                  <div className="flex items-center justify-center gap-8 font-mono text-[10px] uppercase tracking-wider text-silver-muted">
                      <Link href="/account" className="min-h-11 py-3 hover:text-white">Account</Link>
                      <Link href="/cart" className="min-h-11 py-3 hover:text-white">Cart ({cartCount})</Link>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  );
}
