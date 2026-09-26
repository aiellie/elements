"use client"

import * as React from "react"
import { Collapsible } from "@base-ui/react/collapsible"
import { ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { cn } from "@/lib/utils"

type ReasoningContextValue = {
  streaming: boolean
  duration?: number
  elapsed: number
}

const ReasoningContext = React.createContext<ReasoningContextValue>({
  streaming: false,
  elapsed: 0,
})

// "12s", "2m 5s". Anything under a second still reads as one.
function formatDuration(seconds: number) {
  const whole = Math.max(1, Math.round(seconds))
  if (whole < 60) return `${whole}s`
  const minutes = Math.floor(whole / 60)
  const rest = whole % 60
  return rest > 0 ? `${minutes}m ${rest}s` : `${minutes}m`
}

function useElapsed(streaming: boolean, startedAt?: Date | number) {
  const [elapsed, setElapsed] = React.useState(0)
  const from = startedAt === undefined ? undefined : Number(startedAt)

  React.useEffect(() => {
    if (!streaming) return
    const start = from ?? Date.now()
    const tick = () => setElapsed(Math.floor((Date.now() - start) / 1000))
    tick()
    const timer = setInterval(tick, 1000)
    return () => clearInterval(timer)
  }, [streaming, from])

  return elapsed
}

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
  const elapsed = useElapsed(streaming, startedAt)

  return (
    <ReasoningContext.Provider value={{ streaming, duration, elapsed }}>
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
  className,
  children,
  ...props
}: React.ComponentProps<typeof Collapsible.Trigger>) {
  const { streaming, duration, elapsed } = React.useContext(ReasoningContext)

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
          <>
            <span className="shimmer motion-reduce:shimmer-none">Thinking</span>
            {elapsed > 0 ? (
              <span className="tabular-nums">· {formatDuration(elapsed)}</span>
            ) : null}
          </>
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

export { Reasoning, ReasoningContent, ReasoningTrigger, formatDuration }
