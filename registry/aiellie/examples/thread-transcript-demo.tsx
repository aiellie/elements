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
  ThreadViewport,
} from "@/registry/aiellie/components/thread"
import type { NavBarsVariant } from "@/registry/aiellie/components/nav-bars"
import { ThreadTranscript } from "@/registry/aiellie/components/thread-transcript"
import { Tabs, TabsList, TabsTrigger } from "@/registry/aiellie/ui/tabs"

const TURNS = [
  [
    "How do I add a custom colour in Tailwind v4?",
    "Add it under @theme in your stylesheet, as --color-brand, and every utility picks it up: bg-brand, text-brand, border-brand.",
  ],
  [
    "And for dark mode?",
    "Redefine the variable under .dark. The utilities read the variable, so they follow it without a dark: prefix.",
  ],
  [
    "Can I use it with opacity?",
    "Yes. bg-brand/10 works, since v4 mixes colours with color-mix instead of splitting them into channels.",
  ],
  [
    "What about a gradient between two brand colours?",
    "Use from-brand to-brand-2. Both stops read the theme variables, so the gradient switches with dark mode too. If the two colours are far apart, add via-brand-mid so the middle doesn't go grey.",
  ],
  [
    "Does it work in arbitrary values?",
    "Reference it as var(--color-brand) inside the brackets.",
  ],
  [
    "How do I share the theme across two apps?",
    "Put the @theme block in a package and import that stylesheet from both apps. Each app can still override a variable after the import.",
  ],
  [
    "Will my old tailwind.config.js still work?",
    "Only through @config, as a bridge while you move over. New projects don't need a config file at all.",
  ],
  ["Thanks", "Any time."],
]

const MESSAGES = TURNS.flatMap(([question, reply], index) => [
  { id: `q${index}`, role: "user" as const, content: question },
  { id: `a${index}`, role: "assistant" as const, content: reply },
])

const ITEMS = TURNS.map(([question, reply], index) => ({
  id: `q${index}`,
  label: question,
  description: reply,
}))

const VARIANTS: { value: NavBarsVariant; label: string }[] = [
  { value: "list", label: "List" },
  { value: "peek", label: "Peek" },
  { value: "expand", label: "Expand" },
]

export default function ThreadTranscriptDemo() {
  const [variant, setVariant] = React.useState<NavBarsVariant>("list")

  return (
    <div className="flex w-full max-w-lg flex-col items-center gap-3">
      <Tabs
        value={variant}
        onValueChange={(value) => setVariant(value as NavBarsVariant)}
      >
        <TabsList>
          {VARIANTS.map((option) => (
            <TabsTrigger key={option.value} value={option.value}>
              {option.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <div className="flex h-64 w-full flex-col overflow-hidden rounded-xl border bg-background">
        <ThreadProvider defaultScrollPosition="start">
          <Thread>
            <ThreadViewport aria-label="Conversation">
              <ThreadContent className="gap-4 py-4 ps-12 pe-4">
                {MESSAGES.map((message) => (
                  <ThreadItem
                    key={message.id}
                    messageId={message.id}
                    scrollAnchor={message.role === "user"}
                  >
                    <Message
                      align={message.role === "user" ? "end" : "start"}
                      variant={message.role === "user" ? "secondary" : "ghost"}
                    >
                      <MessageContent>
                        <MessagePart>{message.content}</MessagePart>
                      </MessageContent>
                    </Message>
                  </ThreadItem>
                ))}
              </ThreadContent>
            </ThreadViewport>
            <ThreadTranscript variant={variant} items={ITEMS} />
          </Thread>
        </ThreadProvider>
      </div>
    </div>
  )
}
