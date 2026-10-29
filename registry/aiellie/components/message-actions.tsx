"use client"

import * as React from "react"
import {
  Copy01Icon,
  MoreHorizontalIcon,
  PencilEdit01Icon,
  RepeatIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
  Tick02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { cn } from "@/lib/utils"
import {
  Menu,
  MenuContent,
  MenuTrigger,
} from "@/registry/aiellie/ui/menu"
import { MessageAction } from "@/registry/aiellie/components/message"

type ActionProps = Omit<
  React.ComponentProps<typeof MessageAction>,
  "tooltip" | "children"
> & {
  tooltip?: string
}

function MessageCopyAction({
  text,
  tooltip = "Copy",
  onCopy,
  ...props
}: Omit<ActionProps, "onCopy"> & {
  /** What goes on the clipboard. */
  text: string
  onCopy?: () => void
}) {
  const [copied, setCopied] = React.useState(false)

  React.useEffect(() => {
    if (!copied) return
    const timeout = setTimeout(() => setCopied(false), 1500)
    return () => clearTimeout(timeout)
  }, [copied])

  return (
    <MessageAction
      data-slot="message-copy-action"
      tooltip={copied ? "Copied" : tooltip}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text)
          setCopied(true)
          onCopy?.()
        } catch {
          // Refused, so there is nothing to confirm.
        }
      }}
      {...props}
    >
      <HugeiconsIcon aria-hidden icon={copied ? Tick02Icon : Copy01Icon} />
    </MessageAction>
  )
}

function MessageRetryAction({ tooltip = "Retry", ...props }: ActionProps) {
  return (
    <MessageAction
      data-slot="message-retry-action"
      tooltip={tooltip}
      {...props}
    >
      <HugeiconsIcon
        aria-hidden
        icon={RepeatIcon}
        className="rtl:-scale-x-100"
      />
    </MessageAction>
  )
}

function MessageEditAction({ tooltip = "Edit", ...props }: ActionProps) {
  return (
    <MessageAction data-slot="message-edit-action" tooltip={tooltip} {...props}>
      <HugeiconsIcon aria-hidden icon={PencilEdit01Icon} />
    </MessageAction>
  )
}

type Feedback = "up" | "down"

// Pressing the rating that's already chosen takes it back.
function MessageFeedback({
  value,
  onValueChange,
  className,
  ...props
}: Omit<React.ComponentProps<"div">, "onChange"> & {
  value: Feedback | null
  onValueChange: (value: Feedback | null) => void
}) {
  return (
    <div
      data-slot="message-feedback"
      role="group"
      aria-label="Rate this reply"
      className={cn("flex items-center gap-0.5", className)}
      {...props}
    >
      {(["up", "down"] as const).map((rating) => (
        <MessageAction
          key={rating}
          tooltip={rating === "up" ? "Good reply" : "Bad reply"}
          aria-pressed={value === rating}
          onClick={() => onValueChange(value === rating ? null : rating)}
          className="aria-pressed:[&_svg]:text-foreground"
        >
          <HugeiconsIcon
            aria-hidden
            icon={rating === "up" ? ThumbsUpIcon : ThumbsDownIcon}
          />
        </MessageAction>
      ))}
    </div>
  )
}

function MessageMoreActions({
  tooltip = "More",
  side = "bottom",
  align = "start",
  children,
  ...props
}: ActionProps & {
  /** Menu rows, like `MenuItem`s. */
  children: React.ReactNode
  side?: React.ComponentProps<typeof MenuContent>["side"]
  align?: React.ComponentProps<typeof MenuContent>["align"]
}) {
  return (
    <Menu>
      <MenuTrigger
        data-slot="message-more-actions"
        render={<MessageAction tooltip={tooltip} {...props} />}
      >
        <HugeiconsIcon aria-hidden icon={MoreHorizontalIcon} />
      </MenuTrigger>
      <MenuContent side={side} align={align}>
        {children}
      </MenuContent>
    </Menu>
  )
}

export {
  MessageCopyAction,
  MessageEditAction,
  MessageFeedback,
  MessageMoreActions,
  MessageRetryAction,
}
export type { Feedback }
