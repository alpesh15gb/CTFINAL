"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Search, User, ShoppingBag, Heart, Menu, X, ArrowRight, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { CartSheet } from "@/components/cart/CartSheet";

const navLinks = [
  { label: "Shop", href: "/shop" },
  { label: "Accessories", href: "/shop" },
  { label: "Builds", href: "/builds" },
  { label: "About", href: "/about" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollY } = useScroll();
  const pathname = usePathname();
  const { totalItems } = useCart();
  const { count: wishlistCount } = useWishlist();
  const cartCount = totalItems();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 40);
  });

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 1.6 }}
      className={cn(
        "fixed left-0 right-0 top-0 z-50 transition-colors duration-300",
        scrolled ? "border-b border-white/[0.06] bg-[rgba(5,6,7,0.8)] backdrop-blur-md backdrop-saturate-[1.2]" : "bg-transparent"
      )}
    >
      <div className="mx-auto flex h-20 max-w-[1600px] items-center justify-between px-4 md:px-8">
        <Link href="/" className="relative z-10 flex items-center gap-3" aria-label="Cartunez home">
          <Image src="/logo/cartunez-logo.png" alt="Cartunez" width={140} height={48} className="h-10 w-auto object-contain md:h-12" priority />
        </Link>

        <nav className="hidden items-center gap-10 md:flex" aria-label="Main navigation">
          {navLinks.map((link) => (
            <Link key={link.label} href={link.href} className={cn("group relative text-sm font-medium uppercase tracking-widest transition-colors", isActive(link.href) ? "text-cyan" : "text-silver hover:text-foreground")}>
              {link.label}
              <span className={cn("absolute -bottom-1 left-0 h-px bg-cyan transition-all duration-300", isActive(link.href) ? "w-full" : "w-0 group-hover:w-full")} />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1 md:gap-3">
          <Link href="/shop" className="hidden items-center gap-2 rounded-md px-3 py-2 text-sm font-medium uppercase tracking-wider text-silver transition-colors hover:bg-surface hover:text-foreground lg:inline-flex" aria-label="Search"><Search className="h-4 w-4" /></Link>

          <Link href="/wishlist" className="relative hidden items-center gap-2 rounded-md px-3 py-2 text-sm font-medium uppercase tracking-wider text-silver transition-colors hover:bg-surface hover:text-foreground md:inline-flex" aria-label="Wishlist">
            <Heart className="h-4 w-4" />
            {wishlistCount > 0 && <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red px-1 text-[10px] font-bold text-white">{wishlistCount}</span>}
          </Link>

          <Link href="/account" className="hidden items-center gap-2 rounded-md px-3 py-2 text-sm font-medium uppercase tracking-wider text-silver transition-colors hover:bg-surface hover:text-foreground md:inline-flex" aria-label="Account"><User className="h-4 w-4" /></Link>

          <CartSheet>
            <button type="button" className="relative flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium uppercase tracking-wider text-silver transition-colors hover:bg-surface hover:text-foreground" aria-label="Cart">
              <ShoppingBag className="h-4 w-4" />
              {cartCount > 0 && <span className="absolute -top-0.5 right-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-cyan px-1 text-[10px] font-bold text-black">{cartCount}</span>}
            </button>
          </CartSheet>

          <Button asChild className="hidden bg-cyan text-black hover:bg-cyan-light md:inline-flex">
            <Link href="/#vehicle-selector" className="gap-2"><Wrench className="h-4 w-4" /><span className="uppercase tracking-wider">Find Parts For Your Car</span></Link>
          </Button>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" aria-label="Open menu" className="text-foreground hover:bg-surface"><Menu className="h-6 w-6" /></Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full border-border/50 bg-raised/95 backdrop-blur-xl sm:max-w-md">
              <div className="flex h-full flex-col">
                <div className="flex items-center justify-between py-6">
                  <Image src="/logo/cartunez-logo.png" alt="Cartunez" width={140} height={48} className="h-10 w-auto object-contain" />
                  <SheetClose asChild><Button variant="ghost" size="icon" aria-label="Close menu" className="text-foreground hover:bg-surface"><X className="h-6 w-6" /></Button></SheetClose>
                </div>

                <nav className="flex flex-1 flex-col justify-center gap-2" aria-label="Mobile navigation">
                  {navLinks.map((link, index) => (
                    <SheetClose key={link.label} asChild>
                      <Link href={link.href} className="group flex items-center justify-between border-b border-border/50 py-5 font-display text-3xl uppercase tracking-tight text-foreground transition-colors hover:text-cyan">
                        <span className="font-sans text-sm font-medium tracking-widest text-silver-muted">{String(index + 1).padStart(2, "0")}</span>
                        {link.label}
                        <ArrowRight className="h-5 w-5 -translate-x-2 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                      </Link>
                    </SheetClose>
                  ))}
                </nav>

                <div className="space-y-4 pb-8">
                  <Button asChild className="w-full bg-cyan text-black hover:bg-cyan-light"><Link href="/#vehicle-selector" className="gap-2"><Wrench className="h-4 w-4" /> Find Parts For Your Car</Link></Button>
                  <div className="flex flex-wrap items-center justify-center gap-5 text-silver">
                    <SheetClose asChild><Link href="/account" className="flex items-center gap-2 text-sm uppercase tracking-wider hover:text-foreground"><User className="h-4 w-4" /> Account</Link></SheetClose>
                    <SheetClose asChild><Link href="/wishlist" className="flex items-center gap-2 text-sm uppercase tracking-wider hover:text-foreground"><Heart className="h-4 w-4" /> Wishlist ({wishlistCount})</Link></SheetClose>
                    <SheetClose asChild><Link href="/cart" className="flex items-center gap-2 text-sm uppercase tracking-wider hover:text-foreground"><ShoppingBag className="h-4 w-4" /> Cart ({cartCount})</Link></SheetClose>
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
