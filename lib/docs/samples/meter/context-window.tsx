"use client"

import * as React from "react"

import {
  Meter,
  MeterLabel,
  MeterValue,
} from "@/registry/aiellie/ui/meter"
import { Button } from "@/registry/aiellie/ui/button"

const MAX = 200_000

export default function ContextWindow() {
  const [tokens, setTokens] = React.useState(120_000)
  const tone = tokens / MAX > 0.9 ? "destructive" : "default"

  return (
    <div className="flex w-full max-w-xs flex-col gap-4">
      <Meter
        value={tokens}
        max={MAX}
        tone={tone}
        format={{ notation: "compact" }}
        getAriaValueText={(value) => `${value} of 200K tokens`}
      >
        <MeterLabel>Context window</MeterLabel>
        <MeterValue>{(value) => `${value} / 200K`}</MeterValue>
      </Meter>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setTokens(Math.min(MAX, tokens + 30_000))}
        >
          Send a long message
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setTokens(12_000)}>
          New chat
        </Button>
      </div>
    </div>
  )
}
