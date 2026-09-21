import Link from "next/link"
import { storeFetch, getRegionId, formatINR } from "@/lib/store"
import { getCart } from "@/app/actions/cart"
import ShopBrowser from "@/components/shop/ShopBrowser"
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
  let cartItems = 0
  let cartTotal = 0
  try {
    const regionId = await getRegionId()
    const fields = encodeURIComponent("+categories.*,+variants.calculated_price.*")
    const [cats, prods, cart] = await Promise.all([
      storeFetch<{ product_categories: any[] }>("/product-categories?limit=50", {}, 300),
      storeFetch<{ products: any[] }>(
        `/products?limit=60&region_id=${regionId}&fields=${fields}`,
        {},
        60
      ),
      getCart(),
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
    cartItems = cart?.items?.reduce((n: number, i: any) => n + (i.quantity ?? 1), 0) ?? 0
    cartTotal = cart?.subtotal ?? cart?.total ?? 0
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
      {live && cartItems > 0 && (
        <Link
          href="/cart"
          className="fixed inset-x-2 bottom-2 z-40 flex items-center justify-between rounded-2xl bg-signal px-5 py-3.5 text-white shadow-[0_16px_48px_rgba(225,6,0,0.35)] transition-transform hover:-translate-y-0.5 md:inset-x-4 md:bottom-4"
        >
          <span className="text-sm font-semibold">
            {cartItems} {cartItems === 1 ? "item" : "items"} · {formatINR(cartTotal)}
          </span>
          <span className="text-sm font-semibold">View Build List →</span>
        </Link>
      )}

      <Footer />
    </main>
  )
}
