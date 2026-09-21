"use client"

import { useEffect, useRef } from "react"

// MOT-6 — infinite capability marquee; scroll velocity drives its speed so
// it surges as you scroll and settles when you stop.
const ITEMS = [
  "Stage 1–3 ECU Tunes",
  "Air Ride",
  "Wrap & PPF",
  "Component Audio",
  "Ambient Lighting",
  "Alloy Upgrades",
  "Interior Retrim",
]

export default function Marquee() {
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const track = trackRef.current
    if (!track) return

    let pos = 0
    let raf = 0
    let lastY = window.scrollY
    let velocity = 0

    const tick = () => {
      const half = track.scrollWidth / 2
      if (half > 0) {
        velocity += (Math.abs(window.scrollY - lastY) - velocity) * 0.08
        lastY = window.scrollY
        pos -= 0.6 + Math.min(velocity * 0.12, 4)
        if (pos <= -half) pos += half
        track.style.transform = `translate3d(${pos.toFixed(2)}px, 0, 0)`
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <section aria-hidden className="overflow-hidden border-y hairline py-7">
      <div ref={trackRef} className="flex w-max items-center gap-10 will-change-transform">
        {[0, 1].map((halfIdx) => (
          <div key={halfIdx} className="flex items-center gap-10">
            {ITEMS.map((item, i) => (
              <span key={i} className="flex items-center gap-10">
                <span
                  className={`whitespace-nowrap font-display text-2xl font-800 uppercase tracking-wide md:text-4xl ${
                    i % 2 === 0 ? "text-paper/90" : "text-outline"
                  }`}
                >
                  {item}
                </span>
                <span className="h-1.5 w-1.5 rotate-45 bg-signal" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}
