"use client"

import { useEffect, useRef } from "react"

// MOT-3 — uniform gray wordmark strip; scroll velocity drives its speed so
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
    <section aria-label="Capabilities" className="border-y hairline py-10">
      <p className="text-center text-[13px] text-muted">
        Trusted by enthusiasts across Telangana — one car at a time
      </p>
      <div className="mt-6 overflow-hidden" aria-hidden>
        <div ref={trackRef} className="flex w-max items-center gap-12 will-change-transform">
          {[0, 1].map((halfIdx) => (
            <div key={halfIdx} className="flex items-center gap-12">
              {ITEMS.map((item) => (
                <span key={item} className="flex items-center gap-12">
                  <span className="whitespace-nowrap text-lg font-medium tracking-tight text-white/30 md:text-2xl">
                    {item}
                  </span>
                  <span className="h-1 w-1 rounded-full bg-white/15" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
