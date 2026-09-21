import Link from "next/link"
import { storeFetch, getRegionId } from "@/lib/store"
import ShopBrowser from "@/components/shop/ShopBrowser"
import CartBar from "@/components/shop/CartBar"
import Footer from "@/components/Footer"

export const dynamic = "force-dynamic"

// Quick-commerce shop (Blinkit/Zepto patterns, Cartunez dark theme):
// sticky search + category chips + dense ADD-button grid + floating cart bar.
export default async function ShopPage() {
  let categories: { id: string; name: string }[] = []
  let products: {
    id: string
    title: string
    handle: string
    category: string
    categoryId: string | null
    price: number | null
    variantId?: string
    image: string
  }[] = []
  let live = true
  try {
    const regionId = await getRegionId()
    const fields = encodeURIComponent("+categories.*,+variants.calculated_price.*")
    const [cats, prods] = await Promise.all([
      storeFetch<{ product_categories: any[] }>("/product-categories?limit=50", {}, 300),
      storeFetch<{ products: any[] }>(
        `/products?limit=60&region_id=${regionId}&fields=${fields}`,
        {},
        60
      ),
    ])
    categories = cats.product_categories.map((c) => ({ id: c.id, name: c.name }))
    products = prods.products.map((p: any) => ({
      id: p.id,
      title: p.title,
      handle: p.handle,
      category: p.categories?.[0]?.name ?? "Upgrade",
      categoryId: p.categories?.[0]?.id ?? null,
      price: p.variants?.[0]?.calculated_price?.calculated_amount ?? null,
      variantId: p.variants?.[0]?.id,
      image: p.thumbnail ?? p.images?.[0]?.url ?? "/images/services/audio.webp",
    }))
  } catch {
    live = false
  }

  return (
    <main className="pb-28 pt-24">
      <div className="mx-auto max-w-[1200px] px-4 md:px-6">
        {/* compact header — quick-commerce density, no display heading */}
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Shop <span className="text-signal">Cartunez</span>
            </h1>
            <p className="mt-1 text-[13px] text-muted">
              Fitted in-studio · S.P. Road, Secunderabad
            </p>
          </div>
          <p className="badge-pill">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            {live ? "In stock now" : "Store offline"}
          </p>
        </div>

        {!live ? (
          <div className="rounded-2xl border hairline bg-surface/40 p-16 text-center">
            <p className="text-xl font-semibold">Store is offline for maintenance</p>
            <p className="mt-4 text-muted">
              Call us on{" "}
              <a href="tel:+919949695030" className="text-signal">+91 99496 95030</a>{" "}
              and we&apos;ll take your order directly.
            </p>
          </div>
        ) : (
          <ShopBrowser products={products} categories={categories} />
        )}
      </div>

      {/* floating cart bar — appears once the build list has items */}
      <CartBar />

      <Footer />
    </main>
  )
}
