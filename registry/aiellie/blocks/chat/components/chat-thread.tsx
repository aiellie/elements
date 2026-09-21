"use client"

import { ChatEmpty } from "@/registry/aiellie/blocks/chat/components/chat-empty"
import {
  ChatMessages,
  type ChatMessage,
} from "@/registry/aiellie/blocks/chat/components/chat-messages"
import {
  Thread,
  ThreadContent,
  ThreadScrollButton,
} from "@/registry/aiellie/components/thread"

/**
 * The middle of the page: the conversation so far, or the greeting when there
 * isn't one yet. Both sit in the same thread, so the page keeps one shape
 * whichever it is showing.
 */
function ChatThread({
  messages,
  onSend,
  onRetry,
  onEdit,
}: {
  messages: ChatMessage[]
  onSend: (prompt: string) => void
  onRetry: (id: string) => void
  onEdit: (content: string) => void
}) {
  return (
    <Thread>
      <ThreadContent>
        {messages.length === 0 ? (
          <ChatEmpty onSelect={onSend} />
        ) : (
          <ChatMessages messages={messages} onRetry={onRetry} onEdit={onEdit} />
        )}
      </ThreadContent>
      <ThreadScrollButton />
    </Thread>
  )
}

export { ChatThread }
