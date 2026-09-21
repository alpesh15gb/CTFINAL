import Link from "next/link"
import { notFound } from "next/navigation"
import { storeFetch, getRegionId, formatINR } from "@/lib/store"
import AddToCart from "@/components/shop/AddToCart"
import Gallery from "@/components/shop/Gallery"
import CartBar from "@/components/shop/CartBar"
import QcCard, { type ShopProduct } from "@/components/shop/QcCard"
import Footer from "@/components/Footer"

export const dynamic = "force-dynamic"

export default async function ProductPage({
  params,
}: {
  params: Promise<{ handle: string }>
}) {
  const { handle } = await params

  let product: any = null
  let related: ShopProduct[] = []
  try {
    const regionId = await getRegionId()
    const fields = encodeURIComponent(
      "+categories.*,+images.*,+variants.calculated_price.*"
    )
    const data = await storeFetch<{ products: any[] }>(
      `/products?handle=${handle}&region_id=${regionId}&fields=${fields}`
    )
    product = data.products[0]
    if (product) {
      // QC "pairs well with": same category, excluding this product
      const catId = product.categories?.[0]?.id
      if (catId) {
        const r = await storeFetch<{ products: any[] }>(
          `/products?limit=5&region_id=${regionId}&category_id[]=${catId}&fields=${fields}`
        )
        related = r.products
          .filter((p: any) => p.handle !== handle)
          .slice(0, 4)
          .map((p: any) => ({
            id: p.id,
            title: p.title,
            handle: p.handle,
            category: p.categories?.[0]?.name ?? "Upgrade",
            categoryId: p.categories?.[0]?.id ?? null,
            price: p.variants?.[0]?.calculated_price?.calculated_amount ?? null,
            variantId: p.variants?.[0]?.id,
            image: p.thumbnail ?? p.images?.[0]?.url ?? "/images/services/audio.webp",
          }))
      }
    }
  } catch {
    /* fall through to notFound */
  }
  if (!product) notFound()

  const variant = product.variants?.[0]
  const price = variant?.calculated_price?.calculated_amount
  const images = product.images?.length
    ? product.images
    : [{ url: "/images/services/audio.webp" }]
  const category = product.categories?.[0]?.name ?? "Upgrade"

  return (
    <main className="pt-24">
      <div className="mx-auto max-w-[1200px] px-4 pb-28 md:px-6">
        {/* breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-[13px] text-muted" aria-label="Breadcrumb">
          <Link href="/shop" className="transition-colors hover:text-paper">
            ← Shop
          </Link>
          <span aria-hidden>/</span>
          <span className="text-paper/70">{category}</span>
        </nav>

        <div className="grid gap-10 md:grid-cols-2 md:gap-14">
          <Gallery images={images} title={product.title} />

          <div className="md:sticky md:top-24 md:self-start">
            <span className="badge-pill">{category}</span>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight">
              {product.title}
            </h1>
            {price != null && (
              <p className="mt-4 text-2xl font-semibold">{formatINR(price)}</p>
            )}
            <p className="mt-5 text-[15px] leading-relaxed text-muted">
              {product.description}
            </p>

            <div className="mt-8">
              <AddToCart variantId={variant?.id} />
            </div>

            <ul className="mt-10 space-y-4 border-t hairline pt-8">
              <li className="flex items-start gap-3 text-sm text-muted">
                <span className="check-dot mt-0.5 text-[10px] text-white" aria-hidden>
                  ✓
                </span>
                <span>
                  WhatsApp{" "}
                  <a
                    href="https://wa.me/919949695030"
                    className="text-signal"
                    target="_blank"
                    rel="noreferrer"
                  >
                    +91 99496 95030
                  </a>{" "}
                  for fitment questions.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-24">
            <h2 className="text-xl font-semibold tracking-tight">Pairs well with.</h2>
            <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
              {related.map((p) => (
                <QcCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>

      <CartBar />
      <Footer />
    </main>
  )
}
