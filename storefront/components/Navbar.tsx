"use client"

import { useEffect, useLayoutEffect, useRef, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import type Lenis from "lenis"
import { MOTION } from "@/lib/motion"

gsap.registerPlugin(ScrollTrigger)

const LINKS = [
  { href: "/#hero", label: "Home" },
  { href: "/#capabilities", label: "Works" },
  { href: "/shop", label: "Shop" },
  { href: "/cart", label: "Build List" },
]
const MENU_ID = "mobile-navigation"
const NAV_LOCK = "data-nav-scroll-lock"

export default function Navbar() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState("")
  const header = useRef<HTMLElement>(null)
  const logo = useRef<HTMLImageElement>(null)
  const toggle = useRef<HTMLButtonElement>(null)
  const dialog = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      setScrolled(window.scrollY > 24)
      if (pathname === "/") {
        const works = document.getElementById("capabilities")
        setActive(works && works.getBoundingClientRect().top <= 97 ? "/#capabilities" : "/#hero")
      } else {
        setActive(LINKS.find(({ href }) => !href.includes("#") && (pathname === href || pathname.startsWith(`${href}/`)))?.href ?? "")
      }
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update) }
    update()
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule)
    window.addEventListener("hashchange", schedule)
    window.addEventListener("popstate", schedule)
    window.addEventListener("cartunez:anchor-navigate", schedule)
    ScrollTrigger.addEventListener("refresh", schedule)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
      window.removeEventListener("hashchange", schedule)
      window.removeEventListener("popstate", schedule)
      window.removeEventListener("cartunez:anchor-navigate", schedule)
      ScrollTrigger.removeEventListener("refresh", schedule)
    }
  }, [pathname])

  useEffect(() => {
    const context = gsap.context(() => {
      // MOT-2/MOT-6: subtle scroll compression, with no transform in reduced motion.
      gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(logo.current, { scale: 1 }, {
          scale: 0.96,
          ease: "none",
          scrollTrigger: { start: 0, end: 160, scrub: true },
        })
      })
    }, header)
    return () => context.revert()
  }, [])

  useLayoutEffect(() => { setOpen(false) }, [pathname])

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 768px)")
    const closeOnDesktop = () => { if (desktop.matches) setOpen(false) }
    closeOnDesktop()
    desktop.addEventListener("change", closeOnDesktop)
    const closeOnHistory = () => setOpen(false)
    window.addEventListener("popstate", closeOnHistory)
    return () => {
      desktop.removeEventListener("change", closeOnDesktop)
      window.removeEventListener("popstate", closeOnHistory)
    }
  }, [])

  useLayoutEffect(() => {
    const menu = dialog.current
    if (!open || !menu) return
    // The trigger may already have lost focus when its header becomes inert.
    const returnFocus = toggle.current
    const root = document.documentElement
    const previousLock = root.getAttribute(NAV_LOCK)
    root.setAttribute(NAV_LOCK, MENU_ID)
    const overflow = [root, document.body].flatMap((element) => ["overflow-x", "overflow-y"].map((property) => ({
      element,
      property,
      value: element.style.getPropertyValue(property),
      priority: element.style.getPropertyPriority(property),
    })))
    overflow.forEach(({ element, property }) => element.style.setProperty(property, "hidden"))

    const background = Array.from(document.querySelectorAll<HTMLElement>("[data-site-content]"))
      .filter((element) => !element.inert)
    background.forEach((element) => { element.inert = true })

    const stopped = new Set<Lenis>()
    const stopCurrentLenis = () => {
      const lenis = window.__lenis
      if (lenis && !lenis.isStopped) {
        stopped.add(lenis)
        lenis.stop()
      }
    }
    stopCurrentLenis()
    window.addEventListener("cartunez:lenis-ready", stopCurrentLenis)

    const controls = () => Array.from(menu.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    )).filter((element) => element.tabIndex >= 0 && !element.closest("[inert]") && element.getClientRects().length > 0)
    const focusFirst = () => (controls()[0] ?? menu).focus({ preventScroll: true })
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault()
        setOpen(false)
      } else if (event.key === "Tab") {
        const items = controls()
        const first = items[0]
        const last = items[items.length - 1]
        if (!first || !last) {
          event.preventDefault()
          menu.focus({ preventScroll: true })
        } else if (!items.includes(document.activeElement as HTMLElement) || (event.shiftKey && document.activeElement === first)) {
          event.preventDefault()
          const next = event.shiftKey ? last : first
          next.focus({ preventScroll: true })
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus({ preventScroll: true })
        }
      }
    }
    const onFocus = (event: FocusEvent) => {
      if (event.target instanceof Node && !menu.contains(event.target)) focusFirst()
    }
    document.addEventListener("keydown", onKeyDown)
    document.addEventListener("focusin", onFocus)
    focusFirst()

    return () => {
      document.removeEventListener("keydown", onKeyDown)
      document.removeEventListener("focusin", onFocus)
      window.removeEventListener("cartunez:lenis-ready", stopCurrentLenis)
      background.forEach((element) => { if (element.inert) element.inert = false })
      overflow.forEach(({ element, property, value, priority }) => {
        // Restore only the inline state this menu still owns, including longhands.
        if (element.style.getPropertyValue(property) === "hidden" && !element.style.getPropertyPriority(property)) {
          if (value) element.style.setProperty(property, value, priority)
          else element.style.removeProperty(property)
        }
      })
      if (root.getAttribute(NAV_LOCK) === MENU_ID) {
        if (previousLock === null) root.removeAttribute(NAV_LOCK)
        else root.setAttribute(NAV_LOCK, previousLock)
      }
      const lenis = window.__lenis
      if (lenis && stopped.has(lenis) && lenis.isStopped) lenis.start()
      const focus = [returnFocus, toggle.current, header.current?.querySelector<HTMLElement>("a[href]")]
        .find((element) => element?.isConnected && !element.closest("[inert]") && element.getClientRects().length > 0)
      focus?.focus({ preventScroll: true })
      // No timeout: pending fragment navigation resumes only after unlock/focus restoration.
      window.dispatchEvent(new Event("cartunez:nav-unlocked"))
    }
  }, [open])

  useLayoutEffect(() => {
    if (!open) return
    const context = gsap.context(() => {
      // MOT-2: retain the existing 16px menu entrance, with a tighter shared stagger.
      gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo("[data-mobile-nav-link]", { y: 16, opacity: 0 }, {
          y: 0, opacity: 1, duration: MOTION.settle, stagger: MOTION.stagger, ease: MOTION.ease,
        })
      })
    }, dialog)
    return () => context.revert()
  }, [open])

  return (
    <>
      <header
        ref={header}
        inert={open}
        className={`fixed inset-x-2 top-2 z-50 rounded-t-[20px] transition-colors duration-500 motion-reduce:transition-none md:inset-x-4 md:top-4 md:rounded-t-[28px] ${
          scrolled && !open
            ? "border-b hairline bg-ink/85 backdrop-blur-md"
            : "border-b border-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-5 md:px-8">
          <Link href="/" aria-label="Cartunez home" onClick={() => setOpen(false)}>
            <img
              ref={logo}
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
                data-nav-link
                data-active={active === l.href}
                aria-current={active === l.href ? (l.href.includes("#") ? "location" : "page") : undefined}
                className="text-[13px] text-paper/70 transition-colors hover:text-paper motion-reduce:transition-none"
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
              ref={toggle}
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls={MENU_ID}
              aria-haspopup="dialog"
              onClick={() => setOpen((v) => !v)}
              className="flex h-10 w-10 flex-col items-center justify-center gap-[5px] md:hidden"
            >
              <span
                className={`h-px w-6 bg-paper transition-transform duration-300 motion-reduce:transition-none ${
                  open ? "translate-y-[3px] rotate-45" : ""
                }`}
              />
              <span
                className={`h-px w-6 bg-paper transition-transform duration-300 motion-reduce:transition-none ${
                  open ? "-translate-y-[3px] -rotate-45" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* mobile menu overlay */}
      <div
        ref={dialog}
        id={MENU_ID}
        role="dialog"
        aria-label="Main navigation"
        aria-modal={open ? true : undefined}
        tabIndex={-1}
        inert={!open}
        data-lenis-prevent
        className={`fixed inset-2 z-[60] flex flex-col overflow-y-auto rounded-[20px] bg-ink transition-opacity duration-500 motion-reduce:transition-none md:hidden ${
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
            aria-controls={MENU_ID}
            onClick={() => setOpen(false)}
            className="relative flex h-10 w-10 items-center justify-center"
          >
            <span className="absolute h-px w-6 rotate-45 bg-paper" />
            <span className="absolute h-px w-6 -rotate-45 bg-paper" />
          </button>
        </div>
        <nav className="flex flex-1 flex-col justify-center gap-1 px-7">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              data-mobile-nav-link
              data-active={active === l.href}
              aria-current={active === l.href ? (l.href.includes("#") ? "location" : "page") : undefined}
              onClick={() => setOpen(false)}
              className="border-b hairline py-4 text-2xl font-semibold tracking-tight text-paper"
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
