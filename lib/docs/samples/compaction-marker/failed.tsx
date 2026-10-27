"use client"

import * as React from "react"

import {
  CompactionMarker,
  type CompactionState,
} from "@/registry/aiellie/components/compaction-marker"

export default function Failed() {
  const [state, setState] = React.useState<CompactionState>("failed")
  const [progress, setProgress] = React.useState(0)

  const retry = () => {
    setState("compacting")
    setProgress(0)
    let step = 0
    const timer = setInterval(() => {
      step += 1
      setProgress(step / 10)
      if (step === 10) {
        clearInterval(timer)
        setState("compacted")
      }
    }, 200)
  }

  return (
    <CompactionMarker
      state={state}
      tokensBefore={182000}
      tokensAfter={24500}
      progress={progress}
      onRetry={retry}
      readOnly
      items={[{ id: "1", kind: "decision", label: "Ship behind a flag" }]}
    />
  )
}
