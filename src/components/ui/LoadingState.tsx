import { Loader2 } from "lucide-react"

export function LoadingState({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center h-full min-h-[200px]">
      <Loader2 className="w-8 h-8 text-brand-dark animate-spin mb-4" />
      <p className="text-sm text-gray-500 font-medium">{message}</p>
    </div>
  )
}
