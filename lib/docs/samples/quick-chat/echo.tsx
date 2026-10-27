"use client"

import * as React from "react"

import {
  QuickChat,
  type QuickChatMessage,
} from "@/registry/aiellie/components/quick-chat"
import { Button } from "@/registry/aiellie/ui/button"

export default function Echo() {
  const [open, setOpen] = React.useState(false)
  const [messages, setMessages] = React.useState<QuickChatMessage[]>([])

  return (
    <div className="relative flex h-96 w-full items-center justify-center">
      <Button variant="outline" onClick={() => setOpen(!open)}>
        {open ? "Close" : "Open"} quick chat
      </Button>
      <QuickChat
        open={open}
        onOpenChange={setOpen}
        onNewChat={() => setMessages([])}
        messages={messages}
        onSubmit={(text) =>
          setMessages((all) => [
            ...all,
            { id: crypto.randomUUID(), from: "user", content: text },
            {
              id: crypto.randomUUID(),
              from: "assistant",
              content: `You said “${text}”.`,
            },
          ])
        }
        className="absolute end-0 bottom-0 sm:h-80 sm:w-80"
      />
    </div>
  )
}
