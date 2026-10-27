"use client"

import * as React from "react"

import { PromptAutocomplete } from "@/registry/aiellie/components/prompt-autocomplete"

const PROMPTS = [
  "Summarize this thread in three bullet points",
  "Write a test for the checkout total with a discount code",
  "Explain why the build fails on Node 18 but not on Node 20",
  "Draft a reply that says we'll ship the fix on Friday",
  "Refactor this component so the state lives in the parent",
]

// Stands in for a model: the first prompt that starts with what was typed.
function complete(value: string) {
  if (value.trim().length < 2) return ""
  const lower = value.toLowerCase()
  const match = PROMPTS.find(
    (prompt) => prompt.toLowerCase().startsWith(lower) && prompt !== value
  )
  return match ? match.slice(value.length) : ""
}

export default function PromptAutocompleteDemo() {
  const [value, setValue] = React.useState("")
  const [suggestion, setSuggestion] = React.useState("")
  const [sent, setSent] = React.useState<string | null>(null)

  React.useEffect(() => {
    const timer = setTimeout(() => setSuggestion(complete(value)), 180)
    return () => clearTimeout(timer)
  }, [value])

  return (
    <div className="flex w-full max-w-md flex-col gap-2">
      <PromptAutocomplete
        value={value}
        onValueChange={setValue}
        suggestion={suggestion}
        placeholder="Try “Write”, “Ex” or “Dr”"
        onSubmit={(message) => {
          setSent(message)
          setValue("")
          setSuggestion("")
        }}
      />
      <p
        aria-live="polite"
        className="min-h-4 truncate px-1 text-xs text-muted-foreground"
      >
        {sent ? `Sent: ${sent}` : null}
      </p>
    </div>
  )
}
