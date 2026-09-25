"use client"

import { ChatEmpty } from "@/registry/aiellie/blocks/chat/components/chat-empty"
import {
  ChatMessages,
  type ChatMessage,
} from "@/registry/aiellie/blocks/chat/components/chat-messages"
import {
  Thread,
  ThreadContent,
  ThreadItem,
  ThreadProvider,
  ThreadScrollButton,
  ThreadViewport,
} from "@/registry/aiellie/components/thread"

function ChatThread({
  messages,
  temporary,
  onSend,
  onRetry,
  onEdit,
}: {
  messages: ChatMessage[]
  temporary?: boolean
  onSend: (prompt: string) => void
  onRetry: (id: string) => void
  onEdit: (content: string) => void
}) {
  return (
    <ThreadProvider autoScroll defaultScrollPosition="last-anchor">
      <Thread>
        <ThreadViewport aria-label="Conversation">
          <ThreadContent>
            {messages.length === 0 ? (
              <ThreadItem className="flex flex-1 flex-col">
                <ChatEmpty temporary={temporary} onSelect={onSend} />
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
        <ThreadScrollButton />
      </Thread>
    </ThreadProvider>
  )
}

export { ChatThread }
