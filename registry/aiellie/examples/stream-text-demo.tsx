"use client"

import * as React from "react"
import { RepeatIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { StreamText } from "@/registry/aiellie/components/stream-text"
import { Button } from "@/registry/aiellie/ui/button"

const REPLY =
  "Tokens rarely land a word at a time. Each word waits until it is whole, then the words go out at the rate the stream has been arriving, so a pause slows the writing instead of stopping it. Inline code like `useSyncExternalStore` stays in one piece."

// Uneven on purpose, the way a real stream arrives: a fragment, a pause,
// half a sentence at once.
const CHUNKS = [3, 9, 1, 14, 6, 2, 22, 5, 11, 4, 17]
const DELAYS = [60, 40, 260, 30, 90, 420, 50, 120, 70, 200, 40]

export default function StreamTextDemo() {
  const [run, setRun] = React.useState(0)
  const [length, setLength] = React.useState(0)

  React.useEffect(() => {
    let index = 0
    let at = 0
    let timer: ReturnType<typeof setTimeout>

    const step = () => {
      at = Math.min(REPLY.length, at + CHUNKS[index % CHUNKS.length])
      setLength(at)
      if (at < REPLY.length) {
        timer = setTimeout(step, DELAYS[index++ % DELAYS.length])
      }
    }

    timer = setTimeout(step, 300)
    return () => clearTimeout(timer)
  }, [run])

  return (
    <div className="flex w-full max-w-md flex-col items-start gap-3">
      <p className="min-h-30 text-sm leading-6">
        <StreamText
          key={run}
          text={REPLY.slice(0, length)}
          streaming={length < REPLY.length}
        />
      </p>
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          setLength(0)
          setRun((value) => value + 1)
        }}
      >
        <HugeiconsIcon icon={RepeatIcon} data-icon="inline-start" aria-hidden />
        Replay
      </Button>
    </div>
  )
}
