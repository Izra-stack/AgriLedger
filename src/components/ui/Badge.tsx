import * as React from "react"
import { cn } from "../../lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "warning" | "danger" | "neutral";
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors",
          {
            "bg-gray-100 text-gray-600 border-transparent": variant === "default",
            "bg-[#EAF7EF] text-[#0F3D21] border-[#0F3D21]/20": variant === "success",
            "bg-[#fefce8] text-[#dfa43a] border-[#dfa43a]/30": variant === "warning",
            "bg-red-50 text-red-600 border-red-200": variant === "danger",
            "bg-gray-100 text-gray-600 border-gray-200": variant === "neutral",
          },
          className
        )}
        {...props}
      />
    )
  }
)
Badge.displayName = "Badge"

export { Badge }
