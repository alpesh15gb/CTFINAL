import Link from "next/link"
import Reveal from "./Reveal"

// REQ-SEC-5
export default function ConversionBanner() {
  return (
    <section className="relative overflow-hidden border-t hairline">
      <img
        src="/sequences/hero/frame-13.webp"
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover opacity-30"
      />
      <div className="relative z-10 mx-auto flex max-w-[1440px] flex-col items-center px-6 py-40 text-center">
        <Reveal>
          <h2 className="display-xl">
            Good taste. <span className="text-signal">Great drives.</span>
            <br />
            Start here.
          </h2>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row">
            <Link
              href="/shop"
              className="eyebrow bg-signal px-10 py-5 text-paper transition-transform hover:scale-[1.03]"
            >
              Browse Upgrades
            </Link>
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "919949695030"}?text=${encodeURIComponent("Hi Cartunez, I want to plan a build for my car.")}`}
              target="_blank"
              rel="noreferrer"
              className="eyebrow border hairline bg-ink/60 px-10 py-5 text-paper transition-colors hover:border-signal hover:text-signal"
            >
              Plan My Build on WhatsApp
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
