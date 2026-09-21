"use client"

import { Copy01Icon, RepeatIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  Message,
  MessageActions,
  MessageContent,
} from "@/registry/aiellie/components/message"
import { TooltipIconButton } from "@/registry/aiellie/components/tooltip-icon-button"

export default function MessageDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <Message from="user">
        <MessageContent>What does the blinking caret mean?</MessageContent>
      </Message>
      <Message from="assistant">
        <MessageContent>
          That the reply is still being written. It goes once the last word is
          in, and the actions underneath come back.
        </MessageContent>
        <MessageActions>
          <TooltipIconButton tooltip="Copy">
            <HugeiconsIcon icon={Copy01Icon} />
          </TooltipIconButton>
          <TooltipIconButton tooltip="Retry">
            <HugeiconsIcon icon={RepeatIcon} />
          </TooltipIconButton>
        </MessageActions>
      </Message>
      <Message from="user">
        <MessageContent>Show me.</MessageContent>
      </Message>
      <Message from="assistant" streaming>
        <MessageContent>Like this, while the words are</MessageContent>
      </Message>
    </div>
  )
}
