"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

type ContextSegment = {
  key: string
  label: string
  tokens: number
  /** Your own fill for its bar and swatch, like `bg-foreground/50`. */
  className?: string
}

// Near-monochrome, so the parts read as one whole: darkest first.
const FILLS = [
  "bg-foreground",
  "bg-foreground/60",
  "bg-foreground/35",
  "bg-foreground/20",
  "bg-foreground/10",
]

// 820 → "820", 46_900 → "46.9K", 1_000_000 → "1M".
function formatTokens(tokens: number) {
  if (tokens < 1000) return String(Math.round(tokens))
  if (tokens < 1_000_000) return `${+(tokens / 1000).toFixed(1)}K`
  return `${+(tokens / 1_000_000).toFixed(1)}M`
}

function ContextBreakdown({
  segments,
  max,
  label = "Context",
  className,
  ...props
}: Omit<React.ComponentProps<"div">, "children"> & {
  /** The parts of the window, in the order they fill it. */
  segments: ContextSegment[]
  /** The model's whole window, in tokens. */
  max: number
  label?: React.ReactNode
}) {
  const [focused, setFocused] = React.useState<string | null>(null)
  const used = segments.reduce((sum, segment) => sum + segment.tokens, 0)
  const percent = Math.min(100, Math.round((used / max) * 100))
  const labelId = React.useId()

  return (
    <div
      data-slot="context-breakdown"
      className={cn("flex w-full min-w-0 flex-col gap-2 text-sm", className)}
      {...props}
    >
      <div className="flex min-w-0 items-baseline gap-2">
        <span id={labelId} className="truncate text-muted-foreground">
          {label}
        </span>
        <span className="ms-auto shrink-0 text-xs tabular-nums">
          {formatTokens(used)}
          <span className="text-muted-foreground"> / {formatTokens(max)}</span>
          <span className="ms-1.5 text-muted-foreground">{percent}%</span>
        </span>
      </div>
      <div
        role="meter"
        aria-labelledby={labelId}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={used}
        aria-valuetext={`${formatTokens(used)} of ${formatTokens(max)} tokens`}
        className="flex h-1.5 w-full gap-px overflow-hidden rounded-full bg-muted"
      >
        {segments.map((segment, index) => (
          <span
            key={segment.key}
            data-dim={
              focused !== null && focused !== segment.key ? "" : undefined
            }
            style={{ width: `${(segment.tokens / max) * 100}%` }}
            className={cn(
              "h-full shrink-0 transition-[width,opacity] duration-280 ease-[cubic-bezier(0.16,1,0.3,1)] first:rounded-s-full data-dim:opacity-25 motion-reduce:transition-none",
              segment.className ?? FILLS[index % FILLS.length]
            )}
          />
        ))}
      </div>
      <ul className="flex flex-col">
        {segments.map((segment, index) => (
          <li
            key={segment.key}
            onPointerEnter={() => setFocused(segment.key)}
            onPointerLeave={() => setFocused(null)}
            className="flex h-7 min-w-0 items-center gap-2 text-xs"
          >
            <span
              aria-hidden
              className={cn(
                "size-2 shrink-0 rounded-full",
                segment.className ?? FILLS[index % FILLS.length]
              )}
            />
            <span className="min-w-0 truncate text-muted-foreground">
              {segment.label}
            </span>
            <span className="ms-auto shrink-0 tabular-nums">
              {formatTokens(segment.tokens)}
            </span>
          </li>
        ))}
        <li className="flex h-7 min-w-0 items-center gap-2 text-xs">
          <span
            aria-hidden
            className="size-2 shrink-0 rounded-full border border-border"
          />
          <span className="min-w-0 truncate text-muted-foreground">Free</span>
          <span className="ms-auto shrink-0 tabular-nums">
            {formatTokens(Math.max(0, max - used))}
          </span>
        </li>
      </ul>
    </div>
  )
}

export { ContextBreakdown, formatTokens }
export type { ContextSegment }
