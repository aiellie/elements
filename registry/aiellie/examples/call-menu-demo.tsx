"use client"

import * as React from "react"

import { CallMenu } from "@/registry/aiellie/components/call-menu"

export default function CallMenuDemo() {
  const [last, setLast] = React.useState<string>()

  return (
    <div className="flex flex-col items-center gap-3">
      <CallMenu
        name="Ellie"
        src="https://images.aiellie.app/s1_AQEAAACltPz_4Of__2Nm8f8AFwBkACwAZAAAAAAAAAATAKwApQBtAIwAAA.png"
        onVideoCall={() => setLast("Starting a video call…")}
        onCall={() => setLast("Calling…")}
      />
      <p aria-live="polite" className="h-4 text-xs text-muted-foreground">
        {last}
      </p>
    </div>
  )
}
