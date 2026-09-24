"use client"

import * as React from "react"

import { TemporaryChatToggle } from "@/registry/aiellie/components/temporary-chat-toggle"

export default function TemporaryChatToggleDemo() {
  const [temporary, setTemporary] = React.useState(false)

  return (
    <div className="flex flex-col items-center gap-3">
      <TemporaryChatToggle pressed={temporary} onPressedChange={setTemporary} />
      <p className="text-xs text-muted-foreground">
        {temporary ? "This chat won't be saved" : "This chat will be saved"}
      </p>
    </div>
  )
}
