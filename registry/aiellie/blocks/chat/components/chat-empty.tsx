"use client"

import { brandIcons } from "@/registry/aiellie/icons/brand-icons"
import { Button } from "@/registry/aiellie/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/registry/aiellie/ui/empty"

/** A few ways in, for a chat with nothing in it yet. Swap for your own. */
const SUGGESTIONS = [
  "Explain a concept simply",
  "Draft a short email",
  "Review a function",
  "Brainstorm names",
]

/**
 * What a new chat shows before anything is sent: a greeting, and prompts that
 * send themselves when picked, so the first message is one press away.
 */
function ChatEmpty({ onSelect }: { onSelect: (prompt: string) => void }) {
  return (
    <Empty className="gap-5">
      <EmptyHeader>
        <EmptyMedia className="size-10 rounded-lg" variant="icon">{brandIcons.elephant("size-6 text-foreground")}</EmptyMedia>
        <EmptyTitle className="text-2xl font-light tracking-tight">
          Ready when you are.
        </EmptyTitle>
      </EmptyHeader>
      <EmptyContent className="max-w-md flex-row flex-wrap justify-center">
        {SUGGESTIONS.map((prompt) => (
          <Button
            key={prompt}
            variant="outline"
            size="sm"
            onClick={() => onSelect(prompt)}
          >
            {prompt}
          </Button>
        ))}
      </EmptyContent>
    </Empty>
  )
}

export { ChatEmpty }
