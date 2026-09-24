"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { gsap } from "gsap"
import { MOTION } from "@/lib/motion"

export default function MotionEffects() {
  const pathname = usePathname()

  useEffect(() => {
    const media = gsap.matchMedia()
    media.add(`${MOTION.desktop} and (prefers-reduced-motion: no-preference)`, () => {
      let active: HTMLElement | null = null
      let bounds: DOMRect | null = null
      let card = false
      let frame = 0
      let clientX = 0
      let clientY = 0
      const touched = new Set<HTMLElement>()
      const context = gsap.context(() => {})

      const release = () => context.add(() => {
        cancelAnimationFrame(frame)
        frame = 0
        if (!active) return
        active.removeAttribute("data-motion-active")
        gsap.to(active, { x: 0, y: 0, rotationX: 0, rotationY: 0, duration: MOTION.settle, ease: MOTION.ease, overwrite: true })
        const icon = active.querySelector("span[aria-hidden]")
        if (!card && icon) gsap.to(icon, { x: 0, y: 0, duration: MOTION.settle, ease: MOTION.ease, overwrite: true })
        active = null
        bounds = null
      })
      const paint = () => context.add(() => {
        frame = 0
        if (!active || !bounds) return
        const x = Math.max(-1, Math.min(1, (clientX - bounds.left) / bounds.width * 2 - 1))
        const y = Math.max(-1, Math.min(1, (clientY - bounds.top) / bounds.height * 2 - 1))
        if (card) {
          gsap.to(active, { rotationX: -y * 1.2, rotationY: x * 1.2, transformPerspective: 1000, duration: MOTION.micro, ease: MOTION.ease, overwrite: true })
          active.style.setProperty("--glare-x", `${(x + 1) * 50}%`)
          active.style.setProperty("--glare-y", `${(y + 1) * 50}%`)
        } else {
          gsap.to(active, { x: x * 5, y: y * 4, duration: MOTION.micro, ease: MOTION.ease, overwrite: true })
          const icon = active.querySelector("span[aria-hidden]")
          if (icon) gsap.to(icon, { x: x * 2, y: y * 2, duration: MOTION.micro, ease: MOTION.ease, overwrite: true })
        }
      })
      const move = (event: PointerEvent) => {
        if (event.pointerType !== "mouse") return
        const node = event.target instanceof Element ? event.target : null
        const candidate = node?.closest<HTMLElement>(".btn-primary, [data-motion-card]") ?? null
        if (!candidate || candidate.closest("[inert]") || candidate.matches(":disabled")) { release(); return }
        // Controls nested in a card must not shift while being clicked.
        if (candidate.hasAttribute("data-motion-card") && node?.closest("button, input")) { release(); return }
        if (candidate !== active) {
          release()
          active = candidate
          bounds = active.getBoundingClientRect()
          card = active.hasAttribute("data-motion-card")
          touched.add(active)
          active.setAttribute("data-motion-active", "true")
        }
        clientX = event.clientX
        clientY = event.clientY
        if (!frame) frame = requestAnimationFrame(paint)
      }
      const visibility = () => { if (document.hidden) release() }
      document.addEventListener("pointermove", move, { passive: true })
      document.addEventListener("pointerleave", release)
      document.addEventListener("focusin", release)
      document.addEventListener("visibilitychange", visibility)
      window.addEventListener("blur", release)
      window.addEventListener("scroll", release, { passive: true })
      window.addEventListener("resize", release)
      return () => {
        cancelAnimationFrame(frame)
        document.removeEventListener("pointermove", move)
        document.removeEventListener("pointerleave", release)
        document.removeEventListener("focusin", release)
        document.removeEventListener("visibilitychange", visibility)
        window.removeEventListener("blur", release)
        window.removeEventListener("scroll", release)
        window.removeEventListener("resize", release)
        context.revert()
        touched.forEach((el) => {
          el.removeAttribute("data-motion-active")
          el.style.removeProperty("--glare-x")
          el.style.removeProperty("--glare-y")
        })
      }
    })
    return () => media.revert()
  }, [pathname])

  return null
}
