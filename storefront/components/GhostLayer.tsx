"use client"

import { useEffect, useRef } from "react"

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
        Capabilities.
      </span>
    ),
  },
  {
    key: "packages",
    node: <span className="text-[44vw] font-semibold leading-none tracking-[-0.05em]">₹</span>,
  },
  {
    key: "builds",
    node: (
      <span className="flex gap-[4vw]">
        <i className="block h-[52vh] w-[24vw] rounded-[2.5vw] bg-white/4" />
        <i className="block h-[52vh] w-[24vw] rounded-[2.5vw] bg-white/4" />
        <i className="block h-[52vh] w-[24vw] rounded-[2.5vw] bg-white/4" />
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

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const ghosts = ghostRefs.current
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-ghost]"))
    if (sections.length === 0) return

    let raf = 0
    const state = new Map<string, number>()
    for (const g of GHOSTS) state.set(g.key, 0)

    const tick = () => {
      const center = window.innerHeight / 2
      let active: string | null = null
      let best = Infinity
      for (const s of sections) {
        const key = s.dataset.ghost
        if (!key) continue
        const rect = s.getBoundingClientRect()
        const d = Math.abs(rect.top + rect.height / 2 - center)
        if (d < best) {
          best = d
          active = key
        }
      }
      for (const [key, cur] of state) {
        const target = key === active ? 0.12 : 0
        const next = cur + (target - cur) * 0.08
        state.set(key, next)
        const el = ghosts[key]
        if (el) el.style.opacity = next < 0.005 ? "0" : next.toFixed(3)
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

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
