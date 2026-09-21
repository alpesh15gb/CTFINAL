"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import type { Material, Mesh } from "three"

const WA = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "919949695030"}`

// MOT-7 — "Orbit": WebGL hero. Scroll scrubs a pinned camera orbit around
// the studio SUV; the mouse adds parallax; paint swatches recolor the body
// live (hero-tint event). Pinned progress drives act copy + velocity skew.
const ACTS = {
  style: { start: 0.28, end: 0.46 },
  sound: { start: 0.52, end: 0.7 },
  performance: { start: 0.76, end: 0.9 },
  cta: { start: 0.95, end: 1.01 },
} as const

const FADE = 0.045
const clamp01 = (t: number) => Math.min(Math.max(t, 0), 1)
const smooth = (t: number) => t * t * (3 - 2 * t)

function windowPose(progress: number, start: number, end: number, holdEnd = false) {
  const fadeIn = clamp01((progress - start) / FADE)
  const fadeOut = holdEnd ? 1 : clamp01((end - progress) / FADE)
  return {
    opacity: Math.min(fadeIn, fadeOut),
    y: (1 - fadeIn) * 60 - (1 - fadeOut) * 60,
  }
}

export default function OrbitHero() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const refs = useRef<Record<string, HTMLElement | null>>({})
  
  const underLightRef = useRef<{ color: { set: (c: string) => void } } | null>(null)
  const [reduced, setReduced] = useState(false)
  const [phase, setPhase] = useState<"loading" | "curtain" | "live">("loading")
  const [pct, setPct] = useState(0)

  useEffect(() => {
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    setReduced(isReduced)

    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return

    let disposed = false
    let raf = 0
    let cleanupScene: (() => void) | null = null

    const set = (key: string, style: Partial<CSSStyleDeclaration>) => {
      const el = refs.current[key]
      if (el) Object.assign(el.style, style)
    }

    const boot = async () => {
      const THREE = await import("three")
      const { GLTFLoader } = await import("three/examples/jsm/loaders/GLTFLoader.js")
      if (disposed) return

      const stage = stageRef.current!
      const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        powerPreference: "high-performance",
      })
      renderer.setClearColor(0x0d0d0f, 1)
      renderer.toneMapping = THREE.ACESFilmicToneMapping
      renderer.toneMappingExposure = 1.0
      renderer.shadowMap.enabled = true
      renderer.shadowMap.type = THREE.PCFSoftShadowMap

      const size = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, window.innerWidth < 768 ? 1.5 : 2)
        renderer.setPixelRatio(dpr)
        renderer.setSize(stage.clientWidth, stage.clientHeight, false)
        camera.aspect = stage.clientWidth / Math.max(stage.clientHeight, 1)
        // portrait phones need a wider lens or the car fills the frame
        camera.fov = camera.aspect < 1 ? 47 : 36
        camera.updateProjectionMatrix()
      }

      const scene = new THREE.Scene()
      scene.fog = new THREE.Fog(0x0d0d0f, 9, 26)

      const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 60)
      // supercar sits low — keep the orbit's look-at near its beltline
      const target = new THREE.Vector3(0, 0.55, 0)

      scene.add(new THREE.HemisphereLight(0x2a2a31, 0x0a0a0b, 0.55))

      const key = new THREE.SpotLight(0xffffff, 130, 0, Math.PI / 6, 0.55, 1.6)
      key.position.set(5, 8, 4)
      key.castShadow = true
      key.shadow.mapSize.set(1024, 1024)
      key.shadow.bias = -0.0003
      scene.add(key, key.target)

      const rimRed = new THREE.SpotLight(0xe10600, 340, 0, Math.PI / 4, 0.6, 1.8)
      rimRed.position.set(-6.5, 2.8, -5.5)
      scene.add(rimRed, rimRed.target)

      const rimCool = new THREE.SpotLight(0xffffff, 170, 0, Math.PI / 4, 0.7, 1.8)
      rimCool.position.set(6.5, 3.2, -4.5)
      scene.add(rimCool, rimCool.target)

      const under = new THREE.PointLight(0xe10600, 55, 7, 1.8)
      under.position.set(0, 0.3, 0.6)
      scene.add(under)
      underLightRef.current = under as unknown as { color: { set: (c: string) => void } }

      const floor = new THREE.Mesh(
        new THREE.CircleGeometry(18, 48),
        new THREE.MeshStandardMaterial({ color: 0x070709, roughness: 0.95, metalness: 0 })
      )
      floor.rotation.x = -Math.PI / 2
      floor.receiveShadow = true
      scene.add(floor)

      // car — normalize scale/ground. The Temerario is an authored model with
      // its own materials/textures, so we render it as-is under studio lights.
      new GLTFLoader().load(
        "/models/lamborghini-temerario-widebody.glb",
        (gltf) => {
          const car = gltf.scene
          const box = new THREE.Box3().setFromObject(car)
          const dims = box.getSize(new THREE.Vector3())
          const scale = 4.6 / Math.max(dims.x, dims.z)
          car.scale.setScalar(scale)
          const cbox = new THREE.Box3().setFromObject(car)
          car.position.x -= (cbox.min.x + cbox.max.x) / 2
          car.position.z -= (cbox.min.z + cbox.max.z) / 2
          car.position.y -= cbox.min.y
          car.traverse((o) => {
            const mesh = o as Mesh
            if (!mesh.isMesh) return
            mesh.castShadow = true
          })
          scene.add(car)
          markReady()
        },
        (xhr) => {
          if (xhr.total > 0) setPct(Math.round((xhr.loaded / xhr.total) * 100))
        },
        () => markReady() // even on error, never trap the visitor behind the veil
      )

      // preloader gating: model ready + minimum display time
      const t0 = performance.now()
      let modelReady = false
      let finished = false
      const markReady = () => {
        if (modelReady) return
        modelReady = true
        const wait = Math.max(0, 900 - (performance.now() - t0))
        setTimeout(() => {
          if (disposed || finished) return
          finished = true
          setPhase("curtain")
          setPct(100)
          // curtain lift, then hand control to the scroll loop
          setTimeout(() => {
            if (disposed) return
            setPhase("live")
            window.__lenis?.start()
            document.documentElement.style.overflow = ""
          }, 950)
        }, wait)
      }

      window.__lenis?.stop()
      document.documentElement.style.overflow = "hidden"

      const onTint = (e: Event) => {
        // swatches recolor the studio: red rim + underglow follow the paint
        const { color } = (e as CustomEvent<{ color: string }>).detail
        rimRed.color.set(color)
        underLightRef.current?.color.set(color)
      }
      window.addEventListener("hero-tint", onTint)

      // camera + copy state
      let progress = 0
      let camAz = THREE.MathUtils.degToRad(200)
      let camR = 7.4
      let camH = 2.4
      let introMix = isReduced ? 1 : 0
      let mouseX = 0
      let mouseY = 0
      let smX = 0
      let smY = 0
      let lastProgress = 0
      let velocity = 0

      const onMove = (e: PointerEvent) => {
        if (e.pointerType !== "mouse") return
        const rect = stage.getBoundingClientRect()
        mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2
        mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2
      }
      window.addEventListener("pointermove", onMove, { passive: true })

      const render = (p: number) => {
        // camera choreography: sweep, mid dolly-in, height dip; portrait
        // aspect pulls the camera back so the whole car stays in frame
        const pull = camera.aspect < 1 ? 1.5 : 1
        const az = THREE.MathUtils.degToRad(200 + p * 140) + smX * 0.06
        const r = (7.4 - 1.9 * Math.sin(p * Math.PI)) * pull + (1 - introMix) * 3.6
        const h = 2.3 - 1.05 * Math.sin(Math.min(p * 1.15, 1) * Math.PI) + (1 - introMix) * 1.4 + smY * -0.35
        camAz += (az - camAz) * 0.09
        camR += (r - camR) * 0.09
        camH += (h - camH) * 0.09
        camera.position.set(
          Math.sin(camAz) * camR,
          camH,
          Math.cos(camAz) * camR
        )
        camera.lookAt(target)
        renderer.render(scene, camera)

        // HUD
        const degEl = refs.current["hud-deg"]
        if (degEl) degEl.textContent = `${String(Math.round(200 + p * 140)).padStart(3, "0")}°`
        set("hud-fill", { transform: `scaleY(${p.toFixed(4)})` })

        // intro copy fades as the scrub begins (state-driven before that)
        const introEl = refs.current["intro"]
        if (introEl && phaseRef.current === "live") {
          introEl.style.opacity = String(1 - clamp01((p - 0.12) / 0.07))
        }

        // act words + velocity skew
        velocity += (clampRange(-5, 5, (p - lastProgress) * 320) - velocity) * 0.1
        lastProgress = p
        const skew = velocity.toFixed(2)
        for (const [key, win] of Object.entries(ACTS)) {
          const el = refs.current[key]
          if (!el) continue
          const { opacity, y } = windowPose(p, win.start, win.end, key === "cta")
          el.style.opacity = String(opacity)
          el.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0) skewY(${skew}deg)`
        }
      }
      const clampRange = (min: number, max: number, v: number) => Math.min(Math.max(v, min), max)

      size()
      camera.position.set(
        Math.sin(THREE.MathUtils.degToRad(200)) * 11,
        3.8,
        Math.cos(THREE.MathUtils.degToRad(200)) * 11
      )
      camera.lookAt(target)
      renderer.render(scene, camera)

      if (isReduced) {
        // static studio angle, no loop
        camera.position.set(Math.sin(THREE.MathUtils.degToRad(245)) * 7.2, 2.1, Math.cos(THREE.MathUtils.degToRad(245)) * 7.2)
        camera.lookAt(target)
        renderer.render(scene, camera)
        markReady()
        const onResizeR = () => {
          size()
          camera.position.set(Math.sin(THREE.MathUtils.degToRad(245)) * 7.2, 2.1, Math.cos(THREE.MathUtils.degToRad(245)) * 7.2)
          camera.lookAt(target)
          renderer.render(scene, camera)
        }
        window.addEventListener("resize", onResizeR)
        cleanupScene = () => window.removeEventListener("resize", onResizeR)
        return
      }

      // live loop: sticky-section progress drives everything (render every
      // frame — the skew decay and intro dolly must settle even when idle)
      const tick = (now: number) => {
        const rect = wrap.getBoundingClientRect()
        const scrollable = rect.height - window.innerHeight
        const p = clamp01(-rect.top / Math.max(scrollable, 1))
        if (phaseRef.current === "loading") {
          renderer.render(scene, camera)
        } else {
          introMix += (1 - introMix) * 0.045
          smX += (mouseX - smX) * 0.06
          smY += (mouseY - smY) * 0.06
          progress = p
          render(p)
        }
        raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)

      const onResize = () => size()
      window.addEventListener("resize", onResize)

      cleanupScene = () => {
        window.removeEventListener("resize", onResize)
        window.removeEventListener("pointermove", onMove)
        window.removeEventListener("hero-tint", onTint)
        scene.traverse((o) => {
          const mesh = o as Mesh
          if (mesh.isMesh) {
            mesh.geometry?.dispose()
            const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
            for (const m of mats) (m as Material)?.dispose()
          }
        })
        renderer.dispose()
      }
    }

    boot()

    return () => {
      disposed = true
      cancelAnimationFrame(raf)
      cleanupScene?.()
      window.__lenis?.start()
      document.documentElement.style.overflow = ""
    }
  }, [])

  // phase ref so the rAF loop sees state without re-subscribing
  const phaseRef = useRef(phase)
  phaseRef.current = phase

  const setRef = (key: string) => (el: HTMLElement | null): void => {
    refs.current[key] = el
  }

  const introVisible = reduced || phase === "live"

  return (
    <>
      <section
        ref={wrapRef}
        data-ghost="hero"
        aria-label="Cartunez studio orbit"
        className={reduced ? "relative" : "relative h-[520vh]"}
      >
        <div ref={stageRef} className={`${reduced ? "relative h-[100svh]" : "sticky top-0"} h-svh overflow-hidden`}>
          <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

          {/* legibility wash over the centre */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(13,13,15,0.55),rgba(13,13,15,0.1)_55%,transparent_78%)]" />

          <div className="pointer-events-none absolute inset-0 z-10">
            {/* intro act */}
            <div
              ref={setRef("intro")}
              className={`absolute inset-x-0 top-[16%] flex flex-col items-center gap-5 px-6 text-center transition-opacity duration-700 ${
                introVisible ? "opacity-100" : "opacity-0"
              }`}
            >
              <span className="badge-pill">
                <span className="h-1.5 w-1.5 rounded-full bg-signal" />
                Now booking · Hyderabad studio
              </span>
              <h1 className="headline-1 max-w-3xl text-balance">
                Built around you.
                <br />
                Not for everyone.
              </h1>
              <p className="max-w-xl text-[15px] leading-relaxed text-muted">
                From Stage 1 tunes to full cabin retrims — every detail
                engineered in our Secunderabad studio, on real cars, with real
                dyno numbers.
              </p>
              <div className="pointer-events-auto" data-hero-swatches>
                <TintSwatchesInline />
              </div>
              <div className="pointer-events-auto flex flex-wrap items-center justify-center gap-3">
                <Link href="/shop" className="btn-secondary">
                  Explore Builds <span aria-hidden>→</span>
                </Link>
                <a href={WA} target="_blank" rel="noreferrer" className="btn-primary">
                  Book a Build <span aria-hidden>→</span>
                </a>
              </div>
            </div>

            {/* act words */}
            {(
              [
                ["style", "Style.", "Wide-body, stance and wraps — fitted in-house."],
                ["sound", "Sound.", "Component audio tuned by ear, DSP-verified."],
                ["performance", "Performance.", "+38 HP average, dyno-proven."],
              ] as const
            ).map(([key, word, sub]) => (
              <div
                key={key}
                ref={setRef(key)}
                className="absolute bottom-[16%] left-[6%] max-w-xl opacity-0 will-change-transform md:left-[9%]"
              >
                <h2 className="text-[clamp(2.75rem,7vw,6rem)] font-semibold leading-none tracking-[-0.03em] [text-shadow:0_4px_40px_rgba(0,0,0,0.7)]">
                  {word}
                </h2>
                <p className="mt-3 text-[15px] text-muted [text-shadow:0_2px_20px_rgba(0,0,0,0.8)]">{sub}</p>
              </div>
            ))}

            {/* cta act */}
            <div
              ref={setRef("cta")}
              className="absolute inset-x-0 bottom-[12%] flex flex-col items-center gap-7 opacity-0 will-change-transform"
            >
              <h2 className="headline-2 text-center [text-shadow:0_4px_40px_rgba(0,0,0,0.7)]">
                Make it <span className="text-signal">yours.</span>
              </h2>
              <div className="pointer-events-auto flex flex-wrap items-center justify-center gap-3">
                <Link href="/shop" className="btn-secondary">
                  Explore Builds <span aria-hidden>→</span>
                </Link>
                <a href={WA} target="_blank" rel="noreferrer" className="btn-primary">
                  Book a Build <span aria-hidden>→</span>
                </a>
              </div>
            </div>

            {/* HUD — desktop only (collides with copy on small screens) */}
            {!reduced && (
              <div className="absolute right-[5%] top-1/2 hidden -translate-y-1/2 flex-col items-center gap-4 md:flex">
                <span className="font-display text-[0.625rem] font-semibold tracking-[0.3em] text-muted">ORBIT</span>
                <span ref={setRef("hud-deg")} className="font-display text-[0.625rem] font-semibold tracking-[0.2em] text-paper/70">
                  200°
                </span>
                <span className="relative h-24 w-px overflow-hidden bg-white/10">
                  <span
                    ref={setRef("hud-fill")}
                    className="absolute inset-0 origin-top scale-y-0 bg-signal will-change-transform"
                  />
                </span>
              </div>
            )}
          </div>

          {/* preloader + curtain */}
          {phase !== "live" && !reduced && (
            <div data-phase={phase} className="absolute inset-0 z-30">
              <div
                className={`absolute inset-x-0 top-0 h-1/2 bg-ink transition-transform duration-[850ms] ease-[cubic-bezier(0.76,0,0.24,1)] ${
                  phase === "curtain" ? "-translate-y-full" : ""
                }`}
              />
              <div
                className={`absolute inset-x-0 bottom-0 h-1/2 bg-ink transition-transform duration-[850ms] ease-[cubic-bezier(0.76,0,0.24,1)] ${
                  phase === "curtain" ? "translate-y-full" : ""
                }`}
              />
              <div
                className={`absolute inset-0 flex flex-col items-center justify-center gap-6 transition-opacity duration-300 ${
                  phase === "curtain" ? "opacity-0" : "opacity-100"
                }`}
              >
                <img
                  src="/images/cartunez-logo.png"
                  alt=""
                  className="h-20 w-20 [mix-blend-mode:screen] motion-safe:animate-[glow-breathe_1.8s_ease-in-out_infinite]"
                />
                <p className="headline-1 !text-6xl tabular-nums">{pct}</p>
                <span className="relative h-px w-40 overflow-hidden bg-white/10">
                  <span className="absolute inset-y-0 left-0 bg-signal transition-all duration-300" style={{ width: `${pct}%` }} />
                </span>
                <span className="eyebrow">Preparing the studio</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* studio panel — the pin hands off here */}
      <StudioPanel />
    </>
  )
}

function TintSwatchesInline() {
  const [active, setActive] = useState(0)
  const SWATCHES = [
    { name: "Satin Red", color: "#e10600" },
    { name: "Volt Blue", color: "#02bbfc" },
    { name: "Pearl White", color: "#f5f4f0" },
  ]
  return (
    <div className="flex items-center justify-center gap-3">
      <span className="mr-1 text-xs text-muted">Paint the light</span>
      {SWATCHES.map((s, i) => (
        <button
          key={s.color}
          type="button"
          title={s.name}
          aria-label={`Paint: ${s.name}`}
          aria-pressed={active === i}
          onClick={() => {
            setActive(i)
            window.dispatchEvent(new CustomEvent("hero-tint", { detail: { color: s.color } }))
          }}
          className={`h-6 w-6 rounded-full border transition-all duration-300 ${
            active === i ? "scale-110 border-white/70" : "border-white/20 hover:scale-105 hover:border-white/40"
          }`}
          style={{ background: s.color }}
        />
      ))}
    </div>
  )
}

function StudioPanel() {
  return (
    <section id="studio-panel" className="relative px-6 pb-20">
      <div className="relative mx-auto max-w-5xl">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 -z-0 h-[420px] w-[820px] max-w-[130vw] -translate-x-1/2 -translate-y-1/4 rounded-full [background:radial-gradient(closest-side,rgba(255,59,46,0.4),rgba(225,6,0,0.12)_55%,transparent_75%)] blur-2xl"
        />
        <div className="panel relative overflow-hidden !rounded-[1.5rem] text-left shadow-[0_40px_120px_rgba(0,0,0,0.55)]">
          <div className="flex items-center justify-between border-b hairline px-5 py-3.5">
            <img src="/images/cartunez-logo.png" alt="" className="h-7 w-7 [mix-blend-mode:screen]" />
            <nav className="hidden items-center gap-5 text-[13px] sm:flex" aria-label="Studio panel">
              <span className="text-paper">Overview</span>
              <span className="text-muted">Builds</span>
              <span className="text-muted">Services</span>
              <span className="text-muted">Dyno</span>
            </nav>
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-2 text-xs text-muted" aria-hidden>N</span>
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-signal text-[11px] font-semibold text-white">C</span>
            </div>
          </div>
          <div className="px-5 pb-5 pt-5 md:px-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold tracking-tight">Studio</h2>
              <span className="badge-pill !py-1.5">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                Live · 2 cars in the bay
              </span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
              {[
                { label: "Builds delivered", value: "250+", delta: "+12 this month", points: "0,14 8,12 16,13 24,8 32,9 40,4" },
                { label: "Google rating", value: "4.9", delta: "312 reviews", points: "0,12 8,12 16,10 24,10 32,7 40,5" },
                { label: "Cars wrapped", value: "500+", delta: "+9 this month", points: "0,13 8,11 16,12 24,9 32,7 40,6" },
                { label: "Avg. ECU gain", value: "+38 HP", delta: "dyno verified", points: "0,14 8,13 16,10 24,11 32,6 40,3" },
              ].map((s) => (
                <div key={s.label} className="rounded-xl border hairline bg-surface-2/60 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted">{s.label}</p>
                      <p className="mt-1.5 text-2xl font-semibold tracking-tight">{s.value}</p>
                    </div>
                    <svg viewBox="0 0 40 16" className="h-4 w-10 text-white/40" fill="none" aria-hidden>
                      <polyline points={s.points} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <p className="mt-2 text-xs text-muted">{s.delta}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 grid gap-3 lg:grid-cols-5">
              <div className="relative overflow-hidden rounded-xl border hairline lg:col-span-2">
                <img src="/sequences/hero/frame-01.webp" alt="Current build in the Cartunez bay" className="h-52 w-full object-cover lg:h-full" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted">In the bay now</p>
                  <p className="mt-1 text-sm font-medium">Thar ROXX — audio build, day 2 of 4</p>
                </div>
              </div>
              <div className="rounded-xl border hairline bg-surface-2/40 p-4 lg:col-span-3">
                <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted">Latest builds</p>
                <ul className="mt-3 divide-y hairline">
                  {[
                    { name: "Fortuner · Stage 2", tag: "Wrapped satin black", color: "#e10600" },
                    { name: "Thar · Audio build", tag: "Component + DSP tune", color: "#02bbfc" },
                    { name: "City · Cabin retim", tag: "Nappa cream stitching", color: "#f5f4f0" },
                  ].map((b) => (
                    <li key={b.name} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                      <div className="flex items-center gap-3">
                        <span className="h-8 w-8 flex-none rounded-lg" style={{ background: `${b.color}22`, border: `1px solid ${b.color}55` }} />
                        <div>
                          <p className="text-sm font-medium">{b.name}</p>
                          <p className="text-xs text-muted">{b.tag}</p>
                        </div>
                      </div>
                      <Link href="/shop" className="text-xs text-muted transition-colors hover:text-paper">
                        Parts →
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
