"use client"

import * as React from "react"
import { Cancel01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { cn } from "@/lib/utils"
import { Input } from "@/registry/aiellie/ui/input"

function FilterInput({
  value,
  onValueChange,
  onEnter,
  className,
  ...props
}: Omit<
  React.ComponentProps<typeof Input>,
  "value" | "onChange" | "type" | "onKeyDown"
> & {
  value: string
  onValueChange: (value: string) => void
  /** Runs on Enter, to open the first match. */
  onEnter?: () => void
}) {
  const ref = React.useRef<HTMLInputElement>(null)

  return (
    <div className={cn("relative", className)}>
      <Input
        ref={ref}
        type="search"
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
        onKeyDown={(event) => {
          // Enter while an IME is composing picks a candidate, not a match.
          if (event.key === "Enter" && !event.nativeEvent.isComposing) {
            event.preventDefault()
            onEnter?.()
          }
          if (event.key === "Escape" && value) {
            event.preventDefault()
            event.stopPropagation()
            onValueChange("")
          }
        }}
        className="pe-8 [&::-webkit-search-cancel-button]:appearance-none"
        {...props}
      />
      {/* Disabled rather than hidden while empty, so the field's end doesn't
          shift as you type. */}
      <button
        type="button"
        aria-label="Clear filter"
        disabled={!value}
        onClick={() => {
          onValueChange("")
          ref.current?.focus()
        }}
        className="absolute end-1.5 top-1/2 grid size-5 -translate-y-1/2 place-items-center rounded-sm text-muted-foreground transition-colors duration-80 outline-none hover:text-foreground focus-visible:text-foreground disabled:pointer-events-none disabled:opacity-30 motion-reduce:transition-none"
      >
        <HugeiconsIcon aria-hidden icon={Cancel01Icon} className="size-3.5" />
      </button>
    </div>
  )
}

export { FilterInput }
