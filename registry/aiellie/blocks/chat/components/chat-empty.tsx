"use client"

import { BubbleChatTemporaryIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { brandIcons } from "@/registry/aiellie/icons/brand-icons"
import { Button } from "@/registry/aiellie/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/registry/aiellie/ui/empty"

// Placeholder prompts. Swap in your own.
const SUGGESTIONS = [
  "Explain a concept simply",
  "Draft a short email",
  "Review a function",
  "Brainstorm names",
]

function ChatEmpty({
  temporary = false,
  onSelect,
}: {
  temporary?: boolean
  onSelect: (prompt: string) => void
}) {
  return (
    <Empty className="gap-5">
      <EmptyHeader>
        <EmptyMedia className="size-10 rounded-lg" variant="icon">
          {temporary ? (
            <HugeiconsIcon
              aria-hidden
              icon={BubbleChatTemporaryIcon}
              className="size-6 text-foreground"
            />
          ) : (
            brandIcons.elephant("size-6 text-foreground")
          )}
        </EmptyMedia>
        <EmptyTitle className="text-2xl font-light tracking-tight">
          {temporary ? "Temporary chat" : "Ready when you are."}
        </EmptyTitle>
        {temporary ? (
          <EmptyDescription className="max-w-xs">
            It won&apos;t appear in your history, and it won&apos;t use or
            update your memory.
          </EmptyDescription>
        ) : null}
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
