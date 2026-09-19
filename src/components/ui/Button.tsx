import * as React from "react"
import { cn } from "../../lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-lg font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-brand-dark focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
          {
            "bg-[#154226] text-white hover:bg-opacity-90": variant === "primary",
            "bg-[#a0d2b4] text-[#0F3D21] hover:bg-[#8bc5a1]": variant === "secondary",
            "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50": variant === "outline",
            "text-gray-600 hover:bg-gray-100": variant === "ghost",
            "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100": variant === "danger",
            "h-10 px-4 py-2 text-sm": size === "default",
            "h-8 px-3 text-xs": size === "sm",
            "h-12 px-8 text-base": size === "lg",
            "h-10 w-10": size === "icon",
          },
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
