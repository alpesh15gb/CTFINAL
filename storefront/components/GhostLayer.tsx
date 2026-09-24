"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import { damping, MOTION } from "@/lib/motion"

// REF-1 MOT-1 — each section's key content echoed giant + dimmed behind the
// page card; crossfades as sections pass the viewport centre.
const GHOSTS: { key: string; node: React.ReactNode }[] = [
  {
    key: "hero",
    node: (
      <span className="whitespace-nowrap text-[16vw] font-semibold tracking-[-0.04em]">
        Built around you.
      </span>
    ),
  },
  {
    key: "bento",
    node: (
      <span className="whitespace-nowrap text-[10vw] font-semibold tracking-[-0.03em]">
        Everything missing.
      </span>
    ),
  },
  {
    key: "capabilities",
    node: (
      <span className="whitespace-nowrap text-[10vw] font-semibold tracking-[-0.03em]">
        Our works.
      </span>
    ),
  },
  {
    key: "cta",
    node: (
      <span className="whitespace-nowrap text-[12vw] font-semibold tracking-[-0.03em]">
        Transform your ride.
      </span>
    ),
  },
  {
    key: "footer",
    node: (
      <span className="whitespace-nowrap text-[9vw] font-semibold tracking-[-0.03em]">
        Rolling in style.
      </span>
    ),
  },
]

export default function GhostLayer() {
  const ghostRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const pathname = usePathname()

  useEffect(() => {
    const ghosts = ghostRefs.current
    const preference = window.matchMedia(MOTION.reduced)
    const originalStyles = GHOSTS.map(({ key }) => ({
      el: ghosts[key],
      opacity: ghosts[key]?.style.opacity ?? "",
      willChange: ghosts[key]?.style.willChange ?? "",
    }))
    const state = new Map(GHOSTS.map(({ key }) => [key, 0]))
    let sections: HTMLElement[] = []
    let centers: { key: string; center: number }[] = []
    let active: string | null = null
    let sectionsDirty = true
    let layoutDirty = true
    let selectionDirty = true
    let disposed = false
    let raf = 0
    let previousTime = 0

    const canRun = () => !disposed && !document.hidden && !preference.matches
    const schedule = () => {
      if (canRun() && !raf) raf = requestAnimationFrame(tick)
    }
    const invalidateLayout = () => {
      layoutDirty = true
      selectionDirty = true
      schedule()
    }
    const resize = new ResizeObserver(invalidateLayout)
    const collect = () => {
      sections = Array.from(document.querySelectorAll<HTMLElement>("[data-ghost]"))
        .filter((section) => state.has(section.dataset.ghost ?? ""))
      resize.disconnect()
      // The body catches upstream layout shifts, while individual sections
      // catch internal reflows that leave the total page height unchanged.
      resize.observe(document.body)
      sections.forEach((section) => resize.observe(section))
      sectionsDirty = false
      layoutDirty = true
    }
    const measure = () => {
      const scrollY = window.scrollY
      centers = sections.filter((section) => section.isConnected).map((section) => {
        const rect = section.getBoundingClientRect()
        return { key: section.dataset.ghost!, center: rect.top + scrollY + rect.height / 2 }
      })
      layoutDirty = false
      selectionDirty = true
    }
    function tick(time: number) {
      raf = 0
      if (!canRun()) return
      if (sectionsDirty) collect()
      if (layoutDirty) measure()
      if (selectionDirty) {
        const viewportCenter = window.scrollY + window.innerHeight / 2
        let best = Infinity
        active = null
        for (const section of centers) {
          const distance = Math.abs(section.center - viewportCenter)
          if (distance < best) {
            best = distance
            active = section.key
          }
        }
        selectionDirty = false
      }

      // MOT-1: cache geometry on invalidation, animate opacity only while a
      // crossfade is unsettled. There is no permanent full-DOM measuring loop.
      const elapsed = previousTime ? Math.min((time - previousTime) / 1000, 0.05) : 1 / 60
      let fading = false
      for (const [key, current] of state) {
        const target = key === active ? 0.12 : 0
        if (current === target) continue
        const value = current + (target - current) * damping(5, elapsed)
        const settled = Math.abs(target - value) < 0.0005
        const next = settled ? target : value
        state.set(key, next)
        const el = ghosts[key]
        if (el) {
          const opacity = next.toFixed(4)
          if (el.style.opacity !== opacity) el.style.opacity = opacity
          el.style.willChange = settled ? "auto" : "opacity"
        }
        if (!settled) fading = true
      }
      previousTime = fading ? time : 0
      if (fading) schedule()
    }
    const onScroll = () => {
      selectionDirty = true
      schedule()
    }
    const pause = () => {
      cancelAnimationFrame(raf)
      raf = 0
      previousTime = 0
    }
    const reset = () => {
      active = null
      for (const [key] of state) {
        state.set(key, 0)
        const el = ghosts[key]
        if (el) {
          el.style.opacity = "0"
          el.style.willChange = "auto"
        }
      }
    }
    const onPreference = () => {
      pause()
      reset()
      invalidateLayout()
    }
    const onVisibility = () => {
      if (document.hidden) pause()
      else invalidateLayout()
    }
    const onImage = (event: Event) => {
      if (event.target instanceof HTMLImageElement) invalidateLayout()
    }
    const containsSection = (node: Node) => node instanceof Element && (
      node.matches("[data-ghost]") || Boolean(node.querySelector("[data-ghost]"))
    )
    const mutation = new MutationObserver((records) => {
      // Route content may stream in after usePathname changes. Only section
      // topology needs discovery: ResizeObserver handles content reflow. In
      // particular, the hero's per-frame HUD text must not trigger measurement.
      const changed = records.some((record) => record.type === "attributes" ||
        Array.from(record.addedNodes).some(containsSection) ||
        Array.from(record.removedNodes).some(containsSection))
      if (!changed) return
      sectionsDirty = true
      invalidateLayout()
    })
    mutation.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["data-ghost"],
    })
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", invalidateLayout, { passive: true })
    document.addEventListener("load", onImage, true)
    document.addEventListener("error", onImage, true)
    document.addEventListener("visibilitychange", onVisibility)
    document.fonts.addEventListener("loadingdone", invalidateLayout)
    preference.addEventListener("change", onPreference)
    reset()
    schedule()

    return () => {
      disposed = true
      pause()
      resize.disconnect()
      mutation.disconnect()
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", invalidateLayout)
      document.removeEventListener("load", onImage, true)
      document.removeEventListener("error", onImage, true)
      document.removeEventListener("visibilitychange", onVisibility)
      document.fonts.removeEventListener("loadingdone", invalidateLayout)
      preference.removeEventListener("change", onPreference)
      originalStyles.forEach(({ el, opacity, willChange }) => {
        if (el) {
          el.style.opacity = opacity
          el.style.willChange = willChange
        }
      })
    }
  }, [pathname])

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden">
      {GHOSTS.map((g) => (
        <div
          key={g.key}
          ref={(el) => {
            ghostRefs.current[g.key] = el
          }}
          className="absolute inset-0 flex items-center justify-center text-white opacity-0 will-change-[opacity]"
        >
          {g.node}
        </div>
      ))}
    </div>
  )
}
