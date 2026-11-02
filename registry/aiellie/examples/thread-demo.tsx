"use client"

import type { UIMessage } from "ai"

import { Thread } from "@/registry/aiellie/components/thread"

const MINUTE = 60 * 1000
const now = Date.now()

const MESSAGES: UIMessage[] = [
  {
    id: "1",
    role: "user",
    metadata: { createdAt: now - 6 * MINUTE },
    parts: [{ type: "text", text: "Why does my chart overflow on phones?" }],
  },
  {
    id: "2",
    role: "assistant",
    metadata: { createdAt: now - 6 * MINUTE, reasoningSeconds: 4 },
    parts: [
      {
        type: "reasoning",
        text: "The chart is 640px wide and the card on a phone is about 358px, so it can't fit. Sizing it from its container fixes that.",
        state: "done",
      },
      {
        type: "text",
        text: "The chart has a fixed width of `640px`, wider than the card on a phone. Size it from its container instead:\n\n```css\n.card { container-type: inline-size; }\n.chart { width: 100cqi; }\n```\n\nNow it fills the card at every size.",
        state: "done",
      },
    ],
  },
  {
    id: "3",
    role: "user",
    metadata: { createdAt: now - 2 * MINUTE },
    parts: [{ type: "text", text: "Does that work in every browser?" }],
  },
  {
    id: "4",
    role: "assistant",
    metadata: { createdAt: now - 2 * MINUTE },
    parts: [
      {
        type: "text",
        text: "Yes. Container queries have worked in every major browser since 2023, so you can use them without a fallback.",
        state: "done",
      },
    ],
  },
]

export default function ThreadDemo() {
  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden">
      <Thread
        messages={MESSAGES}
        onRate={() => {}}
        onRegenerate={() => {}}
      />
    </div>
  )
}
