"use client"

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
  ThreadViewport,
} from "@/registry/aiellie/components/thread"
import { ThreadTranscript } from "@/registry/aiellie/components/thread-transcript"

const TURNS = [
  [
    "Where should the launch post go?",
    "Your own blog first, then link it everywhere else.",
  ],
  [
    "How long should it be?",
    "Short enough to read on a phone: a few paragraphs and one demo.",
  ],
  [
    "What goes in the demo?",
    "One page that shows the pieces working together.",
  ],
  ["And the title?", "Say what it does, not what it's called."],
  [
    "When should it go out?",
    "Early in the week, in the morning where most readers are.",
  ],
  ["Anything to avoid?", "Asking for stars before showing anything."],
]

export default function Peek() {
  return (
    <div className="flex h-72 w-full max-w-lg flex-col overflow-hidden rounded-xl border bg-background">
      <ThreadProvider defaultScrollPosition="start">
        <Thread>
          <ThreadViewport aria-label="Conversation">
            <ThreadContent className="gap-4 py-4 ps-12 pe-4">
              {TURNS.map(([question, reply], index) => (
                <div key={question} className="flex flex-col gap-4">
                  <ThreadItem messageId={`q${index}`} scrollAnchor>
                    <Message align="end">
                      <MessageContent>
                        <MessagePart>{question}</MessagePart>
                      </MessageContent>
                    </Message>
                  </ThreadItem>
                  <ThreadItem>
                    <Message variant="ghost">
                      <MessageContent>
                        <MessagePart>{reply}</MessagePart>
                      </MessageContent>
                    </Message>
                  </ThreadItem>
                </div>
              ))}
            </ThreadContent>
          </ThreadViewport>
          <ThreadTranscript
            variant="peek"
            items={TURNS.map(([question, reply], index) => ({
              id: `q${index}`,
              label: question,
              description: reply,
            }))}
          />
        </Thread>
      </ThreadProvider>
    </div>
  )
}
