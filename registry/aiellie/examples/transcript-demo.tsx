"use client"

import * as React from "react"

import {
  Transcript,
  TranscriptSegment,
} from "@/registry/aiellie/components/transcript"

const LINES = [
  { speaker: "You", text: "Can you move the standup to Thursday?" },
  { speaker: "Assistant", text: "Sure. Thursday at nine, same room?" },
  { speaker: "You", text: "Make it half past, and invite Ada." },
  {
    speaker: "Assistant",
    text: "Done. Thursday at 9:30 with Ada added, and the old invite is cancelled.",
  },
]

export default function TranscriptDemo() {
  // Each line is a guess for a beat before it settles.
  const [step, setStep] = React.useState(1)

  React.useEffect(() => {
    const timer = setInterval(
      () =>
        setStep((current) => (current >= LINES.length * 2 ? 1 : current + 1)),
      1200
    )
    return () => clearInterval(timer)
  }, [])

  const shown = Math.ceil(step / 2)

  return (
    <Transcript className="h-48 max-w-sm">
      {LINES.slice(0, shown).map((line, index) => (
        <TranscriptSegment
          key={index}
          speaker={line.speaker}
          interim={index === shown - 1 && step % 2 === 1}
        >
          {line.text}
        </TranscriptSegment>
      ))}
    </Transcript>
  )
}
