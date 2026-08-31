"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "./useReducedMotion";

export function useGsapScrollTrigger() {
  const reducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reducedMotion || !ref.current) return;

    let ctx: ReturnType<typeof Object> | null = null;

    const init = async () => {
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      // gsap.context scopes all tweens/ScrollTriggers created inside it
      // to this ref element, so ctx.revert() only kills THIS component's triggers.
      ctx = gsap.context(() => {}, ref.current!);
    };

    init();

    return () => {
      if (ctx) ctx.revert();
    };
  }, [reducedMotion]);

  return ref;
}
