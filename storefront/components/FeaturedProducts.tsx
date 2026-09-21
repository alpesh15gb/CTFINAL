import Link from "next/link"
import Reveal from "./Reveal"
import { fetchProducts } from "@/lib/medusa"
import { formatINR } from "@/lib/store"
import ProductCard from "./ProductCard"

// REQ-SEC-3 — featured products live from Medusa (static fallback per ARCHITECTURE)
const FALLBACK = [
  { id: "f1", title: "Stage 2 Speaker Upgrade Package", handle: "stage-2-speaker-upgrade", price: 24999, image: "/images/services/audio.webp" },
  { id: "f2", title: "Nappa Leather Seat Upholstery", handle: "nappa-leather-upholstery", price: 34999, image: "/images/services/upholstery.webp" },
  { id: "f3", title: "Ambient LED Cabin Kit — 64 Colour", handle: "ambient-led-kit-64", price: 8999, image: "/images/services/lighting.webp" },
  { id: "f4", title: "17\" Performance Alloy Wheels (Set of 4)", handle: "performance-alloys-17", price: 48999, image: "/images/services/wheels.webp" },
]

export default async function FeaturedProducts() {
  const { products, live } = await fetchProducts(4)

  return (
    <section className="border-t hairline">
      <div className="mx-auto max-w-[1440px] px-6 py-32">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow mb-6">The Catalog</p>
              <h2 className="display-lg">
                Small details. <span className="text-signal">Big</span> difference.
              </h2>
            </div>
            <Link href="/shop" className="eyebrow border hairline px-6 py-3 transition-colors hover:border-signal hover:text-signal">
              View All Upgrades
            </Link>
          </div>
        </Reveal>

        <div className="mt-16 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
          {live && products.length > 0
            ? products.map((p) => {
                const price = p.variants?.[0]?.calculated_price?.calculated_amount
                return (
                  <ProductCard
                    key={p.id}
                    href={`/shop/${p.handle}`}
                    title={p.title}
                    category={p.categories?.[0]?.name ?? "Upgrade"}
                    price={price ? formatINR(price) : ""}
                    image={p.thumbnail ?? p.images?.[0]?.url ?? "/images/services/audio.webp"}
                  />
                )
              })
            : FALLBACK.map((p) => (
                <ProductCard
                  key={p.id}
                  href={`/shop/${p.handle}`}
                  title={p.title}
                  category="Upgrade"
                  price={formatINR(p.price)}
                  image={p.image}
                />
              ))}
        </div>
      </div>
    </section>
  )
}
