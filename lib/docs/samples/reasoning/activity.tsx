"use client"

import * as React from "react"

import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/registry/aiellie/components/reasoning"
import { Button } from "@/registry/aiellie/ui/button"

const STEPS = ["Searching the web", "Reading 4 pages", "Thinking"]

export default function Activity() {
  const [step, setStep] = React.useState<number | null>(null)
  const [startedAt, setStartedAt] = React.useState(0)
  const streaming = step !== null

  React.useEffect(() => {
    if (step === null) return
    const timer = setTimeout(
      () => setStep(step + 1 < STEPS.length ? step + 1 : null),
      1800
    )
    return () => clearTimeout(timer)
  }, [step])

  return (
    <div className="flex w-full max-w-md flex-col items-start gap-6">
      <Reasoning
        streaming={streaming}
        startedAt={startedAt}
        duration={(STEPS.length * 1800) / 1000}
      >
        <ReasoningTrigger label={step === null ? undefined : STEPS[step]} />
        <ReasoningContent>
          They asked which release added the new compiler, so the changelog is
          the place to look rather than a blog post.
        </ReasoningContent>
      </Reasoning>
      <Button
        variant="outline"
        size="sm"
        disabled={streaming}
        onClick={() => {
          setStartedAt(Date.now())
          setStep(0)
        }}
      >
        Ask again
      </Button>
    </div>
  )
}
