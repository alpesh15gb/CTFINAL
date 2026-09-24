"use client"

import { useEffect, useRef } from "react"
import { damping, MOTION } from "@/lib/motion"

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
    const track = trackRef.current
    const viewport = track?.parentElement
    if (!track || !viewport) return

    const preference = window.matchMedia(MOTION.reduced)
    const originalTransform = track.style.transform
    const originalWillChange = track.style.willChange
    let repeat = 0
    let pos = 0
    let raf = 0
    let previousTime = 0
    let lastY = window.scrollY
    let lastScrollTime = performance.now()
    let velocity = 0
    let boost = 0
    let inView = false
    let needsMeasure = true
    let disposed = false

    const canRun = () => !disposed && inView && !document.hidden && !preference.matches && repeat > 0
    const paint = () => {
      track.style.transform = `translate3d(${(-pos).toFixed(2)}px, 0, 0)`
    }
    const stop = () => {
      cancelAnimationFrame(raf)
      raf = 0
      previousTime = 0
      velocity = 0
      boost = 0
      track.style.willChange = "auto"
    }
    const tick = (time: number) => {
      raf = 0
      if (!canRun()) return
      const elapsed = previousTime ? Math.min((time - previousTime) / 1000, 0.05) : 0
      previousTime = time
      const targetBoost = time - lastScrollTime < 100 ? Math.min(velocity * 0.12, 240) : 0
      boost += (targetBoost - boost) * damping(5, elapsed)
      // MOT-3: the old 0.6px/frame + capped 4px/frame, expressed at 60Hz
      // in pixels/second so 120Hz screens and tab resumes keep the same pace.
      pos = (pos + (36 + boost) * elapsed) % repeat
      paint()
      raf = requestAnimationFrame(tick)
    }
    const sync = () => {
      if (!canRun()) {
        stop()
        if (preference.matches) {
          pos = 0
          track.style.transform = originalTransform
        }
        return
      }
      if (!raf) {
        lastY = window.scrollY
        lastScrollTime = performance.now()
        track.style.willChange = "transform"
        raf = requestAnimationFrame(tick)
      }
    }
    const measure = () => {
      if (document.hidden) {
        needsMeasure = true
        return
      }
      const first = track.children[0] as HTMLElement | undefined
      const second = track.children[1] as HTMLElement | undefined
      // Offset between matching starts includes the track's inter-half gap.
      // Reading scrollWidth / 2 loses half that gap and jumps at every seam.
      repeat = first && second ? second.offsetLeft - first.offsetLeft : 0
      needsMeasure = false
      pos = repeat > 0 ? pos % repeat : 0
      if (!preference.matches) paint()
      sync()
    }
    const onScroll = () => {
      if (!canRun()) return
      const time = performance.now()
      const y = window.scrollY
      const elapsed = Math.max(16, time - lastScrollTime) / 1000
      velocity = Math.min(Math.abs(y - lastY) / elapsed, 2000)
      lastY = y
      lastScrollTime = time
    }
    const onVisibility = () => {
      if (!document.hidden && needsMeasure) measure()
      sync()
    }
    const onPreference = () => {
      // A live preference change resets both drift and accumulated velocity.
      stop()
      sync()
    }

    const resize = new ResizeObserver(measure)
    resize.observe(track)
    for (const child of Array.from(track.children)) resize.observe(child)
    const intersection = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting
      sync()
    })
    intersection.observe(viewport)
    window.addEventListener("scroll", onScroll, { passive: true })
    document.addEventListener("visibilitychange", onVisibility)
    preference.addEventListener("change", onPreference)
    measure()

    return () => {
      disposed = true
      stop()
      resize.disconnect()
      intersection.disconnect()
      window.removeEventListener("scroll", onScroll)
      document.removeEventListener("visibilitychange", onVisibility)
      preference.removeEventListener("change", onPreference)
      track.style.transform = originalTransform
      track.style.willChange = originalWillChange
    }
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
