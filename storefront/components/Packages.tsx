import Link from "next/link"
import Rise from "./Rise"
import { fetchProducts } from "@/lib/medusa"
import { formatINR } from "@/lib/store"

// REF: 3-tier pricing with highlighted centre card — prices live from Medusa
// by handle, static fallback per ARCHITECTURE failure mode.
const TIERS = [
  {
    handle: "7d-floor-mats",
    plan: "Essential cabin",
    blurb: "Start with the details you touch every day.",
    checks: ["Custom-fit 7D floor mats", "Magnetic climate sunshades", "Lumbar support cushions", "Fitted in under 2 hours"],
    fallback: { title: "7D Floor Mats", price: 1999 },
  },
  {
    handle: "stage-1-ecu-remap",
    plan: "Stage 1 ECU remap",
    blurb: "The character upgrade — dyno-verified gains, same-day.",
    checks: ["Custom dyno tune", "+30–40 HP typical gain", "Before/after dyno graphs", "93-octane safe maps"],
    highlight: true,
    fallback: { title: "Stage 1 ECU Remap", price: 14999 },
  },
  {
    handle: "nappa-leather-upholstery",
    plan: "Full cabin retim",
    blurb: "A cabin that feels bespoke, stitched to order.",
    checks: ["Nappa leather, all seats", "Colour + stitch options", "Ambient LED kit included", "3–5 day turnaround"],
    fallback: { title: "Nappa Leather Upholstery", price: 34999 },
  },
]

export default async function Packages() {
  const { products } = await fetchProducts(14)
  const byHandle = new Map(products.map((p) => [p.handle, p]))

  return (
    <section id="packages" data-ghost="packages" className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-[1200px]">
        <Rise className="text-center">
          <h2 className="headline-2">Signature packages.</h2>
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-muted">
            Discover the right entry point for your build. Every package is
            fitted in-studio and backed by our workmanship guarantee.
          </p>
        </Rise>

        <div className="mt-14 grid items-stretch gap-4 md:grid-cols-3">
          {TIERS.map((tier, i) => {
            const p = byHandle.get(tier.handle)
            const price = p?.variants?.[0]?.calculated_price?.calculated_amount
            const title = p?.title ?? tier.fallback.title
            const href = `/shop/${tier.handle}`
            return (
              <Rise key={tier.handle} delay={i * 70}>
                <div
                  className={`flex h-full flex-col rounded-[1.25rem] border p-7 ${
                    tier.highlight
                      ? "border-signal/60 bg-surface shadow-[0_24px_80px_rgba(225,6,0,0.15)]"
                      : "hairline bg-surface"
                  }`}
                >
                  <p className="text-3xl font-semibold tracking-tight">
                    {price ? formatINR(price) : formatINR(tier.fallback.price)}
                  </p>
                  <p className="mt-1 text-sm font-medium">{tier.plan}</p>
                  <p className="mt-3 text-[13px] leading-relaxed text-muted">{tier.blurb}</p>
                  <Link
                    href={href}
                    className={`mt-5 justify-center text-center ${
                      tier.highlight ? "btn-primary w-full" : "btn-secondary w-full"
                    }`}
                  >
                    Get started
                  </Link>
                  <ul className="mt-6 space-y-3 border-t hairline pt-6">
                    {tier.checks.map((c) => (
                      <li key={c} className="flex items-center gap-3 text-[13px]">
                        <span className="check-dot text-[9px] text-white" aria-hidden>✓</span>
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              </Rise>
            )
          })}
        </div>
      </div>
    </section>
  )
}
