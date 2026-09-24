"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import Lenis from "lenis"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { MOTION } from "@/lib/motion"

gsap.registerPlugin(ScrollTrigger)

const NAV_OFFSET = 96
const NAV_LOCK = "data-nav-scroll-lock"
// Exactly the condition that creates the Lenis instance below.
const SMOOTH_QUERY = `${MOTION.desktop} and (prefers-reduced-motion: no-preference)`

declare global {
  interface Window {
    __lenis?: Lenis
  }
}

// Fragment IDs are data, not selectors (including encoded punctuation).
function hashTarget(hash: string) {
  try {
    const id = decodeURIComponent(hash.slice(1))
    if (!id) return null
    const target = document.getElementById(id)
    return target instanceof HTMLElement ? target : null
  } catch {
    return null
  }
}

function focusTarget(target: HTMLElement) {
  if (target.hasAttribute("tabindex")) {
    target.focus({ preventScroll: true })
    return
  }
  // Removing tabindex in this tick makes the element unfocusable, which drops
  // focus back to <body> and sends the next Tab to the top of the document.
  target.setAttribute("tabindex", "-1")
  target.addEventListener("blur", () => target.removeAttribute("tabindex"), { once: true })
  target.focus({ preventScroll: true })
}

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const previousPath = useRef<string | null>(null)
  const restoring = useRef(false)

  useEffect(() => {
    const context = gsap.context(() => {
      const media = gsap.matchMedia()
      media.add({ desktop: MOTION.desktop, reduced: MOTION.reduced }, ({ conditions }) => {
        // MOT-6: touch stays native; changing the preference destroys the instance.
        if (!conditions?.desktop || conditions.reduced) return
        const lenis = new Lenis({ lerp: 0.1, smoothWheel: true, syncTouch: false, anchors: false })
        window.__lenis = lenis
        lenis.on("scroll", ScrollTrigger.update)
        const tick = (time: number) => lenis.raf(time * 1000)
        gsap.ticker.add(tick)
        // Navbar owns stop/start, including instances created while its dialog is open.
        window.dispatchEvent(new Event("cartunez:lenis-ready"))

        return () => {
          gsap.ticker.remove(tick)
          lenis.off("scroll", ScrollTrigger.update)
          if (window.__lenis === lenis) delete window.__lenis
          lenis.destroy()
        }
      })
    })
    return () => context.revert()
  }, [])

  useEffect(() => {
    const routeChanged = previousPath.current !== null && previousPath.current !== pathname
    const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined
    const restoreScroll = restoring.current || (!routeChanged && !!navigation && navigation.type !== "navigate")
    previousPath.current = pathname
    restoring.current = false
    if (routeChanged && window.__lenis?.isScrolling === "smooth") {
      window.__lenis.scrollTo(window.scrollY, { immediate: true })
    }

    const content = document.querySelector<HTMLElement>("[data-site-content]")
    const scope = content ?? document.querySelector("main")
    let disposed = false
    let refreshFrame = 0
    let pendingAnchor: (() => void) | null = null
    let landingHash = restoreScroll ? "" : window.location.hash
    let landingFocused = false

    const context = gsap.context(() => {
      // MOT-2/MOT-6: a small, non-blocking route entry; never hide the page or navbar.
      if (routeChanged && !restoreScroll && content) {
        gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
          gsap.fromTo(content, { opacity: 0.94 }, {
            opacity: 1, duration: MOTION.micro, ease: MOTION.ease, clearProps: "opacity",
          })
        })
      }
    })

    const isLocked = () => document.documentElement.hasAttribute(NAV_LOCK)
    const scrollToY = (top: number, immediate: boolean) => {
      const lenis = window.__lenis
      // Trust the instance only while its own condition holds: after a viewport
      // change it survives for a tick, and a hand-off to it loses the scroll.
      if (lenis && window.matchMedia(SMOOTH_QUERY).matches) {
        lenis.scrollTo(top, { immediate })
      } else {
        window.scrollTo({ top, behavior: "instant" })
      }
    }
    const scrollToTarget = (target: HTMLElement, immediate: boolean) => {
      // Measure after the menu has restored overflow and Lenis has resized.
      scrollToY(Math.max(0, window.scrollY + target.getBoundingClientRect().top - NAV_OFFSET), immediate)
    }

    const refresh = () => {
      refreshFrame = 0
      // A locked menu is a different layout: measuring it would bake overlay state
      // into every trigger. onUnlock re-schedules once the page is scrollable again.
      if (disposed || isLocked()) return
      window.__lenis?.resize()
      const y = window.scrollY
      // GSAP re-measures trigger start/end positions from the top of the document and
      // can restore a stale cached offset, which snaps an anchor jump back to 0.
      ScrollTrigger.refresh()
      if (window.scrollY !== y) scrollToY(y, true)
      // Reconcile a landing fragment as fonts/images/streamed content settle, but
      // stop as soon as the user interacts. Never fight native history restoration.
      const target = landingHash && hashTarget(landingHash)
      if (target) {
        scrollToTarget(target, true)
        if (!landingFocused) {
          focusTarget(target)
          landingFocused = true
        }
      }
    }
    const scheduleRefresh = () => {
      if (!disposed && !refreshFrame) refreshFrame = requestAnimationFrame(refresh)
    }
    const cancelLanding = () => { landingHash = "" }
    const onHistory = () => {
      restoring.current = window.location.pathname !== pathname
      pendingAnchor = null
      cancelLanding()
      // Cancel outstanding inertia at the current position, then let the browser
      // restore its entry. The next layout frame resyncs Lenis to that native scroll.
      const lenis = window.__lenis
      if (lenis?.isScrolling === "smooth" && !isLocked()) {
        lenis.scrollTo(window.scrollY, { immediate: true })
      }
      scheduleRefresh()
    }
    const onUnlock = () => {
      window.__lenis?.resize()
      const navigate = pendingAnchor
      pendingAnchor = null
      navigate?.()
      scheduleRefresh()
    }
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      const anchor = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null
      if (!anchor || anchor.hasAttribute("download") || (anchor.target && anchor.target.toLowerCase() !== "_self")) return
      let url: URL
      try { url = new URL(anchor.href, window.location.href) } catch { return }
      if (url.origin !== window.location.origin || url.pathname !== window.location.pathname || url.search !== window.location.search || !url.hash) return
      const target = hashTarget(url.hash)
      if (!target) return

      // Capture runs before Next Link's router handler, but does not stop React's
      // onClick: the mobile link still closes its dialog before we move/focus.
      event.preventDefault()
      cancelLanding()
      const navigate = () => {
        if (!target.isConnected) return
        // Keep Next's existing history state and normal Back/Forward entries.
        // No history monkey-patching or scrollRestoration changes.
        if (window.location.href !== url.href) window.history.pushState(window.history.state, "", url.href)
        focusTarget(target)
        scrollToTarget(target, false)
        window.dispatchEvent(new Event("cartunez:anchor-navigate"))
      }
      if (isLocked()) pendingAnchor = navigate
      else navigate()
    }

    document.addEventListener("click", onClick, true)
    window.addEventListener("cartunez:nav-unlocked", onUnlock)
    window.addEventListener("popstate", onHistory)
    window.addEventListener("hashchange", onHistory)
    window.addEventListener("wheel", cancelLanding, { passive: true })
    window.addEventListener("touchstart", cancelLanding, { passive: true })
    window.addEventListener("pointerdown", cancelLanding, { passive: true })
    window.addEventListener("keydown", cancelLanding)
    window.addEventListener("resize", scheduleRefresh)
    scope?.addEventListener("load", scheduleRefresh, true)
    scope?.addEventListener("error", scheduleRefresh, true)
    document.fonts.addEventListener("loadingdone", scheduleRefresh)
    void document.fonts.ready.then(scheduleRefresh)

    const resizeObserver = new ResizeObserver(scheduleRefresh)
    if (scope) resizeObserver.observe(scope)
    // Only watch insertions while a deep-link target is still missing, not every
    // hero HUD update. Resize/image/font listeners cover subsequent layout shifts.
    const targetObserver = new MutationObserver(() => {
      if (!landingHash || hashTarget(landingHash)) {
        targetObserver.disconnect()
        scheduleRefresh()
      }
    })
    if (scope && landingHash && !hashTarget(landingHash)) {
      targetObserver.observe(scope, { childList: true, subtree: true })
    }
    scheduleRefresh()

    return () => {
      disposed = true
      pendingAnchor = null
      cancelAnimationFrame(refreshFrame)
      context.revert()
      resizeObserver.disconnect()
      targetObserver.disconnect()
      document.removeEventListener("click", onClick, true)
      window.removeEventListener("cartunez:nav-unlocked", onUnlock)
      window.removeEventListener("popstate", onHistory)
      window.removeEventListener("hashchange", onHistory)
      window.removeEventListener("wheel", cancelLanding)
      window.removeEventListener("touchstart", cancelLanding)
      window.removeEventListener("pointerdown", cancelLanding)
      window.removeEventListener("keydown", cancelLanding)
      window.removeEventListener("resize", scheduleRefresh)
      scope?.removeEventListener("load", scheduleRefresh, true)
      scope?.removeEventListener("error", scheduleRefresh, true)
      document.fonts.removeEventListener("loadingdone", scheduleRefresh)
    }
  }, [pathname])

  return <>{children}</>
}
