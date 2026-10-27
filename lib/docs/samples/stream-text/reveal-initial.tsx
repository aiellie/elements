"use client"

import * as React from "react"

import { StreamText } from "@/registry/aiellie/components/stream-text"
import { Button } from "@/registry/aiellie/ui/button"

const REPLY =
  "A reply that loaded whole, from history or a cache, can still be written out as if it were arriving."

export default function RevealInitial() {
  const [run, setRun] = React.useState(0)

  return (
    <div className="flex max-w-sm flex-col items-start gap-4">
      <p className="text-sm leading-6">
        <StreamText key={run} text={REPLY} revealInitial pace={12} />
      </p>
      <Button variant="outline" size="sm" onClick={() => setRun(run + 1)}>
        Write it again
      </Button>
    </div>
  )
}
