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
const WINDOWS = {
  eyebrow: { start: 0.0, end: 0.12 },
  style: { start: 0.18, end: 0.34 },
  sound: { start: 0.4, end: 0.56 },
  performance: { start: 0.62, end: 0.78 },
  cta: { start: 0.86, end: 1.0 },
} as const

const FADE = 0.045 // fade length as fraction of pinned progress
const CHAR_ENTER = 0.055 // progress span for one character to settle

// Hero words render as per-character masked cascades
const WORDS: Record<string, { chars: string[]; win: { start: number; end: number } }> = {
  style: { chars: [..."Style."], win: WINDOWS.style },
  sound: { chars: [..."Sound."], win: WINDOWS.sound },
  performance: { chars: [..."Performance."], win: WINDOWS.performance },
}

// CTA headline renders as per-word cascade (3 tokens + delayed buttons)
const CTA_TOKENS = ["Make", "it", "yours."]

const clamp01 = (t: number) => gsap.utils.clamp(0, 1, t)
const smooth = (t: number) => t * t * (3 - 2 * t)

// opacity + rise for a plain-fade window; holdEnd keeps terminal window visible
function windowPose(progress: number, start: number, end: number, holdEnd = false) {
  const fadeIn = clamp01((progress - start) / FADE)
  const fadeOut = holdEnd ? 1 : clamp01((end - progress) / FADE)
  const opacity = Math.min(fadeIn, fadeOut)
  const y = (1 - fadeIn) * 60 - (1 - fadeOut) * 60
  return { opacity, y }
}

export default function HeroScroll() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const skewRef = useRef<HTMLDivElement>(null)
  const refs = useRef<Record<string, HTMLElement | null>>({})
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

    // zoom>1 pushes the cover crop in; camera drifts forward through each cut
    const drawCover = (img: HTMLImageElement, alpha: number, zoom: number) => {
      if (alpha <= 0 || !img.complete || img.naturalWidth === 0) return
      const cw = canvas.width
      const ch = canvas.height
      const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight) * zoom
      const w = img.naturalWidth * scale
      const h = img.naturalHeight * scale
      ctx.globalAlpha = alpha
      ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h)
      ctx.globalAlpha = 1
    }

    const set = (key: string, style: Partial<CSSStyleDeclaration>) => {
      const el = refs.current[key]
      if (el) Object.assign(el.style, style)
    }

    // slow dolly + vertical drift on the pinned canvas
    const cameraPose = (progress: number) => {
      const dolly = 1 + 0.07 * progress
      return `scale(${dolly.toFixed(4)}) translate3d(0, ${(progress * -1.2).toFixed(2)}%, 0)`
    }

    // REQ-HERO-1: frame index = progress x (N-1); each cut pushes the outgoing
    // frame in while the incoming one settles back — a forward camera move
    const render = (progress: number) => {
      ctx.fillStyle = "#0a0a0b"
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      const pos = progress * (FRAME_COUNT - 1)
      const i = Math.min(Math.floor(pos), FRAME_COUNT - 1)
      const frac = smooth(pos - i)
      const current = images[i]
      const next = images[i + 1]
      if (current) drawCover(current, 1, 1 + 0.035 * frac)
      if (next && frac > 0) drawCover(next, frac, 1 + 0.035 * (frac - 1))

      canvas.style.transform = cameraPose(progress)

      // eyebrow: fade/rise + rule line drawing in
      const eb = windowPose(progress, WINDOWS.eyebrow.start, WINDOWS.eyebrow.end)
      set("eyebrow", { opacity: String(eb.opacity), transform: `translate3d(0, ${eb.y.toFixed(1)}px, 0)` })
      set("eyebrow-line", { transform: `scaleX(${smooth(clamp01(progress / 0.1)).toFixed(3)})` })

      // hero words: line exits upward as one block, characters cascade in
      for (const [key, cfg] of Object.entries(WORDS)) {
        const fadeOut = clamp01((cfg.win.end - progress) / FADE)
        set(key, {
          opacity: fadeOut.toFixed(3),
          transform: `translate3d(0, ${(-(1 - fadeOut) * 60).toFixed(1)}px, 0)`,
        })
        // compress stagger for long words so the cascade finishes before exit
        const available = cfg.win.end - FADE - cfg.win.start
        const stagger = Math.min(
          0.014,
          Math.max((available - CHAR_ENTER) / Math.max(cfg.chars.length - 1, 1), 0)
        )
        cfg.chars.forEach((_, ci) => {
          const t = smooth(clamp01((progress - (cfg.win.start + ci * stagger)) / CHAR_ENTER))
          set(`${key}-${ci}`, {
            opacity: t.toFixed(3),
            transform: `translate3d(0, ${((1 - t) * 1.15).toFixed(3)}em, 0) rotate(${((1 - t) * 6).toFixed(2)}deg)`,
          })
        })
      }

      // CTA: per-word cascade, buttons trail the headline
      set("cta", { opacity: "1" })
      CTA_TOKENS.forEach((token, ti) => {
        const t = smooth(clamp01((progress - (WINDOWS.cta.start + ti * 0.028)) / CHAR_ENTER))
        set(`cta-${ti}`, {
          opacity: t.toFixed(3),
          transform: `translate3d(0, ${((1 - t) * 1.15).toFixed(3)}em, 0)`,
        })
      })
      const bt = smooth(clamp01((progress - 0.93) / 0.06))
      set("cta-buttons", {
        opacity: bt.toFixed(3),
        transform: `translate3d(0, ${((1 - bt) * 30).toFixed(1)}px, 0)`,
      })

      // scroll cue fades as soon as the sequence starts moving
      set("cue", { opacity: (1 - clamp01(progress / 0.045)).toFixed(3) })

      // HUD: current frame readout + scrub bar
      const counter = refs.current["frame-counter"]
      if (counter) counter.textContent = `${String(Math.round(pos) + 1).padStart(2, "0")} / ${FRAME_COUNT}`
      set("scrub-fill", { transform: `scaleY(${progress.toFixed(4)})` })
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
    let lastProgress = 0
    let velocity = 0
    const tick = () => {
      const rect = wrap.getBoundingClientRect()
      const scrollable = rect.height - window.innerHeight
      const progress = gsap.utils.clamp(0, 1, -rect.top / Math.max(scrollable, 1))
      const dp = progress - lastProgress
      lastProgress = progress
      // velocity-reactive skew, eased toward target so it decays when idle
      velocity += (gsap.utils.clamp(-4, 4, dp * 260) - velocity) * 0.09
      if (Math.abs(velocity) < 0.002) velocity = 0
      if (skewRef.current) {
        skewRef.current.style.transform = `skewY(${velocity.toFixed(3)}deg)`
      }
      if (dp !== 0) render(progress)
      raf = requestAnimationFrame(tick)
    }
    render(0)
    raf = requestAnimationFrame(tick)

    const onResize = () => {
      sizeCanvas()
      render(lastProgress)
    }
    window.addEventListener("resize", onResize)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", onResize)
    }
  }, [])

  const setRef = (key: string) => (el: HTMLElement | null): void => {
    refs.current[key] = el
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
            Style. <span className="text-volt">Sound.</span> Performance.
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
        {/* oversized + inset so velocity skew never exposes an edge */}
        <div ref={skewRef} className="absolute inset-[-8%] will-change-transform">
          <canvas
            ref={canvasRef}
            className="h-full w-full will-change-transform [filter:saturate(1.1)_contrast(1.05)_brightness(0.98)]"
          />
        </div>

        {/* vignette + seamless hand-off into the next section */}
        <div className="pointer-events-none absolute inset-0 z-[5] bg-[radial-gradient(ellipse_at_center,transparent_52%,rgba(10,10,11,0.55)_100%)]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-28 bg-gradient-to-b from-transparent to-ink" />

        {/* REQ-HERO-3: veil lifts once the first frame paints */}
        <div
          className={`pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center gap-5 bg-ink transition-opacity duration-700 ${
            ready ? "opacity-0" : "opacity-100"
          }`}
        >
          <img
            src="/images/cartunez-logo.png"
            alt=""
            className="h-24 w-24 [mix-blend-mode:screen] motion-safe:animate-[veil-pulse_1.6s_ease-in-out_infinite]"
          />
          <span className="eyebrow">Get your car rolling in style.</span>
        </div>

        <div className="pointer-events-none absolute inset-0 z-10">
          <div
            ref={setRef("eyebrow")}
            className="absolute inset-x-0 top-[16%] flex flex-col items-center gap-4 opacity-0"
          >
            <span
              ref={setRef("eyebrow-line")}
              className="h-px w-12 origin-center scale-x-0 bg-signal"
            />
            <p className="eyebrow text-paper">Automotive Customization · Hyderabad</p>
          </div>

          {(Object.entries(WORDS) as [string, { chars: string[] }][]).map(
            ([key, cfg]) => (
              <div
                key={key}
                ref={setRef(key)}
                className="absolute bottom-[14%] left-[6%] opacity-0 md:left-[8%]"
              >
                <h2 className="display-xl overflow-hidden pb-[0.06em]">
                  {cfg.chars.map((ch, ci) => (
                    <span
                      key={ci}
                      ref={setRef(`${key}-${ci}`)}
                      className={`inline-block origin-bottom-left opacity-0 will-change-transform ${
                        key === "sound" ? "text-volt" : ""
                      }`}
                    >
                      {ch}
                    </span>
                  ))}
                </h2>
              </div>
            )
          )}

          <div
            ref={setRef("cta")}
            className="absolute inset-x-0 bottom-[10%] flex flex-col items-center gap-8"
          >
            <h2 className="display-lg text-center">
              {CTA_TOKENS.map((token, ti) => (
                <span key={ti} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
                  <span
                    ref={setRef(`cta-${ti}`)}
                    className="inline-block opacity-0 will-change-transform"
                  >
                    {token}
                    {ti < CTA_TOKENS.length - 1 ? " " : ""}
                  </span>
                </span>
              ))}
            </h2>
            <div ref={setRef("cta-buttons")} className="pointer-events-auto opacity-0">
              <HeroCtas />
            </div>
          </div>

          {/* scroll cue */}
          <div
            ref={setRef("cue")}
            className="absolute inset-x-0 bottom-[6%] flex flex-col items-center gap-3 opacity-100"
          >
            <span className="eyebrow">Scroll</span>
            <span className="h-8 w-px overflow-hidden">
              <span className="block h-full w-px origin-top animate-[cue-drop_1.4s_ease-in-out_infinite] bg-paper/70" />
            </span>
          </div>

          {/* HUD: frame readout + scrub bar */}
          <div className="absolute right-[5%] top-1/2 flex -translate-y-1/2 flex-col items-center gap-4">
            <span
              ref={setRef("frame-counter")}
              className="font-display text-[0.625rem] font-600 tracking-[0.3em] text-muted"
            >
              01 / {FRAME_COUNT}
            </span>
            <span className="relative h-24 w-px overflow-hidden bg-line">
              <span
                ref={setRef("scrub-fill")}
                className="absolute inset-0 origin-top scale-y-0 bg-signal will-change-transform"
              />
            </span>
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
