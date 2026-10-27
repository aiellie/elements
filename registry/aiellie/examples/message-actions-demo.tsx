"use client"

import * as React from "react"
import {
  GitBranchIcon,
  Flag02Icon,
  VolumeHighIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { MenuItem } from "@/registry/aiellie/components/menu"
import {
  Message,
  MessageActions,
  MessageContent,
  MessageFooter,
  MessagePart,
} from "@/registry/aiellie/components/message"
import {
  MessageCopyAction,
  MessageFeedback,
  MessageMoreActions,
  MessageRetryAction,
  type Feedback,
} from "@/registry/aiellie/components/message-actions"

const REPLY =
  "Set the parent as a container, then style its children by the parent's width rather than the window's."

export default function MessageActionsDemo() {
  const [feedback, setFeedback] = React.useState<Feedback | null>(null)

  return (
    <Message variant="ghost" className="max-w-md">
      <MessageContent>
        <MessagePart>{REPLY}</MessagePart>
        <MessageFooter>
          <MessageActions reveal="always">
            <MessageCopyAction text={REPLY} />
            <MessageFeedback value={feedback} onValueChange={setFeedback} />
            <MessageRetryAction />
            <MessageMoreActions>
              <MenuItem>
                <HugeiconsIcon aria-hidden icon={VolumeHighIcon} />
                Read aloud
              </MenuItem>
              <MenuItem>
                <HugeiconsIcon aria-hidden icon={GitBranchIcon} />
                Branch from here
              </MenuItem>
              <MenuItem variant="destructive">
                <HugeiconsIcon aria-hidden icon={Flag02Icon} />
                Report
              </MenuItem>
            </MessageMoreActions>
          </MessageActions>
        </MessageFooter>
      </MessageContent>
    </Message>
  )
}
