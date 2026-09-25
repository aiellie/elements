"use client"

import * as React from "react"
import { Cancel01Icon, PencilEdit02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  Composer,
  ComposerFooter,
  ComposerInput,
  ComposerSubmit,
  type ComposerStatus,
} from "@/registry/aiellie/components/composer"
import {
  Message,
  MessageContent,
  MessagePart,
} from "@/registry/aiellie/components/message"
import {
  Thread,
  ThreadContent,
  ThreadScrollButton,
} from "@/registry/aiellie/components/thread"
import { TooltipIconButton } from "@/registry/aiellie/components/tooltip-icon-button"
import { cn } from "@/lib/utils"

type QuickChatMessage = {
  id: string
  from: "user" | "assistant"
  content: string
  attachments?: React.ReactNode
  streaming?: boolean
}

function QuickChat({
  open,
  onOpenChange,
  onNewChat,
  messages,
  onSubmit,
  onStop,
  status = "ready",
  title = "Quick chat",
  placeholder = "Ask anything",
  empty = "Ask something without leaving this page.",
  composer,
  autoFocus = true,
  className,
  ...props
}: Omit<React.ComponentProps<"section">, "title" | "onSubmit"> & {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Starts another conversation without closing the panel. */
  onNewChat?: () => void
  messages: QuickChatMessage[]
  onSubmit?: (value: string) => void
  onStop?: () => void
  status?: ComposerStatus
  title?: React.ReactNode
  placeholder?: string
  empty?: React.ReactNode
  /** Replaces the compact composer while keeping it inside the panel footer. */
  composer?: React.ReactNode
  autoFocus?: boolean
}) {
  const titleId = React.useId()
  const rootRef = React.useRef<HTMLElement>(null)
  const previousFocusRef = React.useRef<HTMLElement | null>(null)
  const wasOpenRef = React.useRef(false)

  React.useEffect(() => {
    if (open && !wasOpenRef.current) {
      previousFocusRef.current =
        document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null
      if (autoFocus) {
        requestAnimationFrame(() =>
          rootRef.current?.querySelector("textarea")?.focus()
        )
      }
    } else if (!open && wasOpenRef.current) {
      previousFocusRef.current?.focus()
    }
    wasOpenRef.current = open
  }, [autoFocus, open])

  React.useEffect(() => {
    if (!open) return
    const close = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return
      event.preventDefault()
      onOpenChange(false)
    }
    window.addEventListener("keydown", close)
    return () => window.removeEventListener("keydown", close)
  }, [onOpenChange, open])

  return (
    <section
      ref={rootRef}
      data-slot="quick-chat"
      data-state={open ? "open" : "closed"}
      role="dialog"
      aria-modal="false"
      aria-labelledby={titleId}
      aria-hidden={!open}
      inert={!open}
      className={cn(
        "fixed end-4 bottom-4 flex h-80 w-72 origin-bottom-right flex-col overflow-hidden rounded-xl border border-border bg-popover text-popover-foreground shadow-md backdrop-blur-xs transition-[opacity,scale,translate] duration-150 ease-[cubic-bezier(0.16,1,0.3,1)] supports-[backdrop-filter]:bg-background/60 sm:h-96 sm:w-96 rtl:origin-bottom-left",
        "data-[state=closed]:pointer-events-none data-[state=closed]:translate-y-2 data-[state=closed]:scale-95 data-[state=closed]:opacity-0 motion-reduce:transition-none",
        className
      )}
      {...props}
    >
      <header
        data-slot="quick-chat-header"
        className="flex h-10 shrink-0 items-center gap-2 border-b border-border/60 px-3"
      >
        <h2
          id={titleId}
          className="min-w-0 flex-1 truncate text-sm font-medium"
        >
          {title}
        </h2>
        {onNewChat ? (
          <TooltipIconButton
            type="button"
            tooltip="New quick chat"
            onClick={() => {
              onNewChat()
              requestAnimationFrame(() =>
                rootRef.current?.querySelector("textarea")?.focus()
              )
            }}
            className="size-7"
          >
            <HugeiconsIcon icon={PencilEdit02Icon} aria-hidden />
          </TooltipIconButton>
        ) : null}
        <TooltipIconButton
          type="button"
          tooltip="Close quick chat"
          side="left"
          onClick={() => onOpenChange(false)}
          className="size-7"
        >
          <HugeiconsIcon icon={Cancel01Icon} aria-hidden />
        </TooltipIconButton>
      </header>
      <Thread>
        <ThreadContent className="gap-4 px-3 py-4">
          {messages.length > 0 ? (
            messages.map((message) => (
              <Message
                key={message.id}
                align={message.from === "user" ? "end" : "start"}
                variant={message.from === "user" ? "secondary" : "ghost"}
                streaming={message.streaming}
              >
                <MessageContent>
                  {message.attachments}
                  {message.content || message.streaming ? (
                    <MessagePart>{message.content}</MessagePart>
                  ) : null}
                </MessageContent>
              </Message>
            ))
          ) : (
            <p className="m-auto max-w-56 text-center text-xs leading-5 text-foreground/60">
              {empty}
            </p>
          )}
        </ThreadContent>
        <ThreadScrollButton />
      </Thread>
      <div
        data-slot="quick-chat-footer"
        className={cn("shrink-0", !composer && "p-3 pt-0")}
      >
        {composer ?? (
          <Composer
            status={status}
            onSubmit={onSubmit ?? (() => {})}
            onStop={onStop}
            disabled={!onSubmit}
          >
            <ComposerInput placeholder={placeholder} className="min-h-8" />
            <ComposerFooter>
              <ComposerSubmit />
            </ComposerFooter>
          </Composer>
        )}
      </div>
    </section>
  )
}

export { QuickChat }
export type { QuickChatMessage }
