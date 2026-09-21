import Link from "next/link"
import Rise from "./Rise"

// REF: bento stats grid (Balance / Users / gradient tile / activity board)
export default function BentoStats() {
  return (
    <section id="bento" data-ghost="bento" className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-[1200px]">
        <Rise className="text-center">
          <h2 className="headline-2 mx-auto max-w-2xl text-balance">
            Everything your car is <span className="text-signal">missing.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-muted">
            Four bays, one obsession. Dyno-verified performance, hand-stitched
            cabins and audio tuned by ear — under one roof in Secunderabad.
          </p>
        </Rise>

        <div className="mt-14 grid gap-4 md:grid-cols-3">
          <Rise delay={0}>
            <div className="panel h-full p-6">
              <h3 className="text-center text-base font-semibold tracking-tight">ECU & Performance</h3>
              <p className="mt-2 text-center text-[13px] leading-relaxed text-muted">
                Custom dyno maps, intake and tune support.
              </p>
              <div className="mt-5 space-y-2">
                <div className="flex items-center gap-2 rounded-lg bg-signal px-3 py-2.5 text-xs font-medium text-white shadow-[0_8px_24px_rgba(225,6,0,0.3)]">
                  <span className="flex h-5 w-5 items-center justify-center rounded bg-white/20 text-[10px]">≡</span>
                  ECU-08 · Custom dyno tune
                </div>
                <div className="flex items-center gap-2 rounded-lg border hairline bg-surface-2/70 px-3 py-2.5 text-xs text-muted">
                  <span className="flex h-5 w-5 items-center justify-center rounded bg-white/10 text-[10px]">✚</span>
                  INT-07 · Making everything talk together
                </div>
              </div>
            </div>
          </Rise>

          <Rise delay={60}>
            <div className="panel flex h-full flex-col p-6">
              <h3 className="text-center text-base font-semibold tracking-tight">Interiors</h3>
              <p className="mt-2 text-center text-[13px] leading-relaxed text-muted">
                Nappa retrims, floor mats and cushion support.
              </p>
              <div className="mt-auto pt-5">
                <div className="rounded-lg border hairline bg-surface-2/60 p-4">
                  <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted">Cabins retrimmed</p>
                  <div className="mt-1 flex items-end justify-between">
                    <p className="text-3xl font-semibold tracking-tight">500+</p>
                    <svg viewBox="0 0 40 16" className="h-4 w-10 text-white/40" fill="none" aria-hidden>
                      <polyline points="0,12 8,12 16,9 24,10 32,6 40,4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </Rise>

          <Rise delay={120}>
            <div className="relative flex h-full min-h-[320px] flex-col justify-between overflow-hidden rounded-[1.25rem] border hairline bg-[linear-gradient(160deg,#ff3b2e,#e10600_55%,#8f0400)] p-6 shadow-[0_24px_80px_rgba(225,6,0,0.25)]">
              <div className="mx-auto mt-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-black/40 text-3xl backdrop-blur" aria-hidden>
                ⚙
              </div>
              <div className="rounded-xl bg-black/30 p-4 backdrop-blur">
                <p className="text-sm font-semibold text-white">Custom builds</p>
                <p className="mt-1 text-xs leading-relaxed text-white/70">
                  Quote, parts and fitting plan — sorted over one WhatsApp thread.
                </p>
                <Link href="/shop" className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-white/90 transition-colors hover:text-white">
                  Start yours →
                </Link>
              </div>
            </div>
          </Rise>

          <Rise delay={160} className="md:col-span-2">
            <div className="panel flex h-full flex-col gap-6 p-6 sm:flex-row">
              <div className="sm:w-1/3">
                <h3 className="text-base font-semibold tracking-tight">Studio log</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-muted">
                  Live status across the bays, updated by the crew every morning.
                </p>
              </div>
              <ul className="grid flex-1 grid-cols-2 gap-2 self-center text-[13px] sm:text-sm">
                {["Wrap bay · Active", "Audio bench · Active", "Detail queue · 3 cars", "Dyno slot · Fri"].map((row, i) => (
                  <li key={row} className="flex items-center gap-2 rounded-lg border hairline bg-surface-2/50 px-3 py-2.5">
                    <span aria-hidden className={i % 2 === 0 ? "text-signal" : "text-paper/60"}>
                      {i % 2 === 0 ? "✦" : "◇"}
                    </span>
                    {row}
                  </li>
                ))}
              </ul>
            </div>
          </Rise>
        </div>
      </div>
    </section>
  )
}
