"use client"

import Link from "next/link"
import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { addToCart } from "@/app/actions/cart"
import { formatINR } from "@/lib/store"

// Blinkit/Zepto-style product card: image, meta, price + bordered ADD.
export type ShopProduct = {
  id: string
  title: string
  handle: string
  category: string
  categoryId: string | null
  price: number | null
  variantId?: string
  image: string
}

export default function QcCard({ product }: { product: ShopProduct }) {
  const [pending, startTransition] = useTransition()
  const [added, setAdded] = useState(false)
  const router = useRouter()

  const add = () => {
    if (!product.variantId) return
    startTransition(async () => {
      await addToCart(product.variantId!, 1)
      setAdded(true)
      router.refresh() // updates the floating cart bar
      setTimeout(() => setAdded(false), 2000)
    })
  }

  return (
    <div className="group flex flex-col rounded-2xl border hairline bg-surface p-2.5 transition-colors hover:border-white/15">
      <Link href={`/shop/${product.handle}`} className="block overflow-hidden rounded-xl bg-surface-2">
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
      </Link>
      <div className="flex flex-1 flex-col px-1 pt-2">
        <p className="text-[11px] text-muted">{product.category}</p>
        <Link href={`/shop/${product.handle}`} className="mt-0.5">
          <h3 className="line-clamp-2 min-h-[2.4em] text-[13.5px] font-medium leading-snug text-paper">
            {product.title}
          </h3>
        </Link>
        <div className="mt-auto flex items-center justify-between pt-2.5">
          <p className="text-[15px] font-semibold">
            {product.price != null ? formatINR(product.price) : "—"}
          </p>
          {product.variantId ? (
            <button
              onClick={add}
              disabled={pending}
              aria-label={`Add ${product.title} to build list`}
              className={`rounded-lg border px-3.5 py-1.5 text-[12px] font-bold uppercase tracking-wide transition-colors disabled:opacity-50 ${
                added
                  ? "border-signal bg-signal text-white"
                  : "border-signal/50 text-signal hover:bg-signal hover:text-white"
              }`}
            >
              {pending ? "…" : added ? "✓ Added" : "Add"}
            </button>
          ) : (
            <span className="rounded-lg border hairline px-3 py-1.5 text-[11px] text-muted">
              In store
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
