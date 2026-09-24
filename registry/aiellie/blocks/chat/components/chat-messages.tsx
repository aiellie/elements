"use client"

import * as React from "react"
import {
  Copy01Icon,
  PencilEdit01Icon,
  RepeatIcon,
  Tick02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  ChatAttachments,
  type ChatAttachment,
} from "@/registry/aiellie/blocks/chat/components/chat-attachments"
import {
  Message,
  MessageActions,
  MessageContent,
} from "@/registry/aiellie/components/message"
import {
  Status,
  StatusIndicator,
  StatusLabel,
} from "@/registry/aiellie/components/status"
import { TooltipIconButton } from "@/registry/aiellie/components/tooltip-icon-button"

type ChatMessage = {
  id: string
  role: "user" | "assistant"
  content: string
  attachments?: ChatAttachment[]
  /** Left out once a reply has finished. */
  status?: "streaming" | "stopped" | "failed"
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = React.useState(false)

  React.useEffect(() => {
    if (!copied) return
    const timeout = setTimeout(() => setCopied(false), 1500)
    return () => clearTimeout(timeout)
  }, [copied])

  return (
    <TooltipIconButton
      tooltip={copied ? "Copied" : "Copy"}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text)
          setCopied(true)
        } catch {
          // Refused, so there is nothing to confirm.
        }
      }}
    >
      <HugeiconsIcon icon={copied ? Tick02Icon : Copy01Icon} />
    </TooltipIconButton>
  )
}

function ChatMessages({
  messages,
  onRetry,
  onEdit,
}: {
  messages: ChatMessage[]
  onRetry: (id: string) => void
  onEdit: (content: string) => void
}) {
  return messages.map((message) => {
    const streaming = message.status === "streaming"

    return (
      <Message key={message.id} from={message.role} streaming={streaming}>
        {message.attachments ? (
          <ChatAttachments
            attachments={message.attachments}
            size="xs"
            className="max-w-full"
          />
        ) : null}
        {message.content || streaming ? (
          <MessageContent>{message.content}</MessageContent>
        ) : null}
        {message.status === "failed" ? (
          <div className="flex items-center gap-2">
            <Status variant="destructive">
              <StatusIndicator />
              <StatusLabel>Failed</StatusLabel>
            </Status>
            <TooltipIconButton
              tooltip="Retry"
              onClick={() => onRetry(message.id)}
            >
              <HugeiconsIcon icon={RepeatIcon} />
            </TooltipIconButton>
          </div>
        ) : streaming || !message.content ? null : (
          <MessageActions>
            <CopyButton text={message.content} />
            {message.role === "assistant" ? (
              <TooltipIconButton
                tooltip="Retry"
                onClick={() => onRetry(message.id)}
              >
                <HugeiconsIcon icon={RepeatIcon} />
              </TooltipIconButton>
            ) : (
              <TooltipIconButton
                tooltip="Edit"
                onClick={() => onEdit(message.content)}
              >
                <HugeiconsIcon icon={PencilEdit01Icon} />
              </TooltipIconButton>
            )}
          </MessageActions>
        )}
      </Message>
    )
  })
}

export { ChatMessages }
export type { ChatMessage }
