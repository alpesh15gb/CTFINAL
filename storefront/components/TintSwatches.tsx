"use client"

import { useState } from "react"

// Paint-the-light swatches — dispatch `hero-tint`, consumed by HeroLight.
// `filter` hue-shifts the lit frame so the car genuinely repaints.
const SWATCHES = [
  { name: "Satin Red", color: "#e10600", filter: "saturate(1.2)" },
  { name: "Volt Blue", color: "#02bbfc", filter: "hue-rotate(200deg) saturate(1.25)" },
  { name: "Pearl White", color: "#f5f4f0", filter: "saturate(0.18) brightness(1.18)" },
]

export default function TintSwatches() {
  const [active, setActive] = useState(0)

  return (
    <div className="relative flex items-center justify-center gap-3">
      <span className="mr-1 text-xs text-muted">Paint the light</span>
      {SWATCHES.map((s, i) => (
        <button
          key={s.color}
          type="button"
          title={s.name}
          aria-label={`Light color: ${s.name}`}
          aria-pressed={active === i}
          onClick={() => {
            setActive(i)
            window.dispatchEvent(
              new CustomEvent("hero-tint", { detail: { color: s.color, filter: s.filter } })
            )
          }}
          className={`h-6 w-6 rounded-full border transition-all duration-300 ${
            active === i
              ? "scale-110 border-white/70"
              : "border-white/20 hover:scale-105 hover:border-white/40"
          }`}
          style={{ background: s.color }}
        />
      ))}
    </div>
  )
}
