"use client"

import * as React from "react"

import { ThinkingIndicator } from "@/registry/aiellie/components/thinking-indicator"
import { Button } from "@/registry/aiellie/ui/button"

export default function StartedAt() {
  // As if the reply was asked for a minute and a half ago.
  const [startedAt] = React.useState(() => Date.now() - 90_000)
  const [shown, setShown] = React.useState(true)

  return (
    <div className="flex w-full max-w-sm flex-col items-start gap-4">
      {shown ? (
        <ThinkingIndicator startedAt={startedAt}>
          Running the tests
        </ThinkingIndicator>
      ) : (
        <p className="text-sm text-muted-foreground">Unmounted</p>
      )}
      <Button variant="outline" size="sm" onClick={() => setShown(!shown)}>
        {shown ? "Unmount" : "Mount again"}
      </Button>
    </div>
  )
}
