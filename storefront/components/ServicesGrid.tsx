import Reveal from "./Reveal"

// REQ-SEC-4
const SERVICES = [
  {
    title: "Upholstery & Cabin",
    copy: "Nappa retrims, 7D mats, sunshades, lumbar support — fitted with factory-level finish.",
    image: "/images/services/upholstery.webp",
  },
  {
    title: "Audio & Infotainment",
    copy: "Speakers, DSP amps, subwoofers, Android screens, dashcams — tuned, not just installed.",
    image: "/images/services/audio.webp",
  },
  {
    title: "Lighting",
    copy: "64-colour ambient kits, projector retrofits, aimed and routed to OEM standard.",
    image: "/images/services/lighting.webp",
  },
  {
    title: "Alloy Wheels",
    copy: "Flow-formed performance wheels with fitting, balancing and alignment done in-house.",
    image: "/images/services/wheels.webp",
  },
  {
    title: "ECU Remapping",
    copy: "Stage 1 calibrations on stock hardware — dyno-backed maps, stock file archived.",
    image: "/images/services/ecu.webp",
  },
]

export default function ServicesGrid() {
  return (
    <section className="border-t hairline">
      <div className="mx-auto max-w-[1440px] px-6 py-32">
        <Reveal>
          <p className="eyebrow mb-6">The Upgrades</p>
          <h2 className="display-lg max-w-3xl">Everything your car is missing</h2>
        </Reveal>
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.08}>
              <div className="group border hairline bg-surface/40 p-6 transition-colors hover:border-signal/60">
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={s.image}
                    alt={s.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                  />
                </div>
                <h3 className="mt-6 font-display text-xl font-800 uppercase">{s.title}</h3>
                <p className="mt-3 text-muted">{s.copy}</p>
              </div>
            </Reveal>
          ))}
          <Reveal delay={SERVICES.length * 0.08}>
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "919949695030"}`}
              target="_blank"
              rel="noreferrer"
              className="flex h-full min-h-[280px] flex-col items-start justify-between border border-signal/60 bg-signal/10 p-6 transition-colors hover:bg-signal/20"
            >
              <span className="eyebrow text-signal">Not listed?</span>
              <span className="font-display text-2xl font-800 uppercase leading-tight">
                If it makes your car more yours, we do it. Ask us.
              </span>
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
