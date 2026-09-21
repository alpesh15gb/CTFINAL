"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

// REQ-SEC-2 — MOT-3: pinned panels, index parallaxes at 0.5x
const PILLARS = [
  {
    index: "01",
    title: "The Personal Space",
    copy: "Precision floor mats, Nappa leather retrims, climate sunshades, ergonomic support. Your cabin, tailored like a suit.",
    image: "/images/services/upholstery.webp",
    alt: "Custom black leather upholstery with red stitching",
  },
  {
    index: "02",
    title: "The Sensory Experience",
    copy: "Component audio, DSP tuning, Android infotainment, ambient light. Every drive gets a soundtrack and a mood.",
    image: "/images/services/audio.webp",
    alt: "Custom amplifier rack with red accents in a dark trunk build",
  },
  {
    index: "03",
    title: "The Driving Character",
    copy: "ECU calibration, flow-formed alloys, intake and stance. The way it responds becomes unmistakably yours.",
    image: "/images/services/ecu.webp",
    alt: "ECU remapping software with red torque curves on a laptop",
  },
]

export default function Pillars() {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const root = rootRef.current
    if (!root) return

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-pillar-index]").forEach((el) => {
        gsap.fromTo(
          el,
          { yPercent: 20 },
          {
            yPercent: -20,
            ease: "none",
            scrollTrigger: {
              trigger: el.closest("[data-pillar]"),
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          }
        )
      })
      gsap.utils.toArray<HTMLElement>("[data-pillar-img]").forEach((el) => {
        gsap.fromTo(
          el,
          { scale: 1.12 },
          {
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          }
        )
      })
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <section id="pillars" ref={rootRef} className="border-t hairline">
      {PILLARS.map((p, i) => (
        <article
          key={p.index}
          data-pillar
          className={`relative grid min-h-[90vh] items-center gap-10 overflow-hidden border-b hairline px-6 py-24 md:grid-cols-2 md:px-[6%] ${
            i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""
          }`}
        >
          <span
            data-pillar-index
            aria-hidden
            className="pointer-events-none absolute -top-6 right-4 font-display text-[11rem] font-900 leading-none text-surface md:text-[18rem]"
          >
            {p.index}
          </span>
          <div className="relative z-10 max-w-lg">
            <p className="eyebrow mb-6">{p.index} / 03</p>
            <h3 className="display-lg">{p.title}</h3>
            <p className="mt-8 text-lg text-muted">{p.copy}</p>
          </div>
          <div className="relative z-10 aspect-[4/5] w-full overflow-hidden md:aspect-[4/3]">
            <img
              data-pillar-img
              src={p.image}
              alt={p.alt}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        </article>
      ))}
    </section>
  )
}
