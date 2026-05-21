import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/utils/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-[14px] text-sm font-bold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 hover:scale-[1.02] hover:shadow-primary/30",
        destructive:
          "bg-destructive text-destructive-foreground shadow-lg shadow-destructive/20 hover:bg-destructive/90 hover:scale-[1.02]",
        outline:
          "border-2 border-primary bg-background text-primary hover:bg-primary/5 hover:scale-[1.02]",
        secondary:
          "bg-secondary text-secondary-foreground shadow-lg shadow-secondary/10 hover:bg-secondary/80 hover:scale-[1.02]",
        ghost: "hover:bg-primary/10 hover:text-primary rounded-[14px]",
        link: "text-primary underline-offset-4 hover:underline",
        premium: "blue-sky-premium-gradient shadow-xl shadow-primary/30 hover:scale-[1.02] hover:shadow-primary/50 text-white",
      },
      size: {
        default: "h-12 px-6 py-2",
        sm: "h-9 rounded-xl px-3",
        lg: "h-14 rounded-2xl px-10 text-base",
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
