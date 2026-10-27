"use client"

import * as React from "react"

import { DictateButton } from "@/registry/aiellie/components/dictate-button"
import { Textarea } from "@/registry/aiellie/ui/textarea"

const MESSAGES: Record<string, string> = {
  "not-allowed": "The microphone is blocked for this site.",
  network: "Speech recognition needs a connection.",
}

export default function Errors() {
  const [value, setValue] = React.useState("")
  const [error, setError] = React.useState<string | null>(null)

  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <div className="flex items-end gap-2">
        <Textarea
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Type, or press the mic and speak"
          aria-label="Message"
          rows={2}
        />
        <DictateButton
          value={value}
          onValueChange={(next) => {
            setError(null)
            setValue(next)
          }}
          onError={(code) =>
            setError(MESSAGES[code] ?? `Dictation stopped: ${code}`)
          }
        />
      </div>
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  )
}
