"use client"

import * as React from "react"
import { RepeatIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  Suggestion,
  Suggestions,
} from "@/registry/aiellie/components/suggestions"
import { Button } from "@/registry/aiellie/ui/button"

const PROMPTS = [
  "Explain a concept simply",
  "Draft a short email",
  "Review a function",
  "Brainstorm names",
]

export default function SuggestionsDemo() {
  const [run, setRun] = React.useState(0)
  const [picked, setPicked] = React.useState<string | null>(null)

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-4 px-4">
      <Suggestions key={run} className="justify-center">
        {PROMPTS.map((prompt) => (
          <Suggestion key={prompt} onClick={() => setPicked(prompt)}>
            {prompt}
          </Suggestion>
        ))}
      </Suggestions>
      <p className="text-xs text-muted-foreground">
        {picked ? `Picked “${picked}”` : "Pick one to send it"}
      </p>
      <Button variant="ghost" size="sm" onClick={() => setRun((n) => n + 1)}>
        <HugeiconsIcon aria-hidden icon={RepeatIcon} />
        Replay
      </Button>
    </div>
  )
}
