"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import {
  CodeTokens,
  useHighlightedLines,
} from "@/registry/aiellie/components/code-block"
import { Status, StatusIndicator } from "@/registry/aiellie/ui/status"

function TerminalContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="terminal-content"
      // Code reads left to right whatever the page does.
      dir="ltr"
      tabIndex={0}
      className={cn(
        "flex min-w-0 flex-col gap-1 overflow-x-auto px-4 py-3 font-mono text-[0.8125rem] leading-[1.375rem] outline-none [&>[data-slot=terminal-command]:not(:first-child)]:mt-3",
        className
      )}
      {...props}
    />
  )
}

function TerminalCommand({
  children,
  prompt = "$",
  className,
  ...props
}: Omit<React.ComponentProps<"div">, "children"> & {
  /** What was typed. */
  children: string
  /** The mark before it, left out of a copy. */
  prompt?: string
}) {
  const lines = useHighlightedLines(children, "bash")

  return (
    <div
      data-slot="terminal-command"
      className={cn("flex min-w-max gap-2", className)}
      {...props}
    >
      <span aria-hidden className="text-muted-foreground select-none">
        {prompt}
      </span>
      <code className="whitespace-pre">
        {lines.map((tokens, index) => (
          <React.Fragment key={index}>
            {index > 0 ? "\n" : null}
            <CodeTokens tokens={tokens} />
          </React.Fragment>
        ))}
      </code>
    </div>
  )
}

function TerminalOutput({
  tone = "default",
  className,
  ...props
}: React.ComponentProps<"pre"> & {
  /** `error` sets what a failed run printed in the destructive ink. */
  tone?: "default" | "error"
}) {
  return (
    <pre
      data-slot="terminal-output"
      data-tone={tone}
      className={cn(
        "min-w-max font-[inherit] whitespace-pre text-muted-foreground data-[tone=error]:text-destructive",
        className
      )}
      {...props}
    />
  )
}

function TerminalStatus({
  status,
  exitCode,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  status: "running" | "success" | "error"
  /** Said after a failure, like "Exited with 1". */
  exitCode?: number
}) {
  return (
    <div
      data-slot="terminal-status"
      data-status={status}
      role={status === "running" ? "status" : undefined}
      className={cn(
        "flex items-center gap-2 font-sans text-xs text-muted-foreground",
        className
      )}
      {...props}
    >
      <Status
        variant={
          status === "running"
            ? "live"
            : status === "error"
              ? "destructive"
              : "success"
        }
        pulse={status === "running"}
        className="border-0 bg-transparent p-0 dark:bg-transparent"
      >
        <StatusIndicator />
      </Status>
      <span
        className={cn(
          status === "running" && "shimmer motion-reduce:animate-none"
        )}
      >
        {children ??
          (status === "running"
            ? "Running"
            : status === "error"
              ? exitCode === undefined
                ? "Failed"
                : `Exited with ${exitCode}`
              : "Done")}
      </span>
    </div>
  )
}

export { TerminalCommand, TerminalContent, TerminalOutput, TerminalStatus }
