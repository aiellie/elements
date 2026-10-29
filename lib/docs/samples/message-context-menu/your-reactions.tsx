"use client"

import * as React from "react"

import { MenuItem, MenuSeparator } from "@/registry/aiellie/ui/menu"
import {
  MessageContextMenu,
  MessageContextMenuContent,
  MessageContextMenuTrigger,
  MessageReactionPicker,
} from "@/registry/aiellie/components/message-context-menu"

export default function YourReactions() {
  const [reaction, setReaction] = React.useState<string | null>("✅")

  return (
    <MessageContextMenu>
      <MessageContextMenuTrigger className="rounded-xl bg-secondary px-3 py-1 text-sm leading-6">
        Ship it on Monday? {reaction}
      </MessageContextMenuTrigger>
      <MessageContextMenuContent>
        <MessageReactionPicker
          reactions={["✅", "❌", "🤔"]}
          value={reaction}
          onValueChange={setReaction}
          className="justify-start"
        />
        <MenuSeparator />
        <MenuItem>Reply</MenuItem>
      </MessageContextMenuContent>
    </MessageContextMenu>
  )
}
