"use client"

import * as React from "react"
import {
  Alert01Icon,
  Clock01Icon,
  Tick02Icon,
  TickDouble02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"

import { cn } from "@/lib/utils"

type MessageStatusValue = "sending" | "sent" | "delivered" | "read" | "failed"

const STATUS_LABELS: Record<MessageStatusValue, string> = {
  sending: "Sending",
  sent: "Sent",
  delivered: "Delivered",
  read: "Read",
  failed: "Not sent",
}

// Read is delivered's double tick in the live ink, rather than a third shape.
const STATUS_ICONS: Record<MessageStatusValue, IconSvgElement> = {
  sending: Clock01Icon,
  sent: Tick02Icon,
  delivered: TickDouble02Icon,
  read: TickDouble02Icon,
  failed: Alert01Icon,
}

function MessageStatus({
  status,
  labels,
  showLabel = false,
  onRetry,
  className,
  ...props
}: Omit<React.ComponentProps<"span">, "children"> & {
  status: MessageStatusValue
  /** Your own words for any of the states. */
  labels?: Partial<Record<MessageStatusValue, string>>
  showLabel?: boolean
  /** Adds "Try again" to a failed message. */
  onRetry?: () => void
}) {
  const label = labels?.[status] ?? STATUS_LABELS[status]

  return (
    <span
      data-slot="message-status"
      data-status={status}
      role="status"
      className={cn(
        "inline-flex items-center gap-1 text-xs text-muted-foreground data-[status=failed]:text-destructive data-[status=read]:text-foreground",
        className
      )}
      {...props}
    >
      <HugeiconsIcon
        aria-hidden
        icon={STATUS_ICONS[status]}
        className={cn(
          "size-3.5 shrink-0",
          status === "sending" && "animate-pulse motion-reduce:animate-none"
        )}
      />
      <span className={showLabel ? undefined : "sr-only"}>{label}</span>
      {status === "failed" && onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="cursor-pointer rounded-sm border border-transparent font-medium underline underline-offset-3 outline-none hover:text-destructive/80 focus-visible:border-ring"
        >
          Try again
        </button>
      ) : null}
    </span>
  )
}

export { MessageStatus, STATUS_LABELS }
export type { MessageStatusValue }
