"use client"

import * as React from "react"

import { TemporaryChatToggle } from "@/registry/aiellie/components/temporary-chat-toggle"

export default function Header() {
  const [temporary, setTemporary] = React.useState(true)

  return (
    <div className="flex w-full max-w-sm items-center justify-between rounded-xl border border-border px-3 py-2">
      <span className="text-sm">
        {temporary ? "Temporary chat" : "New chat"}
      </span>
      <TemporaryChatToggle
        pressed={temporary}
        onPressedChange={setTemporary}
        tooltip="Don't save this chat"
        pressedTooltip="Save this chat"
      />
    </div>
  )
}
