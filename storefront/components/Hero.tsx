import Link from "next/link"
import Rise from "./Rise"
import HeroLight from "./HeroLight"
import TintSwatches from "./TintSwatches"

const WA = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "919949695030"}`

const STATS = [
  { label: "Builds delivered", value: "250+", delta: "+12 this month", points: "0,14 8,12 16,13 24,8 32,9 40,4" },
  { label: "Google rating", value: "4.9", delta: "312 reviews", points: "0,12 8,12 16,10 24,10 32,7 40,5" },
  { label: "Cars wrapped", value: "500+", delta: "+9 this month", points: "0,13 8,11 16,12 24,9 32,7 40,6" },
  { label: "Avg. ECU gain", value: "+38 HP", delta: "dyno verified", points: "0,14 8,13 16,10 24,11 32,6 40,3" },
]

const BUILDS = [
  { name: "Fortuner · Stage 2", tag: "Wrapped satin black", color: "#e10600" },
  { name: "Thar · Audio build", tag: "Component + DSP tune", color: "#02bbfc" },
  { name: "City · Cabin retim", tag: "Nappa cream stitching", color: "#f5f4f0" },
]

function Spark({ points }: { points: string }) {
  return (
    <svg viewBox="0 0 40 16" className="h-4 w-10 text-white/40" fill="none" aria-hidden>
      <polyline points={points} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function Hero() {
  return (
    <section id="hero" data-ghost="hero" className="relative px-6 pb-20 pt-28 text-center md:pt-32">
      <HeroLight />

      <div className="relative">
      <Rise>
        <span className="badge-pill">
          <span className="h-1.5 w-1.5 rounded-full bg-signal" />
          Now booking · Hyderabad studio
        </span>
      </Rise>

      <Rise delay={80}>
        <h1 className="headline-1 mx-auto mt-6 max-w-3xl text-balance">
          Built around you.
          <br />
          Not for everyone.
        </h1>
      </Rise>

      <Rise delay={140}>
        <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-muted">
          From Stage 1 tunes to full cabin retrims — every detail engineered
          in our Secunderabad studio, on real cars, with real dyno numbers.
        </p>
      </Rise>

      <Rise delay={200}>
        <div className="mt-7">
          <TintSwatches />
        </div>
      </Rise>

      <Rise delay={240}>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link href="/shop" className="btn-secondary">
            Explore Builds <span aria-hidden>→</span>
          </Link>
          <a href={WA} target="_blank" rel="noreferrer" className="btn-primary">
            Book a Build <span aria-hidden>→</span>
          </a>
        </div>
      </Rise>

      <div className="relative mt-16 md:mt-20">
        {/* REF: eclipse glow rising behind the product panel */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 -z-0 h-[560px] w-[880px] max-w-[130vw] -translate-x-1/2 -translate-y-1/4 rounded-full motion-safe:animate-[glow-breathe_7s_ease-in-out_infinite] [background:radial-gradient(closest-side,rgba(255,59,46,0.5),rgba(225,6,0,0.16)_55%,transparent_75%)] blur-2xl"
        />

        <Rise delay={260} className="relative">
          <div className="panel mx-auto max-w-5xl overflow-hidden !rounded-[1.5rem] text-left shadow-[0_40px_120px_rgba(0,0,0,0.55)]">
            {/* panel chrome */}
            <div className="flex items-center justify-between border-b hairline px-5 py-3.5">
              <img
                src="/images/cartunez-logo.png"
                alt=""
                className="h-7 w-7 [mix-blend-mode:screen]"
              />
              <nav className="hidden items-center gap-5 text-[13px] sm:flex" aria-label="Studio panel">
                <span className="text-paper">Overview</span>
                <span className="text-muted">Builds</span>
                <span className="text-muted">Services</span>
                <span className="text-muted">Dyno</span>
              </nav>
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-2 text-xs text-muted" aria-hidden>
                  N
                </span>
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-signal text-[11px] font-semibold text-white">
                  C
                </span>
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

              {/* stat tiles */}
              <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
                {STATS.map((s) => (
                  <div key={s.label} className="rounded-xl border hairline bg-surface-2/60 p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted">{s.label}</p>
                        <p className="mt-1.5 text-2xl font-semibold tracking-tight">{s.value}</p>
                      </div>
                      <Spark points={s.points} />
                    </div>
                    <p className="mt-2 text-xs text-muted">{s.delta}</p>
                  </div>
                ))}
              </div>

              {/* bay + latest builds */}
              <div className="mt-3 grid gap-3 lg:grid-cols-5">
                <div className="relative overflow-hidden rounded-xl border hairline lg:col-span-2">
                  <img
                    src="/sequences/hero/frame-01.webp"
                    alt="Current build in the Cartunez bay"
                    className="h-52 w-full object-cover lg:h-full"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted">In the bay now</p>
                    <p className="mt-1 text-sm font-medium">Thar ROXX — audio build, day 2 of 4</p>
                  </div>
                </div>
                <div className="rounded-xl border hairline bg-surface-2/40 p-4 lg:col-span-3">
                  <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted">Latest builds</p>
                  <ul className="mt-3 divide-y hairline">
                    {BUILDS.map((b) => (
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
        </Rise>
      </div>
      </div>
    </section>
  )
}
