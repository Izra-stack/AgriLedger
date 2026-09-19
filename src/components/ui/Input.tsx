import { forwardRef, InputHTMLAttributes, ReactNode } from "react"
import { cn } from "../../lib/utils"

export interface InputProps
  extends InputHTMLAttributes<HTMLInputElement> {
    icon?: ReactNode;
  }

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, ...props }, ref) => {
    return (
      <div className="relative w-full">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            "flex w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm transition-colors",
            "file:border-0 file:bg-transparent file:text-sm file:font-medium",
            "placeholder:text-gray-400",
            "focus:outline-none focus:border-brand-dark focus:ring-1 focus:ring-brand-dark",
            "disabled:cursor-not-allowed disabled:opacity-50 bg-white",
            icon && "pl-10",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
