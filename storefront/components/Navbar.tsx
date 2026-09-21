"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

const LINKS = [
  { href: "#experience", label: "Experience" },
  { href: "#pillars", label: "Upgrades" },
  { href: "#visit", label: "Visit" },
  { href: "/shop", label: "Shop" },
  { href: "/cart", label: "Build List" },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        scrolled
          ? "bg-ink/85 backdrop-blur-md border-b hairline"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-4">
        <Link href="/" className="font-display text-lg font-900 tracking-[0.3em] uppercase">
          Cartunez
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="eyebrow text-paper/80 transition-colors hover:text-signal"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <a
          href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "919949695030"}`}
          target="_blank"
          rel="noreferrer"
          className="eyebrow border hairline px-4 py-2 text-paper transition-colors hover:border-signal hover:text-signal"
        >
          Book a Build
        </a>
      </div>
    </header>
  )
}
