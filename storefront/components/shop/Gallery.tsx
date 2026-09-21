"use client"

import { useState } from "react"

export default function Gallery({
  images,
  title,
}: {
  images: { url: string }[]
  title: string
}) {
  const [idx, setIdx] = useState(0)

  return (
    <div>
      <div className="aspect-square overflow-hidden rounded-2xl border hairline bg-surface-2">
        <img
          src={images[idx]?.url}
          alt={`${title} — view ${idx + 1}`}
          className="h-full w-full object-cover"
        />
      </div>
      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {images.map((im, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              aria-label={`View image ${i + 1}`}
              aria-pressed={i === idx}
              className={`h-16 w-16 flex-none overflow-hidden rounded-lg border transition-opacity ${
                i === idx ? "border-signal" : "hairline opacity-60 hover:opacity-100"
              }`}
            >
              <img src={im.url} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
