import * as React from "react"

import { cn } from "@/lib/utils"

// Negative delays start each dot mid-bounce, so the wave is already moving on
// the first frame instead of all three rising together.
const DOT_DELAYS = ["-0.32s", "-0.16s", "0s"]

function TypingIndicator({
  variant = "bubble",
  label = "Typing",
  className,
  ...props
}: Omit<React.ComponentProps<"div">, "children"> & {
  /** `bubble` sits in a thread like a message; `bare` is the dots alone, for inside a row of your own. */
  variant?: "bubble" | "bare"
  /** What a screen reader hears, like "Maya is typing". */
  label?: string
}) {
  return (
    <div
      data-slot="typing-indicator"
      data-variant={variant}
      role="status"
      aria-label={label}
      className={cn(
        "flex w-fit shrink-0 items-center gap-1",
        variant === "bubble" &&
          "h-8 rounded-xl rounded-es-sm bg-secondary px-3 text-secondary-foreground",
        className
      )}
      {...props}
    >
      {DOT_DELAYS.map((delay) => (
        <span
          key={delay}
          aria-hidden
          style={{ animationDelay: delay, animationDuration: "1.1s" }}
          className="size-1.5 animate-bounce rounded-full bg-current opacity-40 motion-reduce:animate-none"
        />
      ))}
    </div>
  )
}

export { TypingIndicator }
