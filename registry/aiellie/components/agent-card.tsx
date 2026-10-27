import * as React from "react"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"

import { cn } from "@/lib/utils"

function AgentCard({ className, ...props }: React.ComponentProps<"article">) {
  return (
    <article
      data-slot="agent-card"
      className={cn(
        "flex w-full min-w-0 flex-col overflow-hidden rounded-xl border border-border/60 bg-card text-sm text-card-foreground",
        className
      )}
      {...props}
    />
  )
}

function AgentCardHeader({
  className,
  ...props
}: React.ComponentProps<"header">) {
  return (
    <header
      data-slot="agent-card-header"
      className={cn(
        "flex min-w-0 items-center gap-3 border-b border-border/60 px-4 py-3",
        className
      )}
      {...props}
    />
  )
}

function AgentCardMark({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="agent-card-mark"
      aria-hidden
      className={cn(
        "flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground [&_svg]:size-4 [&_svg]:shrink-0",
        className
      )}
      {...props}
    />
  )
}

function AgentCardTitle({
  model,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  /** The model it runs on, set under its name. */
  model?: React.ReactNode
}) {
  return (
    <div
      data-slot="agent-card-title"
      className={cn("flex min-w-0 flex-1 flex-col", className)}
      {...props}
    >
      <h3 className="truncate font-medium">{children}</h3>
      {model ? (
        <p className="truncate text-xs text-muted-foreground">{model}</p>
      ) : null}
    </div>
  )
}

function AgentCardActions({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="agent-card-actions"
      className={cn("ms-auto flex shrink-0 items-center gap-0.5", className)}
      {...props}
    />
  )
}

function AgentCardContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="agent-card-content"
      className={cn("flex min-w-0 flex-col gap-4 p-4", className)}
      {...props}
    />
  )
}

function AgentCardSection({
  title,
  className,
  children,
  ...props
}: Omit<React.ComponentProps<"section">, "title"> & {
  /** Like "Instructions" or "Tools". */
  title: React.ReactNode
}) {
  const id = React.useId()

  return (
    <section
      data-slot="agent-card-section"
      aria-labelledby={id}
      className={cn("flex min-w-0 flex-col gap-1.5", className)}
      {...props}
    >
      <h4 id={id} className="text-xs font-medium text-muted-foreground">
        {title}
      </h4>
      {children}
    </section>
  )
}

function AgentCardInstructions({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="agent-card-instructions"
      className={cn("min-w-0 leading-6 whitespace-pre-wrap", className)}
      {...props}
    />
  )
}

function AgentCardTools({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="agent-card-tools"
      className={cn("flex min-w-0 flex-wrap gap-1", className)}
      {...props}
    />
  )
}

function AgentCardTool({
  icon,
  className,
  children,
  ...props
}: React.ComponentProps<"li"> & {
  icon?: IconSvgElement
}) {
  return (
    <li
      data-slot="agent-card-tool"
      className={cn(
        "inline-flex h-6 max-w-full min-w-0 items-center gap-1 rounded-md bg-muted px-2 font-mono text-[0.6875rem] font-medium text-foreground",
        className
      )}
      {...props}
    >
      {icon ? (
        <HugeiconsIcon
          aria-hidden
          icon={icon}
          className="size-3 shrink-0 text-muted-foreground"
        />
      ) : null}
      <span className="truncate">{children}</span>
    </li>
  )
}

function AgentCardCode({
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
      data-slot="agent-card-code"
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

export {
  AgentCard,
  AgentCardActions,
  AgentCardCode,
  AgentCardContent,
  AgentCardHeader,
  AgentCardInstructions,
  AgentCardMark,
  AgentCardSection,
  AgentCardTitle,
  AgentCardTool,
  AgentCardTools,
}
