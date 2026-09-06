"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (reducedMotion) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 1.5,
    });
    lenisRef.current = lenis;

    let rafId: number;
    let scrollTriggerSynced = false;

    // Pipe Lenis scroll events into GSAP ScrollTrigger so they stay in sync.
    // We dynamically import to avoid hard dependency on GSAP for pages that don't use it.
    async function syncScrollTrigger() {
      try {
        const { ScrollTrigger } = await import("gsap/ScrollTrigger");
        // Tell ScrollTrigger to listen to Lenis instead of native scroll
        lenis.on("scroll", ScrollTrigger.update);
        scrollTriggerSynced = true;
        ScrollTrigger.refresh();
      } catch {
        // GSAP not loaded — fine, Framer Motion sections still work via native scroll
      }
    }
    syncScrollTrigger();

    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      // Remove the Lenis→ScrollTrigger listener before destroying Lenis
      if (scrollTriggerSynced) {
        import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
          lenis.off("scroll", ScrollTrigger.update);
        }).catch(() => {});
      }
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [reducedMotion]);

  // New routes must open at the top. Next's native scrollTo on navigation
  // loses to Lenis's rAF loop (Lenis snaps back to its stored offset), so
  // product pages opened mid-shop-grid landed at the footer. Reset through
  // Lenis itself. Hash-only navigations don't change pathname, so in-page
  // anchors are unaffected.
  useEffect(() => {
    if (reducedMotion || !lenisRef.current) {
      window.scrollTo(0, 0);
      return;
    }
    lenisRef.current.scrollTo(0, { immediate: true });
  }, [pathname, reducedMotion]);

  return <>{children}</>;
}
