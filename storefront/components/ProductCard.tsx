"use client"

import Link from "next/link"

// MOT-4: image scale 1.0 -> 1.06 on hover, signal underline sweep on title
export default function ProductCard({
  href,
  title,
  category,
  price,
  image,
}: {
  href: string
  title: string
  category: string
  price: string
  image: string
}) {
  return (
    <Link href={href} className="group block bg-ink">
      <div className="aspect-[4/5] overflow-hidden bg-surface">
        <img
          src={image}
          alt={title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
        />
      </div>
      <div className="py-5">
        <p className="eyebrow mb-2">{category}</p>
        <h3 className="relative inline-block font-display text-base font-700 uppercase tracking-wide">
          {title}
          <span className="absolute -bottom-1 left-0 h-px w-0 bg-signal transition-all duration-500 group-hover:w-full" />
        </h3>
        {price && <p className="mt-2 text-sm text-muted">{price}</p>}
      </div>
    </Link>
  )
}
