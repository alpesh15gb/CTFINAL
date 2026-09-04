import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-sm border border-transparent font-mono text-[11px] font-bold uppercase tracking-[0.14em] transition-all duration-300 ease-out-expo focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:translate-y-px disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-white text-black shadow-[0_10px_30px_rgba(255,255,255,0.10)] hover:-translate-y-0.5 hover:bg-white/85 hover:shadow-[0_16px_36px_rgba(255,255,255,0.16)]",
        destructive:
          "bg-destructive text-destructive-foreground hover:-translate-y-0.5 hover:bg-destructive/90",
        outline:
          "border-border bg-transparent text-foreground hover:-translate-y-0.5 hover:border-white/60 hover:bg-white/[0.06] hover:text-white",
        secondary:
          "border-border bg-secondary text-secondary-foreground hover:-translate-y-0.5 hover:bg-surface-hover",
        ghost: "text-silver hover:bg-white/[0.05] hover:text-foreground",
        link: "text-white underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-5 py-2.5",
        sm: "h-10 px-4 text-[10px]",
        lg: "h-12 px-7 md:h-14 md:px-9",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
