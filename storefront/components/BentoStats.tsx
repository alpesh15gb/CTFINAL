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
                  Diesel Tronic ECU
                </div>
                <div className="flex items-center gap-2 rounded-lg border hairline bg-surface-2/70 px-3 py-2.5 text-xs text-muted">
                  <span className="flex h-5 w-5 items-center justify-center rounded bg-white/10 text-[10px]">✚</span>
                  Powertronic ECU
                </div>
              </div>
            </div>
          </Rise>

          <Rise delay={60}>
            <div className="panel flex h-full flex-col overflow-hidden p-0">
              <div className="p-6 pb-4">
                <h3 className="text-center text-base font-semibold tracking-tight">Interiors</h3>
                <p className="mt-2 text-center text-[13px] leading-relaxed text-muted">
                  Nappa retrims, floor mats and cushion support.
                </p>
              </div>
              <img
                src="/images/services/interior-dark.webp"
                alt="Black nappa leather interior with red diamond stitching"
                className="mt-auto h-44 w-full object-cover"
                loading="lazy"
              />
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
        </div>
      </div>
    </section>
  )
}
