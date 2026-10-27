"use client"

import * as React from "react"
import { Collapsible } from "@base-ui/react/collapsible"
import { ArrowRight01Icon, File01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"

import { cn } from "@/lib/utils"

const ThresholdContext = React.createContext<number | undefined>(undefined)

function RetrievedSources({
  threshold,
  className,
  ...props
}: React.ComponentProps<"ol"> & {
  /** Chunks scoring under this, from 0 to 1, are muted as not used. */
  threshold?: number
}) {
  return (
    <ThresholdContext.Provider value={threshold}>
      <ol
        data-slot="retrieved-sources"
        className={cn(
          "flex w-full min-w-0 flex-col divide-y divide-border/60 overflow-hidden rounded-xl border border-border/60 bg-background text-sm",
          className
        )}
        {...props}
      />
    </ThresholdContext.Provider>
  )
}

function RetrievedSource({
  title,
  location,
  score,
  icon = File01Icon,
  defaultOpen,
  open,
  onOpenChange,
  className,
  children,
  ...props
}: Omit<React.ComponentProps<"li">, "title"> & {
  /** The document the chunk came from. */
  title: React.ReactNode
  /** Where in it, like "p. 4" or "§ 2.1". */
  location?: React.ReactNode
  /** How relevant it was, from 0 to 1. */
  score?: number
  icon?: IconSvgElement
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  /** The chunk's text, shown when it's opened. */
  children?: React.ReactNode
}) {
  const threshold = React.useContext(ThresholdContext)
  const below =
    threshold !== undefined && score !== undefined && score < threshold

  return (
    <li
      data-slot="retrieved-source"
      data-below-threshold={below || undefined}
      className={cn("min-w-0", className)}
      {...props}
    >
      <Collapsible.Root
        defaultOpen={defaultOpen}
        open={open}
        onOpenChange={onOpenChange}
      >
        <Collapsible.Trigger
          disabled={!children}
          className="group/retrieved-source flex h-9 w-full min-w-0 items-center gap-2 border border-transparent px-3 text-start transition-colors duration-80 outline-none hover:bg-muted/50 focus-visible:border-ring disabled:hover:bg-transparent motion-reduce:transition-none"
        >
          <HugeiconsIcon
            aria-hidden
            icon={icon}
            className="size-3.5 shrink-0 text-muted-foreground"
          />
          <span
            className={cn("min-w-0 truncate", below && "text-muted-foreground")}
          >
            {title}
          </span>
          {location ? (
            <span className="shrink-0 text-xs text-muted-foreground">
              {location}
            </span>
          ) : null}
          {below ? <span className="sr-only">, below threshold</span> : null}
          {score !== undefined ? (
            <span className="ms-auto flex shrink-0 items-center gap-1.5">
              <span
                aria-hidden
                className="relative h-1 w-8 overflow-hidden rounded-full bg-muted"
              >
                <span
                  style={{ width: `${Math.round(score * 100)}%` }}
                  className={cn(
                    "absolute inset-y-0 start-0 rounded-full bg-foreground",
                    below && "bg-muted-foreground/50"
                  )}
                />
              </span>
              <span className="w-7 text-end font-mono text-xs text-muted-foreground tabular-nums">
                <span className="sr-only">relevance </span>
                {score.toFixed(2)}
              </span>
            </span>
          ) : null}
          {children ? (
            <HugeiconsIcon
              aria-hidden
              icon={ArrowRight01Icon}
              className={cn(
                "size-3.5 shrink-0 text-muted-foreground transition-[rotate] duration-150 group-data-panel-open/retrieved-source:rotate-90 motion-reduce:transition-none rtl:-scale-x-100",
                score === undefined && "ms-auto"
              )}
            />
          ) : null}
        </Collapsible.Trigger>
        {children ? (
          <Collapsible.Panel className="h-(--collapsible-panel-height) overflow-hidden opacity-100 transition-[height,opacity] duration-280 ease-[cubic-bezier(0.16,1,0.3,1)] data-ending-style:h-0 data-ending-style:opacity-0 data-ending-style:ease-[cubic-bezier(0.4,0,1,1)] data-starting-style:h-0 data-starting-style:opacity-0 motion-reduce:transition-none">
            <blockquote className="mx-3 mb-3 border-s border-border ps-3 text-xs/5 whitespace-pre-wrap text-muted-foreground">
              {children}
            </blockquote>
          </Collapsible.Panel>
        ) : null}
      </Collapsible.Root>
    </li>
  )
}

export { RetrievedSource, RetrievedSources }
