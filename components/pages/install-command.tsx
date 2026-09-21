"use client"

import * as React from "react"
import { Copy01Icon, Tick02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { writeToClipboard } from "@/components/pages/demo-actions"
import { toast } from "@/components/ui/toast"
import { cn } from "@/lib/utils"

/**
 * A command set out to be copied. The whole pill is the button, so there is
 * no small icon to aim for, and the copy mark turns into a tick for a moment
 * where the eye already is. If the clipboard refuses, the command goes out in
 * a toast instead, so there is still something to take by hand.
 */
function InstallCommand({
  command,
  className,
}: {
  command: string
  className?: string
}) {
  const [copied, setCopied] = React.useState(false)

  React.useEffect(() => {
    if (!copied) return
    const timeout = setTimeout(() => setCopied(false), 1500)
    return () => clearTimeout(timeout)
  }, [copied])

  return (
    <button
      type="button"
      onClick={async () => {
        if (await writeToClipboard(command)) {
          setCopied(true)
        } else {
          toast.add({
            title: "Could not copy",
            description: command,
            type: "error",
          })
        }
      }}
      className={cn(
        "inline-flex h-8 items-center gap-3 rounded-lg border border-border bg-background ps-3 pe-2.5 font-mono text-[13px] transition-colors outline-none hover:bg-muted focus-visible:border-ring",
        className
      )}
    >
      <span>
        <span aria-hidden className="text-muted-foreground select-none">
          ${" "}
        </span>
        {command}
      </span>
      <HugeiconsIcon
        aria-hidden
        icon={copied ? Tick02Icon : Copy01Icon}
        strokeWidth={1.75}
        className="size-3.5 text-muted-foreground"
      />
      <span className="sr-only">{copied ? "Copied" : "Copy command"}</span>
    </button>
  )
}

export { InstallCommand }
