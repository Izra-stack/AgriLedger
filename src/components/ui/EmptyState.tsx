import { ReactNode } from "react"
import { SearchX } from "lucide-react"

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export function EmptyState({ 
  title = "No results found", 
  description = "Try adjusting your filters or search terms.", 
  icon = <SearchX className="w-12 h-12 text-gray-300 mb-4" />,
  action
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
      {icon}
      <h3 className="text-sm font-bold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 max-w-sm mb-6">{description}</p>
      {action && <div>{action}</div>}
    </div>
  )
}
