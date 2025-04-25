
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-[#003366]", // solid blue
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border-2 border-primary text-primary bg-transparent hover:bg-[#F5F7FA] hover:text-primary", // blue border, subtle hover
        secondary: "bg-secondary text-secondary-foreground hover:bg-[#388e3c]", // green, no gradient
        ghost: "hover:bg-[#F5F7FA] hover:text-primary",
        link: "text-primary underline-offset-4 hover:underline",
        meow: "bg-primary text-white hover:bg-[#003366] shadow-md hover:shadow-lg transform hover:translate-y-[-2px] transition-all", 
        meowSecondary: "bg-accent text-white hover:bg-[#cc6400] shadow-md hover:shadow-lg transform hover:translate-y-[-2px] transition-all", 
        meowOutline: "border-2 border-primary text-primary bg-transparent hover:bg-primary/10 transform hover:translate-y-[-2px] transition-all", 
        meowSecondaryOutline: "border-2 border-accent text-accent bg-transparent hover:bg-accent/10 transform hover:translate-y-[-2px] transition-all",
        meowGlass: "bg-white/90 backdrop-blur-sm border border-[#E9ECEF] text-primary shadow-sm hover:shadow transition-all",
        success: "bg-secondary text-white hover:bg-[#388e3c] shadow-md hover:shadow-lg transform hover:translate-y-[-2px] transition-all",
        info: "bg-primary text-white hover:bg-[#003366] shadow-md hover:shadow-lg transform hover:translate-y-[-2px] transition-all",
        warning: "bg-accent text-white hover:bg-[#cc6400] shadow-md hover:shadow-lg transform hover:translate-y-[-2px] transition-all",
        danger: "bg-red-600 text-white hover:bg-red-700 shadow-md hover:shadow-lg transform hover:translate-y-[-2px] transition-all",
        dangerOutline: "border-2 border-red-600 text-red-600 bg-transparent hover:bg-red-50 transform hover:translate-y-[-2px] transition-all"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        xl: "h-12 rounded-md px-10 py-6 text-lg",
        icon: "h-10 w-10",
        full: "h-10 w-full px-4 py-2",
        auto: "h-auto px-4 py-2"
      },
      align: {
        default: "inline-flex",
        center: "mx-auto", 
        left: "mr-auto",
        right: "ml-auto",
        block: "block w-full"
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      align: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, align, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, align, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
