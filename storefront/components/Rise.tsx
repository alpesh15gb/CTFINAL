"use client"

import { useLayoutEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { SplitText } from "gsap/SplitText"
import { MOTION } from "@/lib/motion"

gsap.registerPlugin(ScrollTrigger, SplitText)

// MOT-2: requested desktop upgrade — masked headlines, soft copy and image
// reveals. The server/CSS baseline stays visible; touch and MOT-6 stay static.
export default function Rise({
  children,
  className = "",
  delay = 0,
  variant = "text",
  direction = "up",
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  variant?: "text" | "image" | "soft"
  direction?: "up" | "down" | "left" | "right"
}) {
  const ref = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return

    const media = gsap.matchMedia()
    const scope = gsap.context(() => {
      media.add({ desktop: MOTION.desktop, reduced: MOTION.reduced }, (context) => {
        if (!context.conditions?.desktop || context.conditions.reduced) return

        let revealed = false
        const splits: SplitText[] = []
        const x = direction === "left" ? -14 : direction === "right" ? 14 : 0
        const y = direction === "down" ? -16 : 16
        const wait = Math.max(0, delay) / 1000

        // Build entrance tweens only at the threshold, not an entire page of
        // hidden content at hydration. Context also owns late-created tweens.
        const reveal = () => {
          if (revealed) return
          revealed = true
          if (el.getBoundingClientRect().bottom <= 0) return

          context.add(() => {
            if (variant === "image") {
              const images = Array.from(el.querySelectorAll<HTMLImageElement>("img"))
                .filter((image) => image.closest(".overflow-hidden"))
              if (images.length) {
                // Only the image is transformed inside its existing crop;
                // neither the Rise root nor the floating fitment chip is clipped.
                gsap.set(images, { transition: "none" })
                gsap.fromTo(images, { scale: 1.1, x }, {
                  scale: 1,
                  x: 0,
                  delay: wait,
                  duration: MOTION.reveal,
                  ease: MOTION.ease,
                  onComplete: () => {
                    context.add(() => {
                      // MOT-2 desktop follow-through: buffer grows with travel,
                      // covering the image edges even at the full +/-3% offset.
                      gsap.fromTo(images, { scale: 1, yPercent: 0 }, {
                        scale: 1.07,
                        yPercent: direction === "left" || direction === "down" ? -3 : 3,
                        ease: "none",
                        immediateRender: false,
                        scrollTrigger: {
                          trigger: el,
                          start: "clamp(top 65%)",
                          end: "bottom top",
                          scrub: MOTION.settle,
                        },
                      })
                    })
                  },
                })
                return
              }
            }

            const headings = variant === "soft" ? [] : Array.from(
              el.querySelectorAll<HTMLElement>("h1, h2, h3.headline-2")
            ).filter((heading) => !heading.querySelector("a, button, input"))

            for (const heading of headings) {
              const split = SplitText.create(heading, {
                type: "lines,words",
                mask: "lines",
                tag: "span",
                wordsClass: "inline-block",
                linesClass: "block",
                aria: "auto",
                autoSplit: true,
                // onSplit returns its tween so font/width resplits inherit time
                // instead of replaying. Revert restores the exact semantic HTML.
                onSplit: (text) => {
                  gsap.set(text.masks, { display: "block" })
                  return gsap.fromTo(text.words, {
                    yPercent: direction === "down" ? -105 : 105,
                    x,
                  }, {
                    yPercent: 0,
                    x: 0,
                    delay: wait,
                    duration: MOTION.reveal,
                    stagger: MOTION.stagger,
                    ease: MOTION.ease,
                    onComplete: () => text.revert(),
                  })
                },
              })
              splits.push(split)
            }

            if (headings.length) {
              const copy = Array.from(el.querySelectorAll<HTMLElement>("p, ul, ol, form, a, button"))
                .filter((node) => !headings.some((heading) => heading.contains(node)))
                .filter((node) => !node.parentElement?.closest("p, ul, ol, form, a, button"))
              if (copy.length) {
                gsap.fromTo(copy, { opacity: 0 }, {
                  opacity: 1,
                  delay: wait + MOTION.stagger,
                  duration: MOTION.settle,
                  stagger: MOTION.stagger,
                  ease: MOTION.ease,
                  clearProps: "opacity",
                })
              }
            } else {
              gsap.fromTo(el, { opacity: 0, x, y: x ? 0 : y }, {
                opacity: 1,
                x: 0,
                y: 0,
                delay: wait,
                duration: MOTION.reveal,
                ease: MOTION.ease,
                clearProps: "opacity,transform",
              })
            }
          })
        }

        ScrollTrigger.create({
          trigger: el,
          start: "top 88%",
          once: true,
          onEnter: reveal,
          onEnterBack: reveal,
        })

        return () => splits.forEach((split) => split.revert())
      })
    }, el)

    return () => {
      media.revert()
      scope.revert()
    }
  }, [delay, direction, variant])

  return (
    <div ref={ref} className={`rise ${className}`}>
      {children}
    </div>
  )
}
