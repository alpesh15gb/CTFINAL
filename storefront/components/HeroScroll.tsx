"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { gsap } from "gsap"

const FRAME_COUNT = 14
const FRAME_SRCS = Array.from(
  { length: FRAME_COUNT },
  (_, i) => `/sequences/hero/frame-${String(i + 1).padStart(2, "0")}.webp`
)

// MOT-1 overlay windows (% of pinned progress) — DESIGN_SYSTEM.md
const OVERLAYS = {
  eyebrow: { start: 0.0, end: 0.12 },
  style: { start: 0.18, end: 0.34 },
  sound: { start: 0.4, end: 0.56 },
  performance: { start: 0.62, end: 0.78 },
  cta: { start: 0.86, end: 1.0 },
} as const

const FADE = 0.045 // fade length as fraction of pinned progress

// opacity + rise for a window; mirrored enter/exit
// holdEnd: terminal window stays fully visible to the end of the pin
function windowPose(progress: number, start: number, end: number, holdEnd = false) {
  const fadeIn = gsap.utils.clamp(0, 1, (progress - start) / FADE)
  const fadeOut = holdEnd ? 1 : gsap.utils.clamp(0, 1, (end - progress) / FADE)
  const opacity = Math.min(fadeIn, fadeOut)
  const enter = 1 - fadeIn
  const exit = 1 - fadeOut
  const y = enter * 60 - exit * 60
  return { opacity, y }
}

const smooth = (t: number) => t * t * (3 - 2 * t)

export default function HeroScroll() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const overlayRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const [ready, setReady] = useState(false)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    setReduced(isReduced)

    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const images: (HTMLImageElement | null)[] = FRAME_SRCS.map(() => null)
    let firstPainted = false

    const sizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = canvas.clientWidth * dpr
      canvas.height = canvas.clientHeight * dpr
    }
    sizeCanvas()

    const drawCover = (img: HTMLImageElement, alpha: number) => {
      if (alpha <= 0 || !img.complete || img.naturalWidth === 0) return
      const cw = canvas.width
      const ch = canvas.height
      const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight)
      const w = img.naturalWidth * scale
      const h = img.naturalHeight * scale
      ctx.globalAlpha = alpha
      ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h)
      ctx.globalAlpha = 1
    }

    // REQ-HERO-1: frame index = progress x (N-1), eased crossfade between neighbours
    const render = (progress: number) => {
      ctx.fillStyle = "#0a0a0b"
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      const pos = progress * (FRAME_COUNT - 1)
      const i = Math.min(Math.floor(pos), FRAME_COUNT - 1)
      const frac = smooth(pos - i)
      const current = images[i]
      const next = images[i + 1]
      if (current) drawCover(current, 1)
      if (next && frac > 0) drawCover(next, frac)

      for (const [key, win] of Object.entries(OVERLAYS)) {
        const el = overlayRefs.current[key]
        if (!el) continue
        const { opacity, y } = windowPose(progress, win.start, win.end, win.end >= 1)
        el.style.opacity = String(opacity)
        el.style.transform = `translate3d(0, ${y}px, 0)`
      }
    }

    const loadFrame = (idx: number) =>
      new Promise<void>((resolve) => {
        const img = new Image()
        img.src = FRAME_SRCS[idx]
        img.onload = () => {
          images[idx] = img
          if (!firstPainted) {
            firstPainted = true
            render(0)
            setReady(true)
          }
          resolve()
        }
        img.onerror = () => resolve()
      })

    // REQ-HERO-3: first frame paints immediately, rest stream in behind it
    loadFrame(0).then(() => {
      for (let i = 1; i < FRAME_COUNT; i++) loadFrame(i)
    })

    if (isReduced) return

    // Live measurement (not cached ScrollTrigger px) so progress stays
    // correct even if the viewport resizes mid-session.
    let raf = 0
    let lastProgress = -1
    const tick = () => {
      const rect = wrap.getBoundingClientRect()
      const scrollable = rect.height - window.innerHeight
      const progress = gsap.utils.clamp(0, 1, -rect.top / Math.max(scrollable, 1))
      if (progress !== lastProgress) {
        lastProgress = progress
        render(progress)
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    const onResize = () => {
      sizeCanvas()
      lastProgress = -1
    }
    window.addEventListener("resize", onResize)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", onResize)
    }
  }, [])

  const setOverlayRef =
    (key: string) =>
    (el: HTMLDivElement | null): void => {
      overlayRefs.current[key] = el
    }

  // REQ-QUAL-4: reduced motion — static hero, all copy visible
  if (reduced) {
    return (
      <section className="relative flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
        <img
          src={FRAME_SRCS[0]}
          alt="Customised matte-black SUV in the Cartunez studio"
          className="absolute inset-0 h-full w-full object-cover opacity-60"
        />
        <div className="relative z-10 flex flex-col items-center gap-6">
          <p className="eyebrow">Automotive Customization · Hyderabad</p>
          <h1 className="display-xl">
            Style. <span className="text-signal">Sound.</span> Performance.
          </h1>
          <p className="eyebrow">Make it yours</p>
          <HeroCtas />
        </div>
      </section>
    )
  }

  return (
    <section ref={wrapRef} className="relative h-[600vh]" aria-label="Cartunez experience">
      <div className="sticky top-0 h-screen overflow-hidden">
        <canvas ref={canvasRef} className="h-full w-full" />

        {/* REQ-HERO-3: veil lifts once the first frame paints */}
        <div
          className={`pointer-events-none absolute inset-0 z-20 flex items-center justify-center bg-ink transition-opacity duration-700 ${
            ready ? "opacity-0" : "opacity-100"
          }`}
        >
          <span className="font-display text-sm font-600 tracking-[0.5em] uppercase text-muted">
            Cartunez
          </span>
        </div>

        <div className="pointer-events-none absolute inset-0 z-10">
          <div
            ref={setOverlayRef("eyebrow")}
            className="absolute inset-x-0 top-[18%] flex justify-center opacity-0"
          >
              <p className="eyebrow text-paper">
                Automotive Customization · Hyderabad
              </p>
          </div>

          {(
            [
              ["style", "Style."],
              ["sound", "Sound."],
              ["performance", "Performance."],
            ] as const
          ).map(([key, word]) => (
            <div
              key={key}
              ref={setOverlayRef(key)}
              className="absolute bottom-[14%] left-[6%] opacity-0 md:left-[8%]"
            >
              <h2 className="display-xl">{word}</h2>
            </div>
          ))}

          <div
            ref={setOverlayRef("cta")}
            className="absolute inset-x-0 bottom-[12%] flex flex-col items-center gap-8 opacity-0"
          >
            <h2 className="display-lg text-center">
              Make it <span className="text-signal">yours.</span>
            </h2>
            <div className="pointer-events-auto">
              <HeroCtas />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function HeroCtas() {
  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row">
      <Link
        href="/shop"
        className="eyebrow bg-signal px-8 py-4 text-paper transition-transform hover:scale-[1.03]"
      >
        Build Yours
      </Link>
      <a
        href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "919949695030"}`}
        target="_blank"
        rel="noreferrer"
        className="eyebrow border hairline px-8 py-4 text-paper transition-colors hover:border-signal hover:text-signal"
      >
        WhatsApp the Studio
      </a>
    </div>
  )
}
