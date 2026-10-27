"use client"

import * as React from "react"

import {
  AttemptPicker,
  type Attempt,
} from "@/registry/aiellie/components/attempt-picker"

const FINAL: Attempt[] = [
  {
    id: "opus",
    label: "Opus 5",
    state: "done",
    summary:
      "Rounds each line's tax before summing, and adds a test for a three-item cart.",
    additions: 24,
    deletions: 9,
    files: 2,
    tests: { passed: 33, total: 33 },
    cost: "$0.42",
    seconds: 71,
  },
  {
    id: "sonnet",
    label: "Sonnet 5",
    state: "done",
    summary: "Rounds the total once at the end. Two older tests now disagree.",
    additions: 11,
    deletions: 4,
    files: 1,
    tests: { passed: 31, total: 33 },
    cost: "$0.09",
    seconds: 38,
  },
  {
    id: "haiku",
    label: "Haiku 5",
    state: "failed",
    summary: "Stopped after the type check failed in lib/price.ts.",
    seconds: 22,
  },
]

const DURATIONS = [4200, 2600, 1800]

export default function AttemptPickerDemo() {
  const [elapsed, setElapsed] = React.useState(0)
  const [applied, setApplied] = React.useState<string>()

  React.useEffect(() => {
    if (elapsed >= DURATIONS[0]) return
    const timer = setTimeout(() => setElapsed((ms) => ms + 200), 200)
    return () => clearTimeout(timer)
  }, [elapsed])

  const attempts = FINAL.map((attempt, index) =>
    elapsed >= DURATIONS[index]
      ? attempt
      : {
          id: attempt.id,
          label: attempt.label,
          state: "running" as const,
          progress: elapsed / DURATIONS[index],
        }
  )

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-3">
      <AttemptPicker
        task="Fix rounding in the cart total"
        attempts={attempts}
        applied={applied}
        onApply={setApplied}
      />
      {applied ? (
        <button
          type="button"
          onClick={() => {
            setApplied(undefined)
            setElapsed(0)
          }}
          className="cursor-pointer rounded-sm border border-transparent text-xs text-muted-foreground outline-none hover:text-foreground focus-visible:border-ring"
        >
          Run again
        </button>
      ) : null}
    </div>
  )
}
