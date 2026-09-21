import Link from "next/link"
import { storeFetch, getRegionId, formatINR } from "@/lib/store"
import ProductCard from "@/components/ProductCard"
import Footer from "@/components/Footer"

export const dynamic = "force-dynamic"

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category } = await searchParams

  let categories: { id: string; name: string; handle: string }[] = []
  let products: any[] = []
  let live = true
  try {
    const regionId = await getRegionId()
    const fields = encodeURIComponent("+categories.*")
    const [cats, prods] = await Promise.all([
      storeFetch<{ product_categories: any[] }>(
        "/product-categories?limit=50",
        {},
        300
      ),
      storeFetch<{ products: any[] }>(
        `/products?limit=60&region_id=${regionId}&fields=${fields}${category ? `&category_id[]=${category}` : ""}`,
        {},
        60
      ),
    ])
    categories = cats.product_categories
    products = prods.products
  } catch {
    live = false
  }

  return (
    <main className="pt-24">
      <div className="mx-auto max-w-[1440px] px-6 pb-32">
        <p className="eyebrow mb-4">The Upgrades</p>
        <h1 className="display-lg mb-12">
          Shop <span className="text-signal">Cartunez</span>
        </h1>

        {!live ? (
          <div className="border hairline bg-surface/40 p-16 text-center">
            <p className="font-display text-xl font-800 uppercase">Store is offline for maintenance</p>
            <p className="mt-4 text-muted">
              Call us on{" "}
              <a href="tel:+919949695030" className="text-signal">+91 99496 95030</a>{" "}
              and we&apos;ll take your order directly.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-12 flex flex-wrap gap-3">
              <FilterChip label="All" href="/shop" active={!category} />
              {categories.map((c) => (
                <FilterChip
                  key={c.id}
                  label={c.name}
                  href={`/shop?category=${c.id}`}
                  active={category === c.id}
                />
              ))}
            </div>

            <div className="grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
              {products.map((p) => {
                const price = p.variants?.[0]?.calculated_price?.calculated_amount
                return (
                  <ProductCard
                    key={p.id}
                    href={`/shop/${p.handle}`}
                    title={p.title}
                    category={p.categories?.[0]?.name ?? "Upgrade"}
                    price={price != null ? formatINR(price) : ""}
                    image={p.thumbnail ?? p.images?.[0]?.url ?? "/images/services/audio.webp"}
                  />
                )
              })}
            </div>
          </>
        )}
      </div>
      <Footer />
    </main>
  )
}

function FilterChip({
  label,
  href,
  active,
}: {
  label: string
  href: string
  active: boolean
}) {
  return (
    <Link
      href={href}
      className={`eyebrow border px-5 py-2.5 transition-colors ${
        active
          ? "border-signal text-signal"
          : "hairline text-paper/70 hover:border-signal hover:text-signal"
      }`}
    >
      {label}
    </Link>
  )
}
