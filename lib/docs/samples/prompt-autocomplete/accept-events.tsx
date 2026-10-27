"use client"

import * as React from "react"

import {
  PromptAutocomplete,
  type AcceptMode,
} from "@/registry/aiellie/components/prompt-autocomplete"

export default function AcceptEvents() {
  const [events, setEvents] = React.useState<string[]>([])
  const log = (event: string) =>
    setEvents((current) => [event, ...current].slice(0, 3))

  return (
    <div className="flex w-full max-w-md flex-col gap-2">
      <PromptAutocomplete
        defaultValue="Rename the"
        suggestion=" variable to something that says what it holds"
        showHints={false}
        onAccept={(text: string, mode: AcceptMode) =>
          log(`accepted ${mode === "all" ? "all" : "a word"}: “${text.trim()}”`)
        }
        onDismiss={() => log("dismissed")}
      />
      <ul className="min-h-12 px-1 text-xs text-muted-foreground">
        {events.map((event, index) => (
          <li key={index}>{event}</li>
        ))}
      </ul>
    </div>
  )
}
