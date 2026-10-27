"use client"

import * as React from "react"

import {
  Composer,
  ComposerFooter,
  ComposerInput,
  ComposerSubmit,
} from "@/registry/aiellie/components/composer"
import {
  Suggestion,
  Suggestions,
} from "@/registry/aiellie/components/suggestions"

const PROMPTS = [
  "Summarize this page",
  "Write a test for it",
  "Explain the diff",
]

export default function FillComposer() {
  const [value, setValue] = React.useState("")
  const [sent, setSent] = React.useState<string[]>([])

  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      {sent.length === 0 ? (
        <Suggestions>
          {PROMPTS.map((prompt) => (
            <Suggestion key={prompt} onClick={() => setValue(prompt)}>
              {prompt}
            </Suggestion>
          ))}
        </Suggestions>
      ) : (
        <p className="text-caption text-muted-foreground">
          Sent “{sent.at(-1)}”
        </p>
      )}
      <Composer
        value={value}
        onValueChange={setValue}
        onSubmit={(text) => setSent((all) => [...all, text])}
      >
        <ComposerInput />
        <ComposerFooter>
          <ComposerSubmit />
        </ComposerFooter>
      </Composer>
    </div>
  )
}
