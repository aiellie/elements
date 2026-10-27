"use client"

import * as React from "react"
import { Collapsible } from "@base-ui/react/collapsible"
import {
  ArrowRight01Icon,
  Cancel01Icon,
  CircleIcon,
  Tick02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"

import { cn } from "@/lib/utils"
import { Status, StatusIndicator } from "@/registry/aiellie/components/status"
import {
  ThinkingIndicator,
  formatDuration,
} from "@/registry/aiellie/components/thinking-indicator"

type AgentStepStatus = "pending" | "active" | "done" | "error"

const STATUS_LABELS: Record<AgentStepStatus, string> = {
  pending: "Not started",
  active: "In progress",
  done: "Done",
  error: "Failed",
}

const STATUS_ICONS: Record<
  Exclude<AgentStepStatus, "active">,
  IconSvgElement
> = {
  pending: CircleIcon,
  done: Tick02Icon,
  error: Cancel01Icon,
}

type AgentStepsContextValue = {
  streaming: boolean
  duration?: number
  startedAt?: Date | number
}

const AgentStepsContext = React.createContext<AgentStepsContextValue>({
  streaming: false,
})

// Opens while the agent works and folds shut once it's done, unless the
// person has opened or shut it themselves, which it then leaves alone.
function AgentSteps({
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
  /** Whether the agent is still working. */
  streaming?: boolean
  /** Seconds the run took, once it's done. */
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
    <AgentStepsContext.Provider value={{ streaming, duration, startedAt }}>
      <Collapsible.Root
        data-slot="agent-steps"
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
    </AgentStepsContext.Provider>
  )
}

function AgentStepsTrigger({
  label,
  className,
  children,
  ...props
}: React.ComponentProps<typeof Collapsible.Trigger> & {
  /** What it says while the agent works. Defaults to "Working". */
  label?: React.ReactNode
}) {
  const { streaming, duration, startedAt } = React.useContext(AgentStepsContext)

  return (
    <Collapsible.Trigger
      data-slot="agent-steps-trigger"
      className={cn(
        "group/agent-steps-trigger -ms-1.5 flex w-fit items-center gap-1 rounded-md border border-transparent px-1.5 py-0.5 text-sm text-muted-foreground transition-colors duration-80 outline-none hover:text-foreground focus-visible:border-ring focus-visible:text-foreground data-panel-open:text-foreground motion-reduce:transition-none",
        className
      )}
      {...props}
    >
      {children ??
        (streaming ? (
          <ThinkingIndicator startedAt={startedAt}>
            {label ?? "Working"}
          </ThinkingIndicator>
        ) : duration === undefined ? (
          "Worked for a moment"
        ) : (
          `Worked for ${formatDuration(duration)}`
        ))}
      <HugeiconsIcon
        aria-hidden
        icon={ArrowRight01Icon}
        className="size-3.5 transition-[rotate] duration-150 group-data-panel-open/agent-steps-trigger:rotate-90 motion-reduce:transition-none rtl:-scale-x-100"
      />
    </Collapsible.Trigger>
  )
}

function AgentStepsContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Collapsible.Panel>) {
  return (
    <Collapsible.Panel
      data-slot="agent-steps-content"
      className={cn(
        "h-(--collapsible-panel-height) overflow-hidden opacity-100 transition-[height,opacity] duration-280 ease-[cubic-bezier(0.16,1,0.3,1)] data-ending-style:h-0 data-ending-style:opacity-0 data-ending-style:ease-[cubic-bezier(0.4,0,1,1)] data-starting-style:h-0 data-starting-style:opacity-0 motion-reduce:transition-none",
        className
      )}
      {...props}
    >
      <ol className="mt-2 flex flex-col">{children}</ol>
    </Collapsible.Panel>
  )
}

function AgentStep({
  status = "done",
  icon,
  label,
  className,
  children,
  ...props
}: Omit<React.ComponentProps<"li">, "children"> & {
  status?: AgentStepStatus
  /** Shown once the step is done, in place of the tick, like a globe for a search. */
  icon?: IconSvgElement
  /** What the step does, like "Searched for container queries". */
  label: React.ReactNode
  /** A line of detail, results, or anything else beneath the label. */
  children?: React.ReactNode
}) {
  const mark =
    status === "done" && icon
      ? icon
      : status === "active"
        ? undefined
        : STATUS_ICONS[status]

  return (
    <li
      data-slot="agent-step"
      data-status={status}
      className={cn(
        "group/agent-step relative flex min-w-0 gap-2 pb-3 text-sm last:pb-0",
        className
      )}
      {...props}
    >
      {/* The rail between this step's mark and the next one's. */}
      <span
        aria-hidden
        className="absolute start-2 top-5.5 bottom-0.5 w-px -translate-x-1/2 bg-border group-last/agent-step:hidden rtl:translate-x-1/2"
      />
      <span className="flex h-5 w-4 shrink-0 items-center justify-center">
        {mark ? (
          <HugeiconsIcon
            aria-hidden
            icon={mark}
            className={cn(
              "size-3.5 text-muted-foreground",
              status === "error" && "text-destructive"
            )}
          />
        ) : (
          <Status
            variant="live"
            pulse
            className="border-0 bg-transparent p-0 dark:bg-transparent"
          >
            <StatusIndicator />
          </Status>
        )}
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <span
          className={cn(
            "min-w-0 leading-5",
            status === "pending" && "text-muted-foreground",
            status === "active" && "shimmer motion-reduce:shimmer-none"
          )}
        >
          {label}
          <span className="sr-only">, {STATUS_LABELS[status]}</span>
        </span>
        {children}
      </div>
    </li>
  )
}

function AgentStepDetail({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="agent-step-detail"
      className={cn("min-w-0 text-xs/5 text-muted-foreground", className)}
      {...props}
    />
  )
}

function AgentStepResults({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="agent-step-results"
      className={cn("flex min-w-0 flex-wrap gap-1", className)}
      {...props}
    />
  )
}

function AgentStepResult({
  href,
  className,
  children,
  ...props
}: React.ComponentProps<"li"> & {
  /** Opens in a new tab when given. */
  href?: string
}) {
  const chip =
    "inline-flex h-5 max-w-56 min-w-0 items-center gap-1 rounded-sm border border-border/60 px-1.5 text-xs text-muted-foreground [&_svg]:size-3 [&_svg]:shrink-0"

  return (
    <li
      data-slot="agent-step-result"
      className={cn("flex min-w-0", className)}
      {...props}
    >
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className={cn(
            chip,
            "transition-colors duration-80 outline-none hover:bg-muted hover:text-foreground focus-visible:border-ring motion-reduce:transition-none"
          )}
        >
          <span className="truncate">{children}</span>
        </a>
      ) : (
        <span className={chip}>
          <span className="truncate">{children}</span>
        </span>
      )}
    </li>
  )
}

export {
  AgentStep,
  AgentStepDetail,
  AgentStepResult,
  AgentStepResults,
  AgentSteps,
  AgentStepsContent,
  AgentStepsTrigger,
}
export type { AgentStepStatus }
