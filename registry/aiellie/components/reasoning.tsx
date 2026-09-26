"use client"

import * as React from "react"
import { Collapsible } from "@base-ui/react/collapsible"
import { ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { cn } from "@/lib/utils"
import {
  ThinkingIndicator,
  formatDuration,
} from "@/registry/aiellie/components/thinking-indicator"

type ReasoningContextValue = {
  streaming: boolean
  duration?: number
  startedAt?: Date | number
}

const ReasoningContext = React.createContext<ReasoningContextValue>({
  streaming: false,
})

// Opens while the model thinks and folds shut once it's done, unless the
// person has opened or shut it themselves, which it then leaves alone.
function Reasoning({
  streaming = false,
  duration,
  startedAt,
  open: openProp,
  defaultOpen,
  onOpenChange,
  className,
  ...props
}: Omit<
  React.ComponentProps<typeof Collapsible.Root>,
  "open" | "defaultOpen" | "onOpenChange"
> & {
  /** Whether the model is still thinking. */
  streaming?: boolean
  /** Seconds it thought for, once it's done. */
  duration?: number
  /** When it started, so the count survives a remount. Defaults to when `streaming` turned on. */
  startedAt?: Date | number
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const [openState, setOpenState] = React.useState(defaultOpen ?? streaming)
  const [chosen, setChosen] = React.useState(false)
  const [wasStreaming, setWasStreaming] = React.useState(streaming)
  if (streaming !== wasStreaming) {
    setWasStreaming(streaming)
    if (!chosen) setOpenState(streaming)
  }

  return (
    <ReasoningContext.Provider value={{ streaming, duration, startedAt }}>
      <Collapsible.Root
        data-slot="reasoning"
        data-streaming={streaming || undefined}
        open={openProp ?? openState}
        onOpenChange={(open) => {
          setChosen(true)
          setOpenState(open)
          onOpenChange?.(open)
        }}
        className={cn("flex min-w-0 flex-col", className)}
        {...props}
      />
    </ReasoningContext.Provider>
  )
}

function ReasoningTrigger({
  label,
  className,
  children,
  ...props
}: React.ComponentProps<typeof Collapsible.Trigger> & {
  /** What it says while the model works, like "Searching the web". Defaults to "Thinking". */
  label?: React.ReactNode
}) {
  const { streaming, duration, startedAt } = React.useContext(ReasoningContext)

  return (
    <Collapsible.Trigger
      data-slot="reasoning-trigger"
      className={cn(
        "group/reasoning-trigger -ms-1.5 flex w-fit items-center gap-1 rounded-md border border-transparent px-1.5 py-0.5 text-sm text-muted-foreground transition-colors duration-80 outline-none hover:text-foreground focus-visible:border-ring focus-visible:text-foreground data-panel-open:text-foreground motion-reduce:transition-none",
        className
      )}
      {...props}
    >
      {children ??
        (streaming ? (
          <ThinkingIndicator startedAt={startedAt}>
            {label ?? "Thinking"}
          </ThinkingIndicator>
        ) : duration === undefined ? (
          "Worked for a moment"
        ) : (
          `Worked for ${formatDuration(duration)}`
        ))}
      <HugeiconsIcon
        aria-hidden
        icon={ArrowRight01Icon}
        className="size-3.5 transition-[rotate] duration-150 group-data-panel-open/reasoning-trigger:rotate-90 motion-reduce:transition-none rtl:-scale-x-100"
      />
    </Collapsible.Trigger>
  )
}

function ReasoningContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Collapsible.Panel>) {
  return (
    <Collapsible.Panel
      data-slot="reasoning-content"
      className={cn(
        "h-(--collapsible-panel-height) overflow-hidden opacity-100 transition-[height,opacity] duration-280 ease-[cubic-bezier(0.16,1,0.3,1)] data-ending-style:h-0 data-ending-style:opacity-0 data-ending-style:ease-[cubic-bezier(0.4,0,1,1)] data-starting-style:h-0 data-starting-style:opacity-0 motion-reduce:transition-none",
        className
      )}
      {...props}
    >
      <div className="mt-2 border-s border-border ps-3 text-sm/6 whitespace-pre-wrap text-muted-foreground">
        {children}
      </div>
    </Collapsible.Panel>
  )
}

export { Reasoning, ReasoningContent, ReasoningTrigger }
