"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

// MOT-2: clip-path reveal + 40px rise, triggered at top 75%
export default function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const el = ref.current
    if (!el) return

    gsap.fromTo(
      el,
      { clipPath: "inset(100% 0% 0% 0%)", y: 40 },
      {
        clipPath: "inset(0% 0% 0% 0%)",
        y: 0,
        duration: 1.1,
        ease: "power3.out",
        delay,
        scrollTrigger: { trigger: el, start: "top 75%" },
      }
    )
  }, [delay])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
