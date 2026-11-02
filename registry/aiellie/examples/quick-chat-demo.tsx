"use client"

import * as React from "react"

import {
  QuickChat,
  type QuickChatMessage,
} from "@/registry/aiellie/components/quick-chat"
import { Button } from "@/registry/aiellie/ui/button"

const INITIAL_MESSAGES: QuickChatMessage[] = [
  {
    id: "welcome",
    from: "assistant",
    content: "What can I help you work through?",
  },
]

const REPLY =
  "Here's a quick answer, kept to the side so your main chat stays as it was."

export default function QuickChatDemo() {
  const [open, setOpen] = React.useState(true)
  const [messages, setMessages] =
    React.useState<QuickChatMessage[]>(INITIAL_MESSAGES)
  const [streaming, setStreaming] = React.useState(false)
  const timer = React.useRef<ReturnType<typeof setTimeout>>(undefined)

  React.useEffect(() => () => clearTimeout(timer.current), [])

  return (
    <div className="relative flex h-full w-full items-center justify-center">
      {open ? (
        <QuickChat
          open={open}
          onOpenChange={setOpen}
          onNewChat={() => setMessages(INITIAL_MESSAGES)}
          messages={messages}
          status={streaming ? "streaming" : "ready"}
          onSubmit={(text) => {
            const id = crypto.randomUUID()
            setMessages((current) => [
              ...current,
              { id: `${id}-q`, from: "user", content: text },
              { id, from: "assistant", content: "", streaming: true },
            ])
            setStreaming(true)
            timer.current = setTimeout(() => {
              setMessages((current) =>
                current.map((message) =>
                  message.id === id
                    ? { ...message, content: REPLY, streaming: false }
                    : message
                )
              )
              setStreaming(false)
            }, 900)
          }}
          onStop={() => {
            clearTimeout(timer.current)
            setStreaming(false)
          }}
          className="absolute inset-4"
        />
      ) : (
        <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
          Open quick chat
        </Button>
      )}
    </div>
  )
}
