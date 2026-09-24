import * as React from "react"

import { cn } from "@/lib/utils"

// `from` rather than `role`, which already means something on an element.
function Message({
  from,
  streaming = false,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  from: "user" | "assistant"
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
