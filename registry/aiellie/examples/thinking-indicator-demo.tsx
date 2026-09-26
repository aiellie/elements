"use client"

import * as React from "react"

import { ThinkingIndicator } from "@/registry/aiellie/components/thinking-indicator"

// What a reply goes through before its first word, a step every few seconds.
const STEPS = [
  "Thinking",
  "Reading 3 files",
  "Searching for “recharts responsive container”",
  "Thinking",
]

export default function ThinkingIndicatorDemo() {
  const [step, setStep] = React.useState(0)

  React.useEffect(() => {
    const timer = setInterval(
      () => setStep((current) => (current + 1) % STEPS.length),
      2500
    )
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="flex w-full max-w-sm px-4">
      <ThinkingIndicator>{STEPS[step]}</ThinkingIndicator>
    </div>
  )
}
