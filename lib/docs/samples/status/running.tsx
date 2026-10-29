"use client"

import * as React from "react"

import {
  Status,
  StatusIndicator,
  StatusLabel,
} from "@/registry/aiellie/ui/status"
import { Button } from "@/registry/aiellie/ui/button"

const STATES = {
  running: { variant: "live", pulse: true, label: "Running" },
  done: { variant: "success", pulse: false, label: "Done" },
  failed: { variant: "destructive", pulse: false, label: "Failed" },
} as const

export default function Running() {
  const [state, setState] = React.useState<keyof typeof STATES>("running")
  const current = STATES[state]

  return (
    <div className="flex flex-col items-center gap-4">
      <Status variant={current.variant} pulse={current.pulse}>
        <StatusIndicator />
        <StatusLabel>{current.label}</StatusLabel>
      </Status>
      <div className="flex gap-1">
        {(Object.keys(STATES) as (keyof typeof STATES)[]).map((key) => (
          <Button
            key={key}
            variant={key === state ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setState(key)}
          >
            {STATES[key].label}
          </Button>
        ))}
      </div>
    </div>
  )
}
