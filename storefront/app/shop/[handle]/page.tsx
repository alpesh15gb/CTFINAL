import { notFound } from "next/navigation"
import { storeFetch, getRegionId, formatINR } from "@/lib/store"
import AddToCart from "@/components/shop/AddToCart"
import Footer from "@/components/Footer"

export const dynamic = "force-dynamic"

export default async function ProductPage({
  params,
}: {
  params: Promise<{ handle: string }>
}) {
  const { handle } = await params

  let product: any = null
  try {
    const regionId = await getRegionId()
    const fields = encodeURIComponent("+categories.*,+images.url")
    const data = await storeFetch<{ products: any[] }>(
      `/products?handle=${handle}&region_id=${regionId}&fields=${fields}`
    )
    product = data.products[0]
  } catch {
    /* fall through to notFound */
  }
  if (!product) notFound()

  const variant = product.variants?.[0]
  const price = variant?.calculated_price?.calculated_amount
  const images = product.images?.length
    ? product.images
    : [{ url: "/images/services/audio.webp" }]

  return (
    <main className="pt-24">
      <div className="mx-auto grid max-w-[1440px] gap-16 px-6 pb-32 md:grid-cols-2">
        <div className="flex flex-col gap-4">
          {images.map((img: { url: string }, i: number) => (
            <div key={i} className="aspect-[4/3] overflow-hidden bg-surface">
              <img
                src={img.url}
                alt={`${product.title} — view ${i + 1}`}
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>

        <div className="md:sticky md:top-28 md:self-start">
          <p className="eyebrow mb-4">
            {product.categories?.[0]?.name ?? "Upgrade"}
          </p>
          <h1 className="display-lg">{product.title}</h1>
          {price != null && (
            <p className="mt-6 font-display text-2xl font-800 text-signal">
              {formatINR(price)}
            </p>
          )}
          <p className="mt-8 text-lg leading-relaxed text-muted">
            {product.description}
          </p>

          <div className="mt-10">
            <AddToCart variantId={variant?.id} />
          </div>

          <ul className="mt-12 space-y-3 border-t hairline pt-8 text-sm text-muted">
            <li>Free installation at our S.P. Road studio, or insured pan-India courier.</li>
            <li>Fitted by Cartunez technicians — no outsourced labour.</li>
            <li>WhatsApp <a href="https://wa.me/919949695030" className="text-signal">+91 99496 95030</a> for fitment questions.</li>
          </ul>
        </div>
      </div>
      <Footer />
    </main>
  )
}
