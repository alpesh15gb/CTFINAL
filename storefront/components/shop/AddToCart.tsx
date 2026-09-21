"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { addToCart } from "@/app/actions/cart"

// QC-style purchase block: quantity stepper + bordered ADD + Buy Now
export default function AddToCart({ variantId }: { variantId?: string }) {
  const [qty, setQty] = useState(1)
  const [pending, startTransition] = useTransition()
  const [added, setAdded] = useState(false)
  const router = useRouter()

  if (!variantId) return null

  const add = (buyNow = false) =>
    startTransition(async () => {
      await addToCart(variantId, qty)
      setAdded(true)
      router.refresh()
      if (buyNow) router.push("/checkout")
      else setTimeout(() => setAdded(false), 2000)
    })

  return (
    <div>
      {added && (
        <p className="mb-3 text-[13px] text-emerald-400">Added to your build list.</p>
      )}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center rounded-full border hairline bg-surface-2">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            disabled={pending}
            aria-label="Decrease quantity"
            className="px-4 py-3 text-muted transition-colors hover:text-paper"
          >
            −
          </button>
          <span className="w-8 text-center text-sm font-semibold" aria-live="polite">
            {qty}
          </span>
          <button
            onClick={() => setQty((q) => q + 1)}
            disabled={pending}
            aria-label="Increase quantity"
            className="px-4 py-3 text-muted transition-colors hover:text-paper"
          >
            +
          </button>
        </div>
        <button
          onClick={() => add()}
          disabled={pending}
          className={`rounded-full border px-8 py-3 text-sm font-semibold transition-colors disabled:opacity-50 ${
            added
              ? "border-signal bg-signal text-white"
              : "border-signal/60 text-signal hover:bg-signal hover:text-white"
          }`}
        >
          {pending ? "Adding…" : added ? "✓ Added" : `Add ${qty > 1 ? `${qty} ` : ""}to Build List`}
        </button>
        <button
          onClick={() => add(true)}
          disabled={pending}
          className="btn-primary"
        >
          Buy Now <span aria-hidden>→</span>
        </button>
      </div>
    </div>
  )
}
