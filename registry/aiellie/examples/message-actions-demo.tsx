"use client"

import * as React from "react"
import { RefreshIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  MessageAction,
  MessageActions,
  MessageCopyAction,
  MessageMoreActions,
  MessageRateAction,
  type Rating,
} from "@/registry/aiellie/components/message-actions"

const REPLY =
  "Size the chart from its container with a container query, so it fills the card on a phone and on a desktop alike."

export default function MessageActionsDemo() {
  const [rating, setRating] = React.useState<Rating>()
  const [reported, setReported] = React.useState(false)

  return (
    <div className="flex w-full max-w-md flex-col gap-2 px-4">
      <p className="text-sm">{REPLY}</p>
      <MessageActions>
        <MessageCopyAction value={REPLY} />
        <MessageRateAction
          value="up"
          pressed={rating === "up"}
          onPressedChange={(pressed) => setRating(pressed ? "up" : undefined)}
        />
        <MessageRateAction
          value="down"
          pressed={rating === "down"}
          onPressedChange={(pressed) => setRating(pressed ? "down" : undefined)}
        />
        <MessageAction tooltip="Try again">
          <HugeiconsIcon aria-hidden icon={RefreshIcon} />
        </MessageAction>
        <MessageMoreActions
          text={REPLY}
          onBranch={() => {}}
          onReport={() => setReported(true)}
          reported={reported}
        />
      </MessageActions>
    </div>
  )
}
