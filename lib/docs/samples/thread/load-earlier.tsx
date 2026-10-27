"use client"

import * as React from "react"

import {
  Message,
  MessageContent,
  MessagePart,
} from "@/registry/aiellie/components/message"
import {
  Thread,
  ThreadContent,
  ThreadItem,
  ThreadProvider,
  ThreadScrollButton,
  ThreadViewport,
} from "@/registry/aiellie/components/thread"
import { Button } from "@/registry/aiellie/ui/button"

type Turn = { id: number; from: "user" | "assistant"; text: string }

const page = (from: number): Turn[] =>
  Array.from({ length: 6 }, (_, index) => {
    const id = from + index
    return {
      id,
      from: id % 2 ? "assistant" : "user",
      text: id % 2 ? `Reply ${id}` : `Question ${id}`,
    }
  })

export default function LoadEarlier() {
  const [turns, setTurns] = React.useState(() => page(12))
  const first = turns[0].id

  return (
    <div className="flex h-72 w-full max-w-md flex-col overflow-hidden rounded-xl border bg-background">
      <ThreadProvider>
        <Thread>
          <ThreadViewport aria-label="Conversation">
            <ThreadContent className="gap-3 px-3 py-4">
              <ThreadItem className="self-center">
                <Button
                  variant="ghost"
                  size="xs"
                  disabled={first === 0}
                  onClick={() =>
                    setTurns((all) => [...page(Math.max(0, first - 6)), ...all])
                  }
                >
                  {first === 0 ? "The start of the chat" : "Load earlier"}
                </Button>
              </ThreadItem>
              {turns.map((turn) => (
                <ThreadItem key={turn.id} messageId={String(turn.id)}>
                  <Message
                    align={turn.from === "user" ? "end" : "start"}
                    variant={turn.from === "user" ? "secondary" : "ghost"}
                  >
                    <MessageContent>
                      <MessagePart>{turn.text}</MessagePart>
                    </MessageContent>
                  </Message>
                </ThreadItem>
              ))}
            </ThreadContent>
          </ThreadViewport>
          <ThreadScrollButton />
        </Thread>
      </ThreadProvider>
    </div>
  )
}
