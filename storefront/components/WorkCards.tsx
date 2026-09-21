import Link from "next/link"
import Rise from "./Rise"
import { fetchProducts } from "@/lib/medusa"

// REF: image build cards with arrow chip + glass title overlay
const FALLBACK = [
  { id: "w1", title: "Stage 2 Speaker Upgrade", handle: "stage-2-speaker-upgrade", image: "/images/services/audio.webp" },
  { id: "w2", title: "Nappa Leather Upholstery", handle: "nappa-leather-upholstery", image: "/images/services/upholstery.webp" },
  { id: "w3", title: "LED Projector Headlights", handle: "led-projector-headlights", image: "/images/services/lighting.webp" },
]

export default async function WorkCards() {
  const { products } = await fetchProducts(8)
  const cards =
    products.length >= 3
      ? products.slice(0, 3).map((p) => ({
          id: p.id,
          title: p.title,
          handle: p.handle,
          image: p.thumbnail ?? p.images?.[0]?.url ?? "/images/services/audio.webp",
        }))
      : FALLBACK

  return (
    <section id="builds" data-ghost="builds" className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-[1200px]">
        <Rise className="text-center">
          <h2 className="headline-2">Recent builds.</h2>
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-muted">
            Real cars, real parts, fitted this month at the studio.
          </p>
        </Rise>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card, i) => (
            <Rise key={card.id} delay={i * 70}>
              <Link href={`/shop/${card.handle}`} className="group block">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[1.25rem] border hairline transition-transform duration-500 group-hover:-translate-y-1">
                  <img
                    src={card.image}
                    alt={card.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                  />
                  <span
                    aria-hidden
                    className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-xl bg-black/45 text-sm text-white backdrop-blur transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  >
                    ↗
                  </span>
                  <div className="absolute inset-x-4 bottom-4 rounded-xl bg-black/55 p-4 backdrop-blur">
                    <p className="text-sm font-semibold leading-snug">{card.title}</p>
                    <p className="mt-1 text-xs text-white/60">Fitted at Cartunez</p>
                  </div>
                </div>
              </Link>
            </Rise>
          ))}
        </div>
      </div>
    </section>
  )
}
