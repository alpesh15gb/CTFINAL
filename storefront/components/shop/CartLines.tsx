"use client"

import { useTransition } from "react"
import { updateLineItem } from "@/app/actions/cart"
import { formatINR } from "@/lib/store"

export default function CartLines({ items }: { items: any[] }) {
  const [pending, startTransition] = useTransition()

  return (
    <div className={pending ? "opacity-60 transition-opacity" : "transition-opacity"}>
      {items.map((item) => {
        const unit = item.unit_price ?? 0
        return (
          <div
            key={item.id}
            className="flex flex-wrap items-center gap-6 border-b hairline py-6"
          >
            <div className="h-24 w-20 shrink-0 overflow-hidden bg-surface">
              {item.thumbnail && (
                <img src={item.thumbnail} alt={item.title} className="h-full w-full object-cover" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-display text-base font-700 uppercase">{item.product?.title ?? item.title}</p>
              <p className="mt-1 text-sm text-muted">{formatINR(unit)} each</p>
            </div>
            <div className="flex items-center border hairline">
              <QtyButton
                label="−"
                onClick={() =>
                  startTransition(() => updateLineItem(item.id, item.quantity - 1))
                }
              />
              <span className="w-10 text-center text-sm">{item.quantity}</span>
              <QtyButton
                label="+"
                onClick={() =>
                  startTransition(() => updateLineItem(item.id, item.quantity + 1))
                }
              />
            </div>
            <p className="w-28 text-right font-display font-700">
              {formatINR(unit * item.quantity)}
            </p>
          </div>
        )
      })}
    </div>
  )
}

function QtyButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-2 text-lg text-muted transition-colors hover:text-signal"
      aria-label={label === "+" ? "Increase quantity" : "Decrease quantity"}
    >
      {label}
    </button>
  )
}
