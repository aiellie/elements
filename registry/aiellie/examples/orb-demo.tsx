"use client"

import * as React from "react"

import { Orb, type OrbState } from "@/registry/aiellie/components/orb"

const STATES: OrbState[] = [
  "idle",
  "listening",
  "thinking",
  "speaking",
  "asleep",
]

export default function OrbDemo() {
  const [state, setState] = React.useState<OrbState>("idle")

  return (
    <div className="flex flex-col items-center gap-6">
      <Orb state={state} size={128} />
      <div
        role="radiogroup"
        aria-label="State"
        className="flex flex-wrap justify-center gap-1"
      >
        {STATES.map((name) => (
          <button
            key={name}
            type="button"
            role="radio"
            aria-checked={state === name}
            onClick={() => setState(name)}
            className="h-6 cursor-pointer rounded-md border border-transparent px-2 text-xs text-muted-foreground capitalize transition-colors duration-80 outline-none hover:text-foreground focus-visible:border-ring aria-checked:bg-muted aria-checked:text-foreground motion-reduce:transition-none"
          >
            {name}
          </button>
        ))}
      </div>
    </div>
  )
}
