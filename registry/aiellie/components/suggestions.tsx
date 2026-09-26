"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/aiellie/ui/button"

// The set arrives together, each one 70ms after the last. Key the row to
// replay it with a fresh set.
function Suggestions({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="suggestions"
      className={cn(
        "flex flex-wrap gap-2 *:animate-in *:duration-280 *:ease-[cubic-bezier(0.16,1,0.3,1)] *:fade-in-0 *:fill-mode-both *:slide-in-from-bottom-1 motion-reduce:*:animate-none [&>:nth-child(2)]:[animation-delay:70ms] [&>:nth-child(3)]:[animation-delay:140ms] [&>:nth-child(4)]:[animation-delay:210ms] [&>:nth-child(5)]:[animation-delay:280ms] [&>:nth-child(n+6)]:[animation-delay:350ms]",
        className
      )}
      {...props}
    />
  )
}

function Suggestion({
  variant = "outline",
  size = "sm",
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Button data-slot="suggestion" variant={variant} size={size} {...props} />
  )
}

export { Suggestion, Suggestions }
