"use client"

import type { UIMessage } from "ai"

import { Bubble, BubbleContent } from "@/registry/aiellie/components/bubble"
import { Message, MessageContent } from "@/registry/aiellie/components/message"
import {
  MessageScroller,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/registry/aiellie/components/message-scroller"
import { ThreadTranscript } from "@/registry/aiellie/components/thread-transcript"

const TURNS = [
  "Can you help me plan a weekend in Lisbon?",
  "Of course. Start in Alfama on Saturday morning, before the streets fill up, then take tram 28 up to Graça for the view.",
  "Where should we eat on Saturday night?",
  "Book a table in Bairro Alto, or cross to Cais do Sodré for the food hall if you'd rather not plan ahead.",
  "And Sunday?",
  "Take the train out to Belém. Get there early for the pastries, then walk along the river to the monument.",
  "Is it worth going to Sintra?",
  "If you have a whole day, yes. Go on a weekday if you can, since weekends are crowded.",
  "What should I pack?",
  "Comfortable shoes above all. The hills are steep and the pavements get slippery.",
]

const MESSAGES: UIMessage[] = TURNS.map((text, index) => ({
  id: String(index),
  role: index % 2 === 0 ? "user" : "assistant",
  parts: [{ type: "text", text }],
}))

export default function ThreadTranscriptDemo() {
  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden">
      <MessageScrollerProvider>
        <MessageScroller className="@container">
          <MessageScrollerViewport>
            <MessageScrollerContent className="mx-auto w-full max-w-md px-4 py-6">
              {MESSAGES.map((message) => (
                <MessageScrollerItem key={message.id} messageId={message.id}>
                  <Message align={message.role === "user" ? "end" : "start"}>
                    <MessageContent>
                      <Bubble
                        variant={message.role === "user" ? "secondary" : "ghost"}
                      >
                        <BubbleContent>
                          {message.parts[0].type === "text"
                            ? message.parts[0].text
                            : null}
                        </BubbleContent>
                      </Bubble>
                    </MessageContent>
                  </Message>
                </MessageScrollerItem>
              ))}
            </MessageScrollerContent>
          </MessageScrollerViewport>
          <ThreadTranscript messages={MESSAGES} />
        </MessageScroller>
      </MessageScrollerProvider>
    </div>
  )
}
