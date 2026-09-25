"use client"

import * as React from "react"
import { ArrowUp02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  Message,
  MessageContent,
  MessagePart,
} from "@/registry/aiellie/components/message"
import { StreamText } from "@/registry/aiellie/components/stream-text"
import {
  Thread,
  ThreadContent,
  ThreadItem,
  ThreadProvider,
  ThreadScrollButton,
  ThreadViewport,
} from "@/registry/aiellie/components/thread"
import { Button } from "@/registry/aiellie/ui/button"

type Turn = { id: string; from: "user" | "assistant"; text: string }

const HISTORY: Turn[] = [
  { id: "1", from: "user", text: "Can you help me plan a small launch?" },
  {
    id: "2",
    from: "assistant",
    text: "Of course. What's launching, and who is it for?",
  },
  {
    id: "3",
    from: "user",
    text: "A component registry, for people building AI apps.",
  },
  {
    id: "4",
    from: "assistant",
    text: "Then the launch is mostly a demo. Lead with one page that shows the pieces working together, and make each piece installable on its own.",
  },
]

const PROMPTS = [
  "What should that page show first?",
  "And after that?",
  "How do I keep people reading?",
]

const REPLIES = [
  "A conversation, since that's where the pieces meet: a thread that holds your place, messages that stream in, and a composer for the next one. Notice that your question settled near the top, with a slice of the last reply still above it.",
  "The pieces one at a time, each with its install command. Scroll up while this streams and the thread stays where you left it, until you jump back to the latest.",
  "Don't move the page under them. Anchor each new turn, follow the stream only while they're at the end, and leave them be once they scroll away.",
]

export default function ThreadDemo() {
  const [turns, setTurns] = React.useState(HISTORY)
  const [streamingId, setStreamingId] = React.useState<string>()
  const sent = (turns.length - HISTORY.length) / 2

  React.useEffect(() => {
    if (!streamingId) return
    const full = REPLIES[(sent - 1) % REPLIES.length]
    let length = 0
    const timer = setInterval(() => {
      length += 6
      setTurns((current) =>
        current.map((turn) =>
          turn.id === streamingId
            ? { ...turn, text: full.slice(0, length) }
            : turn
        )
      )
      if (length >= full.length) {
        clearInterval(timer)
        setStreamingId(undefined)
      }
    }, 45)
    return () => clearInterval(timer)
  }, [streamingId, sent])

  const send = () => {
    const id = String(turns.length + 1)
    setTurns((current) => [
      ...current,
      { id, from: "user", text: PROMPTS[sent % PROMPTS.length] },
      { id: `${id}-reply`, from: "assistant", text: "" },
    ])
    setStreamingId(`${id}-reply`)
  }

  return (
    <div className="flex h-72 w-full max-w-md flex-col overflow-hidden rounded-xl border bg-background">
      <ThreadProvider autoScroll defaultScrollPosition="last-anchor">
        <Thread>
          <ThreadViewport aria-label="Conversation">
            <ThreadContent className="gap-4 px-3 py-4">
              {turns.map((turn) => {
                const live = streamingId === turn.id

                return (
                  <ThreadItem
                    key={turn.id}
                    messageId={turn.id}
                    scrollAnchor={turn.from === "user"}
                  >
                    <Message
                      align={turn.from === "user" ? "end" : "start"}
                      variant={turn.from === "user" ? "secondary" : "ghost"}
                    >
                      <MessageContent>
                        <MessagePart>
                          {turn.from === "assistant" ? (
                            <StreamText text={turn.text} streaming={live} />
                          ) : (
                            turn.text
                          )}
                        </MessagePart>
                      </MessageContent>
                    </Message>
                  </ThreadItem>
                )
              })}
            </ThreadContent>
          </ThreadViewport>
          <ThreadScrollButton />
        </Thread>
      </ThreadProvider>
      <div className="flex items-center justify-between gap-2 border-t px-3 py-2">
        <span className="truncate text-xs text-muted-foreground">
          {PROMPTS[sent % PROMPTS.length]}
        </span>
        <Button size="sm" onClick={send} disabled={streamingId !== undefined}>
          <HugeiconsIcon
            icon={ArrowUp02Icon}
            data-icon="inline-start"
            aria-hidden
          />
          Send
        </Button>
      </div>
    </div>
  )
}
