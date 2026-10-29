"use client"

import * as React from "react"
import {
  Copy01Icon,
  Delete02Icon,
  QuoteDownIcon,
  RepeatIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { MenuItem, MenuSeparator } from "@/registry/aiellie/ui/menu"
import {
  Message,
  MessageContent,
  MessagePart,
  MessageReactions,
} from "@/registry/aiellie/components/message"
import {
  MessageContextMenu,
  MessageContextMenuContent,
  MessageContextMenuTrigger,
  MessageReactionPicker,
} from "@/registry/aiellie/components/message-context-menu"

export default function MessageContextMenuDemo() {
  const [reaction, setReaction] = React.useState<string | null>(null)

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-6">
      <Message>
        <MessageContent>
          <MessageContextMenu>
            <MessageContextMenuTrigger render={<MessagePart />}>
              Right-click this message, or press and hold it.
              {reaction ? (
                <MessageReactions side="bottom" align="end">
                  {reaction}
                </MessageReactions>
              ) : null}
            </MessageContextMenuTrigger>
            <MessageContextMenuContent>
              <MessageReactionPicker
                value={reaction}
                onValueChange={setReaction}
              />
              <MenuSeparator />
              <MenuItem>
                <HugeiconsIcon aria-hidden icon={QuoteDownIcon} />
                Quote
              </MenuItem>
              <MenuItem>
                <HugeiconsIcon aria-hidden icon={Copy01Icon} />
                Copy
              </MenuItem>
              <MenuItem>
                <HugeiconsIcon aria-hidden icon={RepeatIcon} />
                Retry
              </MenuItem>
              <MenuSeparator />
              <MenuItem variant="destructive">
                <HugeiconsIcon aria-hidden icon={Delete02Icon} />
                Delete
              </MenuItem>
            </MessageContextMenuContent>
          </MessageContextMenu>
        </MessageContent>
      </Message>
    </div>
  )
}
