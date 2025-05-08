import * as React from "react"

import { cn } from "@/lib/utils"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(        "flex min-h-[60px] w-full rounded-md border border-gray-200 bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-gray-400 focus:outline-none focus:border-teal-500 focus:ring-teal-500 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
