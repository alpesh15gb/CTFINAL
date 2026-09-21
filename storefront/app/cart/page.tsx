import Link from "next/link"
import { getCart } from "@/app/actions/cart"
import { formatINR } from "@/lib/store"
import CartLines from "@/components/shop/CartLines"
import Footer from "@/components/Footer"

export const dynamic = "force-dynamic"

export default async function CartPage() {
  const cart = await getCart()
  const items = cart?.items ?? []

  return (
    <main className="pt-24">
      <div className="mx-auto max-w-[1100px] px-6 pb-32">
        <p className="eyebrow mb-4">Your Build</p>
        <h1 className="display-lg mb-12">Build List</h1>

        {items.length === 0 ? (
          <div className="border hairline bg-surface/40 p-16 text-center">
            <p className="text-lg text-muted">Nothing here yet.</p>
            <Link
              href="/shop"
              className="eyebrow mt-8 inline-block bg-signal px-10 py-4 text-paper transition-transform hover:scale-[1.03]"
            >
              Browse Upgrades
            </Link>
          </div>
        ) : (
          <>
            <CartLines items={items} />
            <div className="mt-10 flex flex-wrap items-center justify-between gap-6 border-t hairline pt-8">
              <div>
                <p className="eyebrow">Total</p>
                <p className="mt-2 font-display text-3xl font-900">
                  {formatINR(cart.total ?? cart.subtotal ?? 0)}
                </p>
              </div>
              <Link
                href="/checkout"
                className="eyebrow bg-signal px-10 py-4 text-paper transition-transform hover:scale-[1.03]"
              >
                Checkout
              </Link>
            </div>
          </>
        )}
      </div>
      <Footer />
    </main>
  )
}
