"use client"

import * as React from "react"

import { EmojiSelector } from "@/registry/aiellie/components/emoji-selector"

export default function EmojiSelectorDemo() {
  const [picked, setPicked] = React.useState("")

  return (
    <div className="flex items-center gap-3">
      <EmojiSelector
        side="bottom"
        onEmojiSelect={(emoji) => setPicked((text) => text + emoji)}
      />
      <span className="min-w-24 text-lg" aria-live="polite">
        {picked || (
          <span className="text-sm text-muted-foreground">Pick a few</span>
        )}
      </span>
    </div>
  )
}
