"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "./useReducedMotion";

interface UsePinnedSectionOptions {
  pin?: boolean;
  scrub?: boolean | number;
  start?: string;
  end?: string;
  onEnter?: () => void;
  onLeave?: () => void;
}

export function usePinnedSection(options: UsePinnedSectionOptions = {}) {
  const {
    pin = true,
    scrub = true,
    start = "top top",
    end = "bottom bottom",
  } = options;

  const reducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<any>(null);

  useEffect(() => {
    if (reducedMotion || !sectionRef.current) return;

    let ctx: any;
    let tl: any;

    const init = async () => {
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current!,
            start,
            end,
            pin,
            scrub: scrub === true ? 0.5 : scrub,
            anticipatePin: 1,
          },
        });
        timelineRef.current = tl;
      }, sectionRef.current!);
    };

    init();

    return () => {
      if (ctx) ctx.revert();
    };
  }, [reducedMotion, pin, scrub, start, end]);

  return { sectionRef, timelineRef, reducedMotion };
}
