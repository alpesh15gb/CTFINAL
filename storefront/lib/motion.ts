export const MOTION = {
  ease: "power3.out",
  micro: 0.24,
  settle: 0.45,
  reveal: 0.85,
  stagger: 0.045,
  reduced: "(prefers-reduced-motion: reduce)",
  desktop: "(min-width: 1024px) and (hover: hover) and (pointer: fine)",
} as const

export const clamp01 = (value: number) => Math.min(1, Math.max(0, value))
export const damping = (rate: number, seconds: number) => 1 - Math.exp(-rate * seconds)
