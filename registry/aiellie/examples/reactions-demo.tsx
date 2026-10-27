"use client"

import * as React from "react"

import {
  Message,
  MessageContent,
  MessagePart,
} from "@/registry/aiellie/components/message"
import {
  Reactions,
  toggleReaction,
  type Reaction,
} from "@/registry/aiellie/components/reactions"

const MORE = ["🎉", "👀", "🙏", "🔥"]

export default function ReactionsDemo() {
  const [reactions, setReactions] = React.useState<Reaction[]>([
    { emoji: "👍", count: 3, reacted: true },
    { emoji: "❤️", count: 1, people: ["Ada"] },
  ])
  const next = MORE.find(
    (emoji) => !reactions.some((reaction) => reaction.emoji === emoji)
  )

  return (
    <Message className="max-w-sm">
      <MessageContent>
        <MessagePart>
          The release notes are up. Have a look before Friday.
        </MessagePart>
        <Reactions
          reactions={reactions}
          onToggle={(emoji) =>
            setReactions((list) => toggleReaction(list, emoji))
          }
          onAdd={
            next
              ? () => setReactions((list) => toggleReaction(list, next))
              : undefined
          }
        />
      </MessageContent>
    </Message>
  )
}
