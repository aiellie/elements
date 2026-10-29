"use client"

import * as React from "react"
import { Collapsible } from "@base-ui/react/collapsible"
import {
  ArrowRight01Icon,
  Cancel01Icon,
  CircleIcon,
  Hold01Icon,
  Tick02Icon,
  Wrench01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"

import { cn } from "@/lib/utils"
import { Status, StatusIndicator } from "@/registry/aiellie/ui/status"
import { Button } from "@/registry/aiellie/ui/button"

type ToolCallStatus = "pending" | "awaiting" | "running" | "done" | "error"

const STATUS_LABELS: Record<ToolCallStatus, string> = {
  pending: "Queued",
  awaiting: "Needs approval",
  running: "Running",
  done: "Done",
  error: "Failed",
}

const STATUS_ICONS: Partial<Record<ToolCallStatus, IconSvgElement>> = {
  pending: CircleIcon,
  awaiting: Hold01Icon,
  done: Tick02Icon,
  error: Cancel01Icon,
}

const ToolCallContext = React.createContext<ToolCallStatus>("done")

function ToolCall({
  status = "done",
  className,
  ...props
}: React.ComponentProps<typeof Collapsible.Root> & {
  status?: ToolCallStatus
}) {
  return (
    <ToolCallContext.Provider value={status}>
      <Collapsible.Root
        data-slot="tool-call"
        data-status={status}
        className={cn("flex min-w-0 flex-col", className)}
        {...props}
      />
    </ToolCallContext.Provider>
  )
}

function ToolCallTrigger({
  icon = Wrench01Icon,
  name,
  summary,
  labels,
  className,
  children,
  ...props
}: Omit<React.ComponentProps<typeof Collapsible.Trigger>, "children"> & {
  icon?: IconSvgElement
  /** What was called, like "Search the web". */
  name: React.ReactNode
  /** The one detail worth reading without opening it, like the query. */
  summary?: React.ReactNode
  /** Words of your own for each status. */
  labels?: Partial<Record<ToolCallStatus, string>>
  children?: React.ReactNode
}) {
  const status = React.useContext(ToolCallContext)
  const label = labels?.[status] ?? STATUS_LABELS[status]
  const mark = STATUS_ICONS[status]

  return (
    <Collapsible.Trigger
      data-slot="tool-call-trigger"
      className={cn(
        "group/tool-call-trigger -ms-1.5 flex w-fit max-w-full min-w-0 items-center gap-1.5 rounded-md border border-transparent px-1.5 py-0.5 text-sm text-muted-foreground transition-colors duration-80 outline-none hover:text-foreground focus-visible:border-ring focus-visible:text-foreground data-panel-open:text-foreground motion-reduce:transition-none",
        className
      )}
      {...props}
    >
      <HugeiconsIcon aria-hidden icon={icon} className="size-3.5 shrink-0" />
      <span
        className={cn(
          "shrink-0",
          status === "running" && "shimmer motion-reduce:shimmer-none"
        )}
      >
        {name}
      </span>
      {summary ? (
        <span className="min-w-0 truncate text-muted-foreground">
          {summary}
        </span>
      ) : null}
      {children}
      <span className="sr-only">, {label}</span>
      {status === "running" ? (
        <Status
          variant="live"
          pulse
          className="border-0 bg-transparent p-0 dark:bg-transparent"
        >
          <StatusIndicator />
        </Status>
      ) : mark ? (
        <HugeiconsIcon
          aria-hidden
          icon={mark}
          className={cn(
            "size-3.5 shrink-0",
            status === "error" && "text-destructive"
          )}
        />
      ) : null}
      {status === "error" || status === "awaiting" ? (
        <span
          aria-hidden
          className={cn(
            "shrink-0 text-xs",
            status === "error" && "text-destructive"
          )}
        >
          {label}
        </span>
      ) : null}
      <HugeiconsIcon
        aria-hidden
        icon={ArrowRight01Icon}
        className="size-3.5 shrink-0 transition-[rotate] duration-150 group-data-panel-open/tool-call-trigger:rotate-90 motion-reduce:transition-none rtl:-scale-x-100"
      />
    </Collapsible.Trigger>
  )
}

function ToolCallContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Collapsible.Panel>) {
  return (
    <Collapsible.Panel
      data-slot="tool-call-content"
      className={cn(
        "h-(--collapsible-panel-height) overflow-hidden opacity-100 transition-[height,opacity] duration-280 ease-[cubic-bezier(0.16,1,0.3,1)] data-ending-style:h-0 data-ending-style:opacity-0 data-ending-style:ease-[cubic-bezier(0.4,0,1,1)] data-starting-style:h-0 data-starting-style:opacity-0 motion-reduce:transition-none",
        className
      )}
      {...props}
    >
      <div className="mt-2 flex flex-col gap-3 border-s border-border ps-3">
        {children}
      </div>
    </Collapsible.Panel>
  )
}

function ToolCallSection({
  title,
  className,
  children,
  ...props
}: Omit<React.ComponentProps<"section">, "title"> & {
  /** Like "Input" or "Output". */
  title: React.ReactNode
}) {
  const id = React.useId()

  return (
    <section
      data-slot="tool-call-section"
      aria-labelledby={id}
      className={cn("flex min-w-0 flex-col gap-1", className)}
      {...props}
    >
      <h4 id={id} className="text-xs font-medium text-muted-foreground">
        {title}
      </h4>
      {children}
    </section>
  )
}

function ToolCallCode({
  value,
  className,
  ...props
}: Omit<React.ComponentProps<"pre">, "children"> & {
  /** A string shows as it is; anything else as JSON. */
  value: unknown
}) {
  const text =
    typeof value === "string" ? value : JSON.stringify(value, null, 2)

  return (
    <pre
      data-slot="tool-call-code"
      dir="ltr"
      tabIndex={0}
      className={cn(
        "max-h-48 min-w-0 overflow-auto rounded-md bg-muted px-3 py-2 font-mono text-xs leading-5 text-foreground outline-none focus-visible:ring-0",
        className
      )}
      {...props}
    >
      {text}
    </pre>
  )
}

function ToolCallApproval({
  onApprove,
  onDeny,
  approveLabel = "Allow",
  denyLabel = "Deny",
  className,
  children = "Allow this tool to run?",
  ...props
}: React.ComponentProps<"div"> & {
  onApprove: () => void
  onDeny: () => void
  approveLabel?: string
  denyLabel?: string
}) {
  return (
    <div
      data-slot="tool-call-approval"
      role="group"
      className={cn(
        "mt-2 flex min-w-0 flex-wrap items-center gap-2 rounded-lg border border-border/60 py-1.5 ps-3 pe-1.5 text-sm",
        className
      )}
      {...props}
    >
      <span className="me-auto min-w-0">{children}</span>
      <Button variant="outline" size="sm" onClick={onDeny}>
        {denyLabel}
      </Button>
      <Button size="sm" onClick={onApprove}>
        {approveLabel}
      </Button>
    </div>
  )
}

export {
  ToolCall,
  ToolCallApproval,
  ToolCallCode,
  ToolCallContent,
  ToolCallSection,
  ToolCallTrigger,
}
export type { ToolCallStatus }
