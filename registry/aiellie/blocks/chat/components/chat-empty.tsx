"use client"

import { Button } from "@/registry/aiellie/ui/button"

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
    <div className="flex flex-1 flex-col items-center justify-center gap-5 text-center">
      <h2 className="text-2xl font-light tracking-tight">
        Ready when you are.
      </h2>
      <div className="flex max-w-md flex-wrap justify-center gap-2">
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
      </div>
    </div>
  )
}

export { ChatEmpty }
