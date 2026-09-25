"use client"

import { ChatEmpty } from "@/registry/aiellie/blocks/chat/components/chat-empty"
import {
  ChatMessages,
  type ChatMessage,
} from "@/registry/aiellie/blocks/chat/components/chat-messages"
import type { NavBarsItem } from "@/registry/aiellie/components/nav-bars"
import { usePanels } from "@/registry/aiellie/components/panels"
import {
  Thread,
  ThreadContent,
  ThreadItem,
  ThreadProvider,
  ThreadScrollButton,
  ThreadViewport,
} from "@/registry/aiellie/components/thread"
import { ThreadTranscript } from "@/registry/aiellie/components/thread-transcript"

// One item per question, with the reply that answered it underneath.
function turnsOf(messages: ChatMessage[]): NavBarsItem[] {
  return messages.flatMap((message, index) => {
    if (message.role !== "user") return []
    const reply = messages[index + 1]
    return {
      id: message.id,
      label: message.content || message.attachments?.[0]?.name || "Attachment",
      description: reply?.role === "assistant" ? reply.content : undefined,
    }
  })
}

function ChatThread({
  messages,
  temporary,
  onSend,
  onRetry,
  onEdit,
  onAddKey,
}: {
  messages: ChatMessage[]
  temporary?: boolean
  onSend: (prompt: string) => void
  onRetry: (id: string) => void
  onEdit: (content: string) => void
  /** Offered while replies are samples, for want of an API key. */
  onAddKey?: () => void
}) {
  const { isOpen } = usePanels()
  const turns = turnsOf(messages)

  return (
    <ThreadProvider autoScroll defaultScrollPosition="last-anchor">
      <Thread>
        <ThreadViewport aria-label="Conversation">
          {/* Room for the glass header over the top, plus the usual 24px. */}
          <ThreadContent className="pt-16">
            {messages.length === 0 ? (
              <ThreadItem className="flex flex-1 flex-col">
                <ChatEmpty
                  temporary={temporary}
                  onSelect={onSend}
                  onAddKey={onAddKey}
                />
              </ThreadItem>
            ) : (
              <ChatMessages
                messages={messages}
                onRetry={onRetry}
                onEdit={onEdit}
              />
            )}
          </ThreadContent>
        </ThreadViewport>
        {/* In the sidebar's place while it's folded away. */}
        {!isOpen("left") && turns.length > 1 ? (
          <ThreadTranscript variant="peek" items={turns} />
        ) : null}
        <ThreadScrollButton />
      </Thread>
    </ThreadProvider>
  )
}

export { ChatThread }
