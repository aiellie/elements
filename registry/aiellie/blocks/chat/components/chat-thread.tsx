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
