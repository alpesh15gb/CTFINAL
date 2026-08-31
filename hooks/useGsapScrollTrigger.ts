"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "./useReducedMotion";

type GsapSetupFn = (gsap: typeof import("gsap").default, ScrollTrigger: typeof import("gsap/ScrollTrigger").ScrollTrigger) => void;

export function useGsapScrollTrigger(setup: GsapSetupFn) {
  const reducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const setupRef = useRef(setup);
  setupRef.current = setup;

  useEffect(() => {
    if (reducedMotion || !ref.current) return;

    let ctx: gsap.Context | null = null;

    const init = async () => {
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        setupRef.current(gsap, ScrollTrigger);
      }, ref.current!);
    };

    init();

    return () => {
      if (ctx) ctx.revert();
    };
  }, [reducedMotion]);

  return ref;
}
