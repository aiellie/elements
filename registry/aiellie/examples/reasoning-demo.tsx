"use client"

import * as React from "react"
import { RepeatIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/registry/aiellie/components/reasoning"
import { Button } from "@/registry/aiellie/ui/button"

const THOUGHTS =
  "The chart has a fixed width of 640px, and the phone's card is about 358px wide, so it can't fit. The spec says the chart fills the card at every size, so the fix is to size it from its container instead."

const FINISHED =
  "They want a name that sounds quiet. Monochrome points to grays, so something like graphite. Hairline fits too, since the borders do most of the work."

const WORD_DELAY = 90

export default function ReasoningDemo() {
  const [run, setRun] = React.useState(0)
  const [shown, setShown] = React.useState(0)
  const words = THOUGHTS.split(/(?<=\s)/)
  const streaming = shown < words.length

  React.useEffect(() => {
    let count = 0
    const timer = setInterval(() => {
      count += 1
      setShown(count)
      if (count >= words.length) clearInterval(timer)
    }, WORD_DELAY)
    return () => clearInterval(timer)
  }, [run, words.length])

  return (
    <div className="flex w-full max-w-md flex-col items-start gap-6 px-4">
      <Reasoning
        key={run}
        streaming={streaming}
        duration={(words.length * WORD_DELAY) / 1000}
      >
        <ReasoningTrigger />
        <ReasoningContent>{words.slice(0, shown).join("")}</ReasoningContent>
      </Reasoning>
      <Reasoning duration={12}>
        <ReasoningTrigger />
        <ReasoningContent>{FINISHED}</ReasoningContent>
      </Reasoning>
      <Button
        variant="outline"
        size="sm"
        disabled={streaming}
        onClick={() => {
          setShown(0)
          setRun((current) => current + 1)
        }}
      >
        <HugeiconsIcon aria-hidden icon={RepeatIcon} />
        Replay
      </Button>
    </div>
  )
}
