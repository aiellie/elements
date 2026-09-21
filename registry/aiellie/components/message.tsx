import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * One turn in a conversation. `from` decides its shape: what the person wrote
 * sits in a bubble at the end of the column, and what the assistant wrote runs
 * the full width as plain text, because a reply is read rather than glanced at.
 *
 * It is `from` rather than `role` because `role` already means something on an
 * element, and a screen reader would read it as that.
 */
function Message({
  from,
  streaming = false,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  from: "user" | "assistant"
  /** The reply is still being written: it shows a caret and reads as busy. */
  streaming?: boolean
}) {
  return (
    <div
      data-slot="message"
      data-from={from}
      data-streaming={streaming || undefined}
      aria-busy={streaming || undefined}
      className={cn(
        "group/message flex w-full flex-col gap-1.5 data-[from=assistant]:items-start data-[from=user]:items-end",
        className
      )}
      {...props}
    />
  )
}

/**
 * The words. Line breaks in the text are kept, so plain text with blank lines
 * between paragraphs reads as paragraphs.
 *
 * The caret is part of the content rather than a separate piece, so it always
 * sits after the last word, and it only shows while the message is streaming.
 */
function MessageContent({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="message-content"
      className={cn(
        "max-w-full text-sm leading-6 break-words whitespace-pre-wrap",
        "group-data-[from=user]/message:max-w-[80%] group-data-[from=user]/message:rounded-lg group-data-[from=user]/message:bg-secondary group-data-[from=user]/message:px-3 group-data-[from=user]/message:py-1.5 group-data-[from=user]/message:text-secondary-foreground",
        className
      )}
      {...props}
    >
      {children}
      <span
        aria-hidden
        data-slot="message-caret"
        className="ms-0.5 hidden h-3.5 w-0.5 animate-caret-blink bg-current align-middle group-data-streaming/message:inline-block"
      />
    </div>
  )
}

/**
 * The controls under a message: copy, retry, edit. On screens with a pointer
 * they wait until the message is hovered or one of them has focus. A touch
 * screen has no hover to reveal them with, so there they stay visible.
 */
function MessageActions({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="message-actions"
      className={cn(
        "flex items-center gap-0.5 transition-opacity duration-150 motion-reduce:transition-none",
        "pointer-fine:opacity-0 pointer-fine:group-hover/message:opacity-100 pointer-fine:focus-within:opacity-100",
        className
      )}
      {...props}
    />
  )
}

export { Message, MessageActions, MessageContent }
