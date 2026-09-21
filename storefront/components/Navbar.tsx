"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

const LINKS = [
  { href: "/#hero", label: "Home" },
  { href: "/#capabilities", label: "Works" },
  { href: "/shop", label: "Shop" },
  { href: "/cart", label: "Build List" },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // lock Lenis + native scroll while the mobile menu is open
  useEffect(() => {
    const lenis = window.__lenis
    if (open) {
      lenis?.stop()
      document.documentElement.style.overflow = "hidden"
    } else {
      lenis?.start()
      document.documentElement.style.overflow = ""
    }
    return () => {
      lenis?.start()
      document.documentElement.style.overflow = ""
    }
  }, [open])

  return (
    <>
      <header
        className={`fixed inset-x-2 top-2 z-50 rounded-t-[20px] transition-colors duration-500 md:inset-x-4 md:top-4 md:rounded-t-[28px] ${
          scrolled && !open
            ? "border-b hairline bg-ink/85 backdrop-blur-md"
            : "border-b border-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-5 md:px-8">
          <Link href="/" aria-label="Cartunez home" onClick={() => setOpen(false)}>
            <img
              src="/images/cartunez-logo.png"
              alt="Cartunez — Get your car rolling in style"
              className="h-9 w-9 [mix-blend-mode:screen] md:h-10 md:w-10"
            />
          </Link>
          <nav className="hidden items-center gap-7 md:flex">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-[13px] text-paper/70 transition-colors hover:text-paper"
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "919949695030"}`}
              target="_blank"
              rel="noreferrer"
              className="btn-primary !hidden !px-5 !py-2.5 !text-[13px] md:!inline-flex"
            >
              Book a Build <span aria-hidden>→</span>
            </a>
            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="flex h-10 w-10 flex-col items-center justify-center gap-[5px] md:hidden"
            >
              <span
                className={`h-px w-6 bg-paper transition-transform duration-300 ${
                  open ? "translate-y-[3px] rotate-45" : ""
                }`}
              />
              <span
                className={`h-px w-6 bg-paper transition-transform duration-300 ${
                  open ? "-translate-y-[3px] -rotate-45" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* mobile menu overlay */}
      <div
        className={`fixed inset-2 z-[60] flex flex-col rounded-[20px] bg-ink transition-opacity duration-500 md:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!open}
      >
        <div className="flex items-center justify-between px-5 py-3">
          <img
            src="/images/cartunez-logo.png"
            alt=""
            className="h-9 w-9 [mix-blend-mode:screen]"
          />
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="relative flex h-10 w-10 items-center justify-center"
          >
            <span className="absolute h-px w-6 rotate-45 bg-paper" />
            <span className="absolute h-px w-6 -rotate-45 bg-paper" />
          </button>
        </div>
        <nav className="flex flex-1 flex-col justify-center gap-1 px-7">
          {LINKS.map((l, i) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`border-b hairline py-4 text-2xl font-semibold tracking-tight text-paper transition-all duration-500 ${
                open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
              style={{ transitionDelay: open ? `${120 + i * 60}ms` : "0ms" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <p className="px-7 pb-10 text-[13px] text-muted">Get your car rolling in style.</p>
      </div>
    </>
  )
}
