import Link from "next/link"
import { getCart } from "@/app/actions/cart"
import { formatINR } from "@/lib/store"

// Floating cart bar — self-fetching; rendered on shop + product pages.
export default async function CartBar() {
  const cart = await getCart()
  const items = cart?.items?.reduce((n: number, i: any) => n + (i.quantity ?? 1), 0) ?? 0
  const total = cart?.subtotal ?? cart?.total ?? 0
  if (!items) return null

  return (
    <Link
      href="/cart"
      className="fixed inset-x-2 bottom-2 z-40 flex items-center justify-between rounded-2xl bg-signal px-5 py-3.5 text-white shadow-[0_16px_48px_rgba(225,6,0,0.35)] transition-transform hover:-translate-y-0.5 md:inset-x-4 md:bottom-4"
    >
      <span className="text-sm font-semibold">
        {items} {items === 1 ? "item" : "items"} · {formatINR(total)}
      </span>
      <span className="text-sm font-semibold">View Build List →</span>
    </Link>
  )
}
