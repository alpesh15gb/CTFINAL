"use client"

import { useEffect, useRef, useState } from "react"

// MOT-7 — "Studio Light": the cursor is the studio lamp. A masked
// full-brightness layer of the same frame reveals the car out of darkness;
// TintSwatches re-colors the light via the `hero-tint` event. Touch users
// and idle desktops get an auto light-sweep.
export default function HeroLight() {
  const rootRef = useRef<HTMLDivElement>(null)
  const tiltRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)
  const lightImgRef = useRef<HTMLImageElement>(null)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setReduced(true)
      return
    }

    const root = rootRef.current
    if (!root) return

    let raf = 0
    let x = 0.5 // light position, fractions of the scene box
    let y = 0.42
    let tx = 0.5
    let ty = 0.42
    let lastMove = 0
    let hasMouse = false

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return
      const rect = root.getBoundingClientRect()
      tx = (e.clientX - rect.left) / rect.width
      ty = (e.clientY - rect.top) / rect.height
      tx = Math.min(Math.max(tx, -0.15), 1.15)
      ty = Math.min(Math.max(ty, -0.15), 1.15)
      lastMove = performance.now()
      hasMouse = true
    }
    window.addEventListener("pointermove", onMove, { passive: true })

    const onTint = (e: Event) => {
      const { color, filter } = (e as CustomEvent<{ color: string; filter: string }>).detail
      root.style.setProperty("--tint", color)
      if (lightImgRef.current) {
        lightImgRef.current.style.filter = `brightness(1.05) ${filter}`
      }
    }
    window.addEventListener("hero-tint", onTint)

    const tick = (now: number) => {
      // auto-sweep when idle or no mouse yet (covers touch devices)
      if (!hasMouse || now - lastMove > 3500) {
        const t = now * 0.00042
        tx = 0.5 + Math.sin(t) * 0.3
        ty = 0.42 + Math.cos(t * 0.63) * 0.2
      }
      x += (tx - x) * 0.07
      y += (ty - y) * 0.07
      root.style.setProperty("--lx", `${(x * 100).toFixed(2)}%`)
      root.style.setProperty("--ly", `${(y * 100).toFixed(2)}%`)
      if (tiltRef.current) {
        const ry = (x - 0.5) * 7
        const rx = -(y - 0.5) * 4
        tiltRef.current.style.transform = `rotateY(${ry.toFixed(2)}deg) rotateX(${rx.toFixed(2)}deg)`
      }
      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${(x * 100).toFixed(2)}%, ${(y * 100).toFixed(2)}%, 0) translate(-50%, -50%)`
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("hero-tint", onTint)
    }
  }, [])

  if (reduced) {
    return (
      <div aria-hidden className="absolute inset-0 overflow-hidden">
        <img
          src="/sequences/hero/frame-01.webp"
          alt=""
          className="h-full w-full object-cover [filter:brightness(0.6)]"
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(6,6,7,0.6),transparent_70%)]" />
      </div>
    )
  }

  return (
    <div
      ref={rootRef}
      aria-hidden
      className="absolute inset-0 overflow-hidden [--tint:#e10600]"
      style={{ perspective: "1200px" }}
    >
      <div ref={tiltRef} className="absolute inset-[-7%] will-change-transform">
        {/* base: the car barely there in the dark */}
        <img
          src="/sequences/hero/frame-01.webp"
          alt=""
          className="h-full w-full object-cover [filter:brightness(0.28)_saturate(0.75)]"
        />
        {/* light layer: same frame, full brightness, masked to the lamp cone */}
        <div
          className="absolute inset-0"
          style={{
            WebkitMaskImage:
              "radial-gradient(circle 380px at var(--lx, 50%) var(--ly, 42%), black 0%, rgba(0,0,0,0.45) 45%, transparent 72%)",
            maskImage:
              "radial-gradient(circle 380px at var(--lx, 50%) var(--ly, 42%), black 0%, rgba(0,0,0,0.45) 45%, transparent 72%)",
          }}
        >
          <img
            ref={lightImgRef}
            src="/sequences/hero/frame-01.webp"
            alt=""
            className="h-full w-full object-cover [filter:brightness(1.05)_saturate(1.2)]"
          />
        </div>
        {/* lamp bloom */}
        <div
          ref={glowRef}
          className="absolute left-0 top-0 h-80 w-80 rounded-full opacity-30 blur-3xl will-change-transform"
          style={{
            background:
              "radial-gradient(closest-side, var(--tint), transparent 70%)",
          }}
        />
      </div>

      {/* legibility + seamless hand-off into the panel below */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(6,6,7,0.62),rgba(6,6,7,0.15)_55%,transparent_75%)]" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-ink" />
    </div>
  )
}
