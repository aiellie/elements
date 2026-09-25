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
  MessageAction,
  MessageActions,
  MessageContent,
  MessageFooter,
  MessagePart,
} from "@/registry/aiellie/components/message"
import {
  Status,
  StatusIndicator,
  StatusLabel,
} from "@/registry/aiellie/components/status"
import { StreamText } from "@/registry/aiellie/components/stream-text"

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
    <MessageAction
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
    </MessageAction>
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
      <Message
        key={message.id}
        align={message.role === "user" ? "end" : "start"}
        variant={message.role === "user" ? "secondary" : "ghost"}
        streaming={streaming}
      >
        <MessageContent>
          {message.attachments ? (
            <ChatAttachments
              attachments={message.attachments}
              size="xs"
              className="max-w-full group-data-[align=end]/message:self-end"
            />
          ) : null}
          {message.content || streaming ? (
            <MessagePart>
              {message.role === "assistant" ? (
                <StreamText text={message.content} streaming={streaming} />
              ) : (
                message.content
              )}
            </MessagePart>
          ) : null}
          {message.status === "failed" ? (
            <MessageFooter>
              <Status variant="destructive">
                <StatusIndicator />
                <StatusLabel>Failed</StatusLabel>
              </Status>
              <MessageAction
                tooltip="Retry"
                onClick={() => onRetry(message.id)}
              >
                <HugeiconsIcon icon={RepeatIcon} />
              </MessageAction>
            </MessageFooter>
          ) : streaming || !message.content ? null : (
            <MessageFooter>
              <MessageActions>
                <CopyButton text={message.content} />
                {message.role === "assistant" ? (
                  <MessageAction
                    tooltip="Retry"
                    onClick={() => onRetry(message.id)}
                  >
                    <HugeiconsIcon icon={RepeatIcon} />
                  </MessageAction>
                ) : (
                  <MessageAction
                    tooltip="Edit"
                    onClick={() => onEdit(message.content)}
                  >
                    <HugeiconsIcon icon={PencilEdit01Icon} />
                  </MessageAction>
                )}
              </MessageActions>
            </MessageFooter>
          )}
        </MessageContent>
      </Message>
    )
  })
}

export { ChatMessages }
export type { ChatMessage }
