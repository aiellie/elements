"use client"

import {
  Message,
  MessageContent,
  MessagePart,
  type MessageVariant,
} from "@/registry/aiellie/components/message"

const VARIANTS: MessageVariant[] = [
  "primary",
  "secondary",
  "tinted",
  "outline",
  "ghost",
  "destructive",
]

export default function Variants() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      {VARIANTS.map((variant, index) => (
        <Message
          key={variant}
          variant={variant}
          align={index % 2 ? "start" : "end"}
        >
          <MessageContent>
            <MessagePart>{variant}</MessagePart>
          </MessageContent>
        </Message>
      ))}
    </div>
  )
}
