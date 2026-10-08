import * as React from "react"
import { cn } from "../../lib/utils"

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={cn(
          "w-full border border-gray-200 rounded-lg px-4 py-2.5 text-base sm:text-sm min-h-[42px] transition-colors touch-manipulation",
          "focus:outline-none focus:border-brand-dark focus:ring-1 focus:ring-brand-dark",
          "disabled:cursor-not-allowed disabled:opacity-50 bg-white text-gray-700",
          className
        )}
        {...props}
      >
        {children}
      </select>
    )
  }
)
Select.displayName = "Select"

export { Select }
