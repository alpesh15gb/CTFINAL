"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "./useReducedMotion";

export function useGsapScrollTrigger() {
  const reducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reducedMotion || !ref.current) return;

    let ctx: any;
    const init = async () => {
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {}, ref.current!);
    };

    init();

    return () => {
      if (ctx) ctx.revert();
    };
  }, [reducedMotion]);

  return ref;
}
