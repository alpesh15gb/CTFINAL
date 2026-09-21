import Link from "next/link"
import { storeFetch, formatINR } from "@/lib/store"
import Footer from "@/components/Footer"

export const dynamic = "force-dynamic"

export default async function OrderPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  let order: any = null
  try {
    const data = await storeFetch<{ order: any }>(`/orders/${id}`)
    order = data.order
  } catch {
    /* show generic confirmation */
  }

  return (
    <main className="pt-24">
      <div className="mx-auto max-w-[900px] px-6 pb-32 text-center">
        <p className="eyebrow mb-6 text-signal">Order Placed</p>
        <h1 className="display-xl">
          It&apos;s <span className="text-signal">on.</span>
        </h1>
        <p className="mx-auto mt-8 max-w-xl text-lg text-muted">
          Your build list is with the studio. We&apos;ll WhatsApp you within
          working hours to schedule installation or confirm courier details.
        </p>

        {order && (
          <div className="mx-auto mt-12 max-w-md border hairline bg-surface/40 p-8 text-left">
            <p className="eyebrow mb-4">Order Reference</p>
            <p className="font-display text-xl font-700">{order.display_id != null ? `#${order.display_id}` : order.id}</p>
            <div className="mt-6 space-y-3 text-sm">
              {(order.items ?? []).map((item: any) => (
                <div key={item.id} className="flex justify-between gap-4">
                  <span className="text-muted">{item.quantity} × {item.title}</span>
                  <span>{formatINR(item.unit_price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-between border-t hairline pt-4 font-display font-800">
              <span>Total</span>
              <span className="text-signal">{formatINR(order.total)}</span>
            </div>
          </div>
        )}

        <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href={`https://wa.me/919949695030?text=${encodeURIComponent(`Hi Cartunez, just placed order ${order?.display_id ?? id}.`)}`}
            target="_blank"
            rel="noreferrer"
            className="eyebrow bg-signal px-10 py-4 text-paper transition-transform hover:scale-[1.03]"
          >
            Confirm on WhatsApp
          </a>
          <Link
            href="/shop"
            className="eyebrow border hairline px-10 py-4 text-paper transition-colors hover:border-signal hover:text-signal"
          >
            Keep Browsing
          </Link>
        </div>
      </div>
      <Footer />
    </main>
  )
}
