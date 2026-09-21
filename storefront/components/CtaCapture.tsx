"use client"

import { useState } from "react"
import Rise from "./Rise"

// REF: capture CTA — panel with signal glow; submit deep-links WhatsApp so
// nothing is silently stored.
const WA = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "919949695030"}`

export default function CtaCapture() {
  const [contact, setContact] = useState("")

  return (
    <section id="cta" data-ghost="cta" className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-[1200px]">
        <Rise>
          <div className="panel relative overflow-hidden px-7 py-12 md:px-12 md:py-16">
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-40 left-1/2 h-[420px] w-[720px] max-w-none -translate-x-1/2 rounded-full [background:radial-gradient(closest-side,rgba(255,59,46,0.45),rgba(225,6,0,0.12)_60%,transparent_75%)] blur-2xl"
            />
            <div className="relative grid items-center gap-10 md:grid-cols-2">
              <div>
                <h2 className="headline-2 text-balance">
                  Transform your ride with Cartunez.
                </h2>
                <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted">
                  Drop your number or email — we reply within the hour with a
                  quote, parts list and a fitting slot.
                </p>
              </div>
              <form
                className="flex flex-col gap-3 sm:flex-row"
                onSubmit={(e) => {
                  e.preventDefault()
                  const text = encodeURIComponent(
                    `Hi Cartunez! I'd like a quote for my car. Reach me at ${contact}`
                  )
                  window.open(`${WA}?text=${text}`, "_blank", "noopener")
                }}
              >
                <input
                  type="text"
                  required
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="Email or phone"
                  aria-label="Email or phone"
                  className="w-full flex-1 rounded-full border hairline bg-surface-2 px-5 py-3.5 text-sm text-paper placeholder:text-muted focus:border-white/25 focus:outline-none"
                />
                <button type="submit" className="btn-primary justify-center whitespace-nowrap">
                  Get Started <span aria-hidden>→</span>
                </button>
              </form>
            </div>
          </div>
        </Rise>
      </div>
    </section>
  )
}
