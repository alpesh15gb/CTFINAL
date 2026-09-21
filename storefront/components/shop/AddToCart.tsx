"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { addToCart } from "@/app/actions/cart"

export default function AddToCart({ variantId }: { variantId?: string }) {
  const [pending, startTransition] = useTransition()
  const [added, setAdded] = useState(false)
  const router = useRouter()

  if (!variantId) return null

  return (
    <div className="flex flex-wrap gap-4">
      <button
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            await addToCart(variantId, 1)
            setAdded(true)
            setTimeout(() => setAdded(false), 2500)
          })
        }
        className="eyebrow bg-signal px-10 py-4 text-paper transition-transform hover:scale-[1.03] disabled:opacity-50"
      >
        {pending ? "Adding…" : added ? "Added to Build List" : "Add to Build List"}
      </button>
      <button
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            await addToCart(variantId, 1)
            router.push("/checkout")
          })
        }
        className="eyebrow border hairline px-10 py-4 text-paper transition-colors hover:border-signal hover:text-signal disabled:opacity-50"
      >
        Buy Now
      </button>
    </div>
  )
}
