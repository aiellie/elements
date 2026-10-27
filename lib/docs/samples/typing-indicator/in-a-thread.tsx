import { UserIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  Message,
  MessageAvatar,
  MessageContent,
} from "@/registry/aiellie/components/message"
import { TypingIndicator } from "@/registry/aiellie/components/typing-indicator"

export default function InAThread() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <Message align="end">
        <MessageContent>Are we still on for 3?</MessageContent>
      </Message>
      <Message>
        <MessageAvatar>
          <HugeiconsIcon icon={UserIcon} aria-hidden />
        </MessageAvatar>
        <TypingIndicator label="Maya is typing" />
      </Message>
    </div>
  )
}
