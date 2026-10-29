"use client"

import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { Cancel01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { cn } from "@/lib/utils"
import { TooltipIconButton } from "@/registry/aiellie/ui/tooltip-icon-button"

function QuotedMessage({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="quoted-message"
      className={cn(
        "flex w-full min-w-0 items-start gap-1 border-s-2 border-border ps-2.5 text-sm",
        className
      )}
      {...props}
    />
  )
}

// A button or a link when the quote leads back to what it quotes.
function QuotedMessageContent({
  lines = 2,
  className,
  render,
  ...props
}: useRender.ComponentProps<"div"> & {
  /** How many lines of the excerpt show before it's cut. */
  lines?: 1 | 2 | 3
}) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        className: cn(
          "flex min-w-0 flex-1 flex-col gap-0.5 rounded-sm border border-transparent py-0.5 text-start text-muted-foreground outline-none",
          "[button,a]:transition-colors [button,a]:duration-80 [button,a]:hover:text-foreground [button,a]:focus-visible:border-ring [button,a]:motion-reduce:transition-none",
          lines === 1 && "*:data-[slot=quoted-message-text]:line-clamp-1",
          lines === 2 && "*:data-[slot=quoted-message-text]:line-clamp-2",
          lines === 3 && "*:data-[slot=quoted-message-text]:line-clamp-3",
          className
        ),
      },
      props
    ),
    render,
    state: { slot: "quoted-message-content" },
  })
}

function QuotedMessageAuthor({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="quoted-message-author"
      className={cn("truncate text-xs font-medium text-foreground", className)}
      {...props}
    />
  )
}

function QuotedMessageText({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="quoted-message-text"
      className={cn("whitespace-pre-wrap", className)}
      {...props}
    />
  )
}

function QuotedMessageDismiss({
  tooltip = "Remove quote",
  ...props
}: Omit<
  React.ComponentProps<typeof TooltipIconButton>,
  "tooltip" | "children"
> & {
  tooltip?: string
}) {
  return (
    <TooltipIconButton
      data-slot="quoted-message-dismiss"
      tooltip={tooltip}
      {...props}
    >
      <HugeiconsIcon aria-hidden icon={Cancel01Icon} />
    </TooltipIconButton>
  )
}

export {
  QuotedMessage,
  QuotedMessageAuthor,
  QuotedMessageContent,
  QuotedMessageDismiss,
  QuotedMessageText,
}
