"use client"

import * as React from "react"

import { Bubble, BubbleContent } from "@/registry/aiellie/components/bubble"
import { Message, MessageContent } from "@/registry/aiellie/components/message"
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/registry/aiellie/components/message-scroller"
import { Button } from "@/registry/aiellie/ui/button"

const LINES = [
  "What's a good first plant?",
  "A pothos. It grows in low light and tells you when it's thirsty by drooping.",
  "How often should I water it?",
  "When the top few centimetres of soil are dry, usually about once a week.",
  "Does it need fertiliser?",
  "Once a month in spring and summer is plenty. Skip it in winter.",
]

export default function MessageScrollerDemo() {
  const [count, setCount] = React.useState(LINES.length)

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden">
      <MessageScrollerProvider autoScroll>
        <MessageScroller>
          <MessageScrollerViewport>
            <MessageScrollerContent className="mx-auto w-full max-w-md px-4 py-6">
              {Array.from({ length: count }, (_, index) => {
                const mine = index % 2 === 0
                return (
                  <MessageScrollerItem
                    key={index}
                    messageId={String(index)}
                    scrollAnchor={mine}
                  >
                    <Message align={mine ? "end" : "start"}>
                      <MessageContent>
                        <Bubble variant={mine ? "secondary" : "ghost"}>
                          <BubbleContent>
                            {LINES[index % LINES.length]}
                          </BubbleContent>
                        </Bubble>
                      </MessageContent>
                    </Message>
                  </MessageScrollerItem>
                )
              })}
            </MessageScrollerContent>
          </MessageScrollerViewport>
          <MessageScrollerButton />
        </MessageScroller>
      </MessageScrollerProvider>
      <div className="flex justify-center pb-3">
        <Button variant="outline" size="sm" onClick={() => setCount((n) => n + 2)}>
          Add a turn
        </Button>
      </div>
    </div>
  )
}
