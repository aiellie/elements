"use client"

import {
  DateDivider,
  isSameDay,
} from "@/registry/aiellie/components/date-divider"
import {
  Message,
  MessageContent,
  MessagePart,
} from "@/registry/aiellie/components/message"

const HOUR = 60 * 60 * 1000
const now = Date.now()

const MESSAGES = [
  {
    id: "1",
    from: "user",
    text: "Remind me what we settled on?",
    at: now - 26 * HOUR,
  },
  {
    id: "2",
    from: "assistant",
    text: "Ship the tray first, then the menu.",
    at: now - 26 * HOUR + 60_000,
  },
  {
    id: "3",
    from: "user",
    text: "And the menu is done now.",
    at: now - 2 * 60_000,
  },
] as const

export default function BetweenMessages() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      {MESSAGES.map((message, index) => {
        const at = new Date(message.at)
        const previous = MESSAGES[index - 1]
        const newDay = !previous || !isSameDay(new Date(previous.at), at)

        return (
          <div key={message.id} className="flex flex-col gap-3">
            {newDay ? <DateDivider date={at} className="py-2" /> : null}
            <Message
              align={message.from === "user" ? "end" : "start"}
              variant={message.from === "user" ? "secondary" : "ghost"}
            >
              <MessageContent>
                <MessagePart>{message.text}</MessagePart>
              </MessageContent>
            </Message>
          </div>
        )
      })}
    </div>
  )
}
