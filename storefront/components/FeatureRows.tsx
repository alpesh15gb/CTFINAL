import Link from "next/link"
import Rise from "./Rise"

// REF: alternating capability rows — glassy image panel + copy + check list
const ROWS = [
  {
    title: "The personal space",
    copy: "Precision floor mats, Nappa leather retrims, climate sunshades and ergonomic support. Your cabin, tailored like a suit — fitted in-house, never sublet.",
    checks: ["Custom-fit 7D floor mats", "Nappa leather seat retrims", "Ambient lighting, 64 colours"],
    link: "See interior work",
    image: "/images/services/upholstery.webp",
    alt: "Custom black leather upholstery with red stitching",
    chip: "Fitted in-house",
  },
  {
    title: "The sensory experience",
    copy: "Component speakers, 6-channel DSP tuning and Android head units — tuned by ear in the car, not on a bench. Every drive gets a soundtrack.",
    checks: ["Stage 2 speaker packages", "6-channel DSP amplifier tuning", "10-inch Android infotainment"],
    link: "See audio builds",
    image: "/images/services/audio.webp",
    alt: "Custom amplifier rack with red accents in a dark trunk build",
    chip: "Tuned by ear · in your car",
  },
]

export default function FeatureRows() {
  return (
    <section id="capabilities" data-ghost="capabilities" className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-[1200px]">
        <Rise className="text-center">
          <h2 className="headline-2">Our works.</h2>
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-muted">
            Explore the frontier of what your car can feel like. Our latest
            capabilities redefine the boundaries of a daily drive.
          </p>
        </Rise>

        <div className="mt-16 space-y-20 md:space-y-28">
          {ROWS.map((row, i) => (
            <div
              key={row.title}
              className="grid items-center gap-10 md:grid-cols-2 md:gap-14"
            >
              <Rise className={i % 2 === 1 ? "md:order-2" : ""}>
                <div className="relative">
                  <div className="overflow-hidden rounded-[1.5rem] border hairline">
                    <img src={row.image} alt={row.alt} className="aspect-[4/3] w-full object-cover transition-transform duration-700 hover:scale-[1.04]" loading="lazy" />
                  </div>
                  <div className="absolute -bottom-5 left-6 flex items-center gap-3 rounded-2xl border hairline bg-surface/90 px-4 py-3 shadow-[0_16px_48px_rgba(0,0,0,0.5)] backdrop-blur md:left-10">
                    <span className="check-dot text-[10px] text-white" aria-hidden>✓</span>
                    <p className="text-xs font-medium md:text-[13px]">{row.chip}</p>
                  </div>
                </div>
              </Rise>

              <Rise delay={80} className={i % 2 === 1 ? "md:order-1" : ""}>
                <div className={i % 2 === 1 ? "md:pr-6" : "md:pl-6"}>
                  <h3 className="headline-2 !text-[clamp(1.5rem,2.2vw,2rem)]">{row.title}</h3>
                  <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted">{row.copy}</p>
                  <ul className="mt-6 space-y-3">
                    {row.checks.map((c) => (
                      <li key={c} className="flex items-center gap-3 text-sm">
                        <span className="check-dot text-[10px] text-white" aria-hidden>✓</span>
                        {c}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/shop"
                    className="mt-7 inline-flex items-center gap-2 rounded-full border hairline bg-surface-2 px-5 py-2.5 text-[13px] font-medium transition-colors hover:border-white/20"
                  >
                    {row.link} <span aria-hidden>→</span>
                  </Link>
                </div>
              </Rise>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
