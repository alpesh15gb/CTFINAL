"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { createOrbitScene, type OrbitScene } from "@/lib/orbit-scene"
import { clamp01, damping, MOTION } from "@/lib/motion"

const WA = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "919949695030"}`
const ACTS = {
  style: { start: 0.28, end: 0.46 },
  sound: { start: 0.52, end: 0.7 },
  performance: { start: 0.76, end: 0.9 },
  cta: { start: 0.95, end: 1.01 },
} as const
const FADE = 0.045

function pose(progress: number, start: number, end: number, hold = false) {
  const enter = clamp01((progress - start) / FADE)
  const exit = hold ? 1 : clamp01((end - progress) / FADE)
  return { opacity: Math.min(enter, exit), y: (1 - enter) * 32 - (1 - exit) * 24, enter }
}

export default function OrbitHero() {
  const wrapRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const refs = useRef<Record<string, HTMLElement | null>>({})
  const [reduced, setReduced] = useState(true)
  const [failed, setFailed] = useState(false)
  const [phase, setPhase] = useState<"loading" | "curtain" | "live">("loading")
  const [pct, setPct] = useState(0)

  useEffect(() => {
    const wrap = wrapRef.current!
    const stage = stageRef.current!
    const canvas = canvasRef.current!
    const preference = window.matchMedia(MOTION.reduced)
    const desktop = window.matchMedia(MOTION.desktop)
    const abort = new AbortController()
    let scene: OrbitScene | undefined
    let disposed = false
    let errored = false
    let isReduced = preference.matches
    let ready = false
    let visible = false
    let raf = 0
    let curtainTimer = 0
    let last = 0
    let measure = true
    let resize = true
    let targetProgress = 0
    let progress = 0
    let intro = 0
    let x = 0
    let y = 0
    let targetX = 0
    let targetY = 0
    let color = "#e10600"
    const headings = Array.from(wrap.querySelectorAll<HTMLElement>(".orbit-act h2"))
    const subtitles = Array.from(wrap.querySelectorAll<HTMLElement>(".orbit-act p"))
    const lines = Array.from(wrap.querySelectorAll<HTMLElement>("[data-hero-line]"))

    const activate = (el: HTMLElement, shown: boolean) => {
      el.inert = !shown
      el.setAttribute("aria-hidden", String(!shown))
    }
    const showStatic = () => {
      Object.values(refs.current).forEach((el) => {
        if (!el) return
        el.style.removeProperty("opacity")
        el.style.removeProperty("transform")
        activate(el, true)
      })
      ;[...headings, ...subtitles, ...lines].forEach((el) => el.style.removeProperty("transform"))
    }
    const paintCopy = (p: number, elapsed: number) => {
      const introEl = refs.current.intro
      if (introEl) {
        const opacity = 1 - clamp01((p - 0.12) / 0.07)
        introEl.style.opacity = String(opacity)
        introEl.style.transform = `translate3d(0, ${-p * 100}px, 0)`
        activate(introEl, opacity > 0.05)
      }
      lines.forEach((el, index) => {
        const reveal = clamp01(intro * 1.5 - index * 0.14)
        el.style.transform = `translate3d(0, ${(1 - reveal) * 105}%, 0)`
      })
      const skew = desktop.matches ? Math.max(-1.2, Math.min(1.2, (targetProgress - p) / Math.max(elapsed, 0.001) * 0.2)) : 0
      Object.entries(ACTS).forEach(([key, win], index) => {
        const el = refs.current[key]
        if (!el) return
        const state = pose(p, win.start, win.end, key === "cta")
        el.style.opacity = String(state.opacity)
        el.style.transform = `translate3d(0, ${state.y}px, 0) skewY(${skew}deg)`
        activate(el, state.opacity > 0.05)
        const heading = headings[index]
        const subtitle = subtitles[index]
        if (heading) heading.style.transform = `translate3d(0, ${(1 - state.enter) * 18}px, 0)`
        if (subtitle) subtitle.style.transform = `translate3d(0, ${(1 - state.enter) * 28}px, 0)`
      })
      const degrees = refs.current["hud-deg"]
      if (degrees) degrees.textContent = `${Math.round(200 + p * 140)}°`
      const fill = refs.current["hud-fill"]
      if (fill) fill.style.transform = `scaleY(${p})`
    }

    function wake() {
      if (disposed || !ready || !visible || document.hidden || raf || errored) return
      raf = requestAnimationFrame(tick)
    }
    function tick(now: number) {
      raf = 0
      if (disposed || !ready || !visible || document.hidden || !scene || errored) return
      const elapsed = Math.min(last ? (now - last) / 1000 : 1 / 60, 1)
      last = now
      if (resize) { scene.resize(); resize = false }
      if (measure) {
        const rect = wrap.getBoundingClientRect()
        targetProgress = clamp01(-rect.top / Math.max(rect.height - stage.clientHeight, 1))
        measure = false
      }
      if (isReduced) {
        showStatic()
        scene.render(0, 0, 0, 1, true)
        canvas.dataset.motionState = "static"
        return
      }
      const rate = damping(10, elapsed)
      progress += (targetProgress - progress) * rate
      x += (targetX - x) * damping(7, elapsed)
      y += (targetY - y) * damping(7, elapsed)
      intro += (1 - intro) * damping(6, elapsed)
      const settling = Math.abs(targetProgress - progress) > 0.0001 || Math.abs(targetX - x) > 0.001 || Math.abs(targetY - y) > 0.001 || intro < 0.999
      if (!settling) { progress = targetProgress; x = targetX; y = targetY; intro = 1 }
      scene.render(progress, x, y, intro)
      paintCopy(progress, elapsed)
      canvas.dataset.motionState = settling ? "moving" : "settled"
      if (settling) wake()
    }
    const onScroll = () => { measure = true; wake() }
    const onResize = () => { resize = true; measure = true; targetX = targetY = 0; wake() }
    const onPointer = (event: PointerEvent) => {
      if (!desktop.matches || isReduced || event.pointerType !== "mouse") return
      const rect = stage.getBoundingClientRect()
      targetX = (clamp01((event.clientX - rect.left) / rect.width) - 0.5) * 2
      targetY = (clamp01((event.clientY - rect.top) / rect.height) - 0.5) * 2
      wake()
    }
    const onLeave = () => { targetX = targetY = 0; wake() }
    const onTint = (event: Event) => {
      color = (event as CustomEvent<{ color: string }>).detail.color
      scene?.tint(color)
      wake()
    }
    const onVisibility = () => {
      if (document.hidden) { cancelAnimationFrame(raf); raf = 0; last = 0 }
      else { measure = true; wake() }
    }
    const onPreference = () => {
      isReduced = preference.matches
      setReduced(isReduced)
      intro = 1
      targetX = targetY = x = y = 0
      showStatic()
      if (isReduced && ready) { clearTimeout(curtainTimer); setPhase("live") }
      resize = measure = true
      wake()
    }
    const fail = () => {
      if (disposed || errored) return
      errored = true
      clearTimeout(timeout)
      clearTimeout(curtainTimer)
      cancelAnimationFrame(raf)
      raf = 0
      abort.abort()
      scene?.dispose()
      setFailed(true)
      setPhase("live")
      showStatic()
    }
    const timeout = window.setTimeout(fail, 20000)
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) { measure = true; last = 0; wake() }
      else { cancelAnimationFrame(raf); raf = 0; last = 0; targetX = targetY = 0 }
    })
    observer.observe(wrap)
    const sizes = new ResizeObserver(onResize)
    sizes.observe(stage)
    preference.addEventListener("change", onPreference)
    desktop.addEventListener("change", onResize)
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onResize)
    stage.addEventListener("pointermove", onPointer, { passive: true })
    stage.addEventListener("pointerleave", onLeave)
    window.addEventListener("hero-tint", onTint)
    document.addEventListener("visibilitychange", onVisibility)
    canvas.addEventListener("webglcontextlost", fail)
    setReduced(isReduced)

    createOrbitScene(canvas, stage, abort.signal, (percent) => {
      if (!disposed && !errored) setPct(percent)
    }).then((controller) => {
      if (disposed || errored) { controller.dispose(); return }
      scene = controller
      scene.tint(color)
      // Prime a complete frame before fading the poster, including reduced-motion mode.
      scene.render(0, 0, 0, isReduced ? 1 : 0, isReduced)
      clearTimeout(timeout)
      ready = true
      setPct(100)
      setPhase(isReduced ? "live" : "curtain")
      if (!isReduced) curtainTimer = window.setTimeout(() => { if (!disposed) setPhase("live") }, 600)
      wake()
    }).catch(fail)

    return () => {
      disposed = true
      abort.abort()
      cancelAnimationFrame(raf)
      clearTimeout(timeout)
      clearTimeout(curtainTimer)
      observer.disconnect()
      sizes.disconnect()
      preference.removeEventListener("change", onPreference)
      desktop.removeEventListener("change", onResize)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onResize)
      window.removeEventListener("hero-tint", onTint)
      stage.removeEventListener("pointermove", onPointer)
      stage.removeEventListener("pointerleave", onLeave)
      document.removeEventListener("visibilitychange", onVisibility)
      canvas.removeEventListener("webglcontextlost", fail)
      scene?.dispose()
    }
  }, [])

  const setRef = (key: string) => (el: HTMLElement | null): void => { refs.current[key] = el }
  const staticMode = reduced || failed

  return (
    <>
      <section id="hero" ref={wrapRef} data-ghost="hero" data-cinematic={!staticMode} data-scene-state={failed ? "fallback" : phase} aria-label="Cartunez studio orbit" className={`orbit-wrap ${staticMode ? "orbit-static" : ""}`}>
        <div ref={stageRef} className="orbit-stage">
          <img src="/sequences/hero/frame-01.webp" alt="" aria-hidden className={`orbit-poster ${!failed && phase !== "loading" ? "opacity-0" : "opacity-100"}`} />
          <canvas ref={canvasRef} aria-hidden className={`absolute inset-0 h-full w-full ${failed || phase === "loading" ? "opacity-0" : "opacity-100"}`} />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(13,13,15,0.55),rgba(13,13,15,0.1)_55%,transparent_78%)]" />
          <div className="orbit-copy pointer-events-none absolute inset-0 z-10">
            <div ref={setRef("intro")} className="orbit-intro absolute inset-x-0 top-[16%] flex flex-col items-center gap-5 px-6 text-center">
              <span className="badge-pill"><span className="h-1.5 w-1.5 rounded-full bg-signal" />Now booking · Hyderabad studio</span>
              <h1 className="headline-1 max-w-3xl text-balance">
                <span className="orbit-line"><span data-hero-line>Built around you.</span></span>
                <span className="orbit-line"><span data-hero-line>Not for everyone.</span></span>
              </h1>
              <p className="max-w-xl text-[15px] leading-relaxed text-muted">From Stage 1 tunes to full cabin retrims — every detail engineered in our Secunderabad studio, on real cars, with real dyno numbers.</p>
              <div className="pointer-events-auto" data-hero-swatches><TintSwatchesInline disabled={failed} /></div>
              <div className="pointer-events-auto flex flex-wrap items-center justify-center gap-3">
                <Link href="/shop" className="btn-secondary">Explore Builds <span aria-hidden>→</span></Link>
                <a href={WA} target="_blank" rel="noreferrer" className="btn-primary">Book a Build <span aria-hidden>→</span></a>
              </div>
            </div>
            {([
              ["style", "Style.", "Wide-body, stance and wraps — fitted in-house."],
              ["sound", "Sound.", "Component audio tuned by ear, DSP-verified."],
              ["performance", "Performance.", "+38 HP average, dyno-proven."],
            ] as const).map(([key, word, sub]) => (
              <div key={key} ref={setRef(key)} className="orbit-act absolute bottom-[16%] left-[6%] max-w-xl md:left-[9%]">
                <h2 className="text-[clamp(2.75rem,7vw,6rem)] font-semibold leading-none tracking-[-0.03em] [text-shadow:0_4px_40px_rgba(0,0,0,0.7)]">{word}</h2>
                <p className="mt-3 text-[15px] text-muted [text-shadow:0_2px_20px_rgba(0,0,0,0.8)]">{sub}</p>
              </div>
            ))}
            <div ref={setRef("cta")} inert={!staticMode} aria-hidden={!staticMode} className="orbit-act orbit-cta absolute inset-x-0 bottom-[12%] flex flex-col items-center gap-7">
              <h2 className="headline-2 text-center [text-shadow:0_4px_40px_rgba(0,0,0,0.7)]">Make it <span className="text-signal">yours.</span></h2>
              <div className="pointer-events-auto flex flex-wrap items-center justify-center gap-3">
                <Link href="/shop" className="btn-secondary">Explore Builds <span aria-hidden>→</span></Link>
                <a href={WA} target="_blank" rel="noreferrer" className="btn-primary">Book a Build <span aria-hidden>→</span></a>
              </div>
            </div>
            {!staticMode && <div aria-hidden className="absolute right-[5%] top-1/2 hidden -translate-y-1/2 flex-col items-center gap-4 md:flex">
              <span className="font-display text-[0.625rem] font-semibold tracking-[0.3em] text-muted">ORBIT</span>
              <span ref={setRef("hud-deg")} className="font-display text-[0.625rem] font-semibold tracking-[0.2em] text-paper/70">200°</span>
              <span className="relative h-24 w-px overflow-hidden bg-white/10"><span ref={setRef("hud-fill")} className="absolute inset-0 origin-top scale-y-0 bg-signal" /></span>
            </div>}
          </div>
          {phase !== "live" && !staticMode && <div data-phase={phase} className="orbit-loader pointer-events-none absolute inset-0 z-30" aria-hidden>
            <div className={`orbit-curtain absolute inset-x-0 top-0 h-1/2 bg-ink ${phase === "curtain" ? "-translate-y-full" : ""}`} />
            <div className={`orbit-curtain absolute inset-x-0 bottom-0 h-1/2 bg-ink ${phase === "curtain" ? "translate-y-full" : ""}`} />
            <div className={`absolute inset-0 flex flex-col items-center justify-center gap-6 transition-opacity duration-300 ${phase === "curtain" ? "opacity-0" : "opacity-100"}`}>
              <img src="/images/cartunez-logo.png" alt="" className="h-20 w-20 [mix-blend-mode:screen]" />
              <p className="headline-1 !text-6xl tabular-nums">{pct}</p>
              <span className="relative h-px w-40 overflow-hidden bg-white/10"><span className="absolute inset-0 origin-left bg-signal transition-transform duration-300" style={{ transform: `scaleX(${pct / 100})` }} /></span>
              <span className="eyebrow">Preparing the studio</span>
            </div>
          </div>}
        </div>
      </section>
      <StudioPanel />
    </>
  )
}

function TintSwatchesInline({ disabled }: { disabled: boolean }) {
  const [active, setActive] = useState(0)
  const swatches = [
    { name: "Satin Red", color: "var(--color-signal)", value: "#e10600" },
    { name: "Volt Blue", color: "var(--color-volt)", value: "#02bbfc" },
    { name: "Pearl White", color: "var(--color-paper)", value: "#f5f4f0" },
  ]
  return <div className="flex items-center justify-center gap-1">
    <span className="mr-2 text-xs text-muted">Paint the light</span>
    {swatches.map((swatch, index) => <button key={swatch.name} type="button" disabled={disabled} title={swatch.name} aria-label={`Paint: ${swatch.name}`} aria-pressed={active === index} onClick={() => {
      setActive(index)
      window.dispatchEvent(new CustomEvent("hero-tint", { detail: { color: swatch.value } }))
    }} className="flex h-11 w-11 items-center justify-center rounded-full disabled:opacity-50">
      <span className={`h-6 w-6 rounded-full border transition-transform duration-300 ${active === index ? "scale-110 border-white/70" : "border-white/20"}`} style={{ background: swatch.color }} />
    </button>)}
  </div>
}

function StudioPanel() {
  return (
    <section id="studio-panel" className="relative px-6 pb-20">
      <div className="relative mx-auto max-w-5xl">
        <div aria-hidden className="pointer-events-none absolute left-1/2 top-0 -z-0 h-[420px] w-[820px] max-w-[130vw] -translate-x-1/2 -translate-y-1/4 rounded-full [background:radial-gradient(closest-side,rgba(255,59,46,0.4),rgba(225,6,0,0.12)_55%,transparent_75%)] blur-2xl" />
        <div className="panel relative overflow-hidden !rounded-[1.5rem] text-left shadow-[0_40px_120px_rgba(0,0,0,0.55)]">
          <div className="flex items-center justify-between border-b hairline px-5 py-3.5">
            <img src="/images/cartunez-logo.png" alt="" className="h-7 w-7 [mix-blend-mode:screen]" />
            <nav className="hidden items-center gap-5 text-[13px] sm:flex" aria-label="Studio panel">
              <span className="text-paper">Overview</span><span className="text-muted">Builds</span><span className="text-muted">Services</span><span className="text-muted">Dyno</span>
            </nav>
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-2 text-xs text-muted" aria-hidden>N</span>
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-signal text-[11px] font-semibold text-white">C</span>
            </div>
          </div>
          <div className="px-5 pb-5 pt-5 md:px-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold tracking-tight">Studio</h2>
              <span className="badge-pill !py-1.5"><span className="h-1.5 w-1.5 motion-safe:animate-pulse rounded-full bg-emerald-400" />Live · 2 cars in the bay</span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
              {[
                { label: "Builds delivered", value: "250+", delta: "+12 this month", points: "0,14 8,12 16,13 24,8 32,9 40,4" },
                { label: "Google rating", value: "4.3", delta: "312 reviews", points: "0,12 8,12 16,10 24,10 32,7 40,5" },
                { label: "Cars wrapped", value: "500+", delta: "+9 this month", points: "0,13 8,11 16,12 24,9 32,7 40,6" },
                { label: "Avg. ECU gain", value: "+38 HP", delta: "dyno verified", points: "0,14 8,13 16,10 24,11 32,6 40,3" },
              ].map((s) => <div key={s.label} className="rounded-xl border hairline bg-surface-2/60 p-4">
                <div className="flex items-start justify-between gap-2"><div><p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted">{s.label}</p><p className="mt-1.5 text-2xl font-semibold tracking-tight">{s.value}</p></div>
                  <svg viewBox="0 0 40 16" className="h-4 w-10 text-white/40" fill="none" aria-hidden><polyline points={s.points} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div><p className="mt-2 text-xs text-muted">{s.delta}</p>
              </div>)}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
