"use client"

import { Message, MessageContent } from "@/registry/aiellie/components/message"
import {
  Thread,
  ThreadContent,
  ThreadScrollButton,
} from "@/registry/aiellie/components/thread"

const TURNS = [
  "Can you help me plan a small launch?",
  "Of course. What's launching, and who is it for?",
  "A component registry, for people building AI apps.",
  "Then the launch is mostly a demo. Lead with one page that shows the pieces working together, and make each piece installable on its own.",
  "What should that page show first?",
  "A conversation, since that's where the pieces meet: a thread that scrolls, messages that stream in, and a composer for the next one.",
  "And after that?",
  "The pieces one at a time, each with its install command. Scroll up in this box and the way back to the end appears.",
]

export default function ThreadDemo() {
  return (
    <div className="flex h-72 w-full max-w-md flex-col overflow-hidden rounded-lg border bg-background">
      <Thread>
        <ThreadContent className="gap-4 px-3 py-4">
          {TURNS.map((text, index) => (
            <Message key={index} from={index % 2 === 0 ? "user" : "assistant"}>
              <MessageContent>{text}</MessageContent>
            </Message>
          ))}
        </ThreadContent>
        <ThreadScrollButton />
      </Thread>
    </div>
  )
}
