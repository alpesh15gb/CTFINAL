"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import QcCard, { type ShopProduct } from "./QcCard"

// Blinkit/Zepto-pattern shop browser: sticky search + scrollable category
// chips + dense 2-col grid, all client-side for instant filtering.
export default function ShopBrowser({
  products,
  categories,
}: {
  products: ShopProduct[]
  categories: { id: string; name: string }[]
}) {
  const [category, setCategory] = useState<string | null>(null)
  const [query, setQuery] = useState("")

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return products.filter((p) => {
      if (category && p.categoryId !== category) return false
      if (!q) return true
      return (
        p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
      )
    })
  }, [products, category, query])

  return (
    <div>
      {/* sticky search + category chips — quick-commerce chrome */}
      <div className="sticky top-[72px] z-30 -mx-4 bg-ink/95 px-4 py-3 backdrop-blur-md md:top-20 md:-mx-6 md:px-6">
        <div className="relative">
          <svg
            viewBox="0 0 24 24"
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search upgrades…"
            aria-label="Search upgrades"
            className="w-full rounded-full border hairline bg-surface-2 py-3 pl-11 pr-4 text-sm text-paper placeholder:text-muted focus:border-white/25 focus:outline-none"
          />
        </div>
        <div className="mt-3 flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <Chip label="All" active={category === null} onClick={() => setCategory(null)} />
          {categories.map((c) => (
            <Chip
              key={c.id}
              label={c.name}
              active={category === c.id}
              onClick={() => setCategory(c.id)}
            />
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-10 rounded-2xl border hairline bg-surface/60 p-14 text-center">
          <p className="text-base font-medium">No upgrades match.</p>
          <p className="mt-2 text-sm text-muted">
            Tell us what you&apos;re building on WhatsApp — we stock more than we list.
          </p>
          <button
            onClick={() => {
              setQuery("")
              setCategory(null)
            }}
            className="btn-secondary mt-6"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {filtered.map((p) => (
            <QcCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  )
}

function Chip({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`whitespace-nowrap rounded-full px-4 py-2 text-[13px] font-medium transition-colors ${
        active
          ? "bg-signal text-white"
          : "bg-surface-2 text-paper/70 hover:bg-surface-2/70 hover:text-paper"
      }`}
    >
      {label}
    </button>
  )
}
