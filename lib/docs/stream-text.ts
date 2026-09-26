import type { DocContent } from "@/lib/docs"

export const streamText: DocContent = {
  usage: {
    description:
      "Pass the reply so far as `text`, growing as it arrives, and `streaming` while more is on its way. Words go out whole, at the rate the stream has been arriving, so a burst doesn't land all at once and a pause slows the writing instead of stopping it.",
    code: `import { StreamText } from "@/components/aiellie/stream-text"

export function Reply({
  text,
  streaming,
}: {
  text: string
  streaming: boolean
}) {
  return (
    <p className="text-sm leading-6">
      <StreamText text={text} streaming={streaming} />
    </p>
  )
}`,
  },
  composition: {
    description:
      "In a thread, it goes inside a `MessagePart`. It draws its own caret, so the message leaves its caret out. With the AI SDK, stream the latest reply and show the rest as they are.",
    code: `"use client"

import { useChat } from "@ai-sdk/react"

import {
  Message,
  MessageContent,
  MessagePart,
} from "@/components/aiellie/message"
import { StreamText } from "@/components/aiellie/stream-text"

export function Messages() {
  const { messages, status } = useChat()

  return messages.map((message, index) => {
    const latest = index === messages.length - 1
    const streaming = latest && status === "streaming"

    return (
      <Message
        key={message.id}
        align={message.role === "user" ? "end" : "start"}
        variant={message.role === "user" ? "secondary" : "ghost"}
        streaming={streaming}
      >
        <MessageContent>
          {message.parts.map((part, key) =>
            part.type === "text" ? (
              <MessagePart key={key}>
                {message.role === "assistant" ? (
                  <StreamText text={part.text} streaming={streaming} />
                ) : (
                  part.text
                )}
              </MessagePart>
            ) : null
          )}
        </MessageContent>
      </Message>
    )
  })
}`,
  },
  api: [
    {
      name: "StreamText",
      description:
        "Renders a `span`. Any other prop, like `className`, goes to it.",
      props: [
        {
          name: "text",
          type: "string",
          required: true,
          description:
            "The reply so far. Each value should carry on from the one before.",
        },
        {
          name: "streaming",
          type: "boolean",
          default: "false",
          description:
            "Whether more is still on its way. While it is, the last word waits until it's whole and the newest words hold the live ink.",
        },
        {
          name: "pace",
          type: "number",
          default: "16",
          description:
            "Words a second, until the stream's own rate is known, and for `revealInitial`.",
        },
        {
          name: "revealInitial",
          type: "boolean",
          default: "false",
          description:
            "Write out the text it mounts with too, instead of showing it at once.",
        },
        {
          name: "inlineCode",
          type: "boolean",
          default: "true",
          description: "Set runs inside `backticks` as code.",
        },
        {
          name: "freshWords",
          type: "number",
          default: "2",
          description:
            "How many of the newest words hold the live ink while more are coming.",
        },
        {
          name: "onRevealed",
          type: "() => void",
          description:
            "Called once the reply is finished and every word of it is on screen.",
        },
      ],
    },
  ],
  notes: [
    "The newest words and the caret take the `--live` color from the aiellie theme, and fall back to the text color without it. The caret's blink comes from `tw-animate-css`.",
    "With reduced motion, or in a tab that's hidden, each word shows as it arrives instead of being paced.",
  ],
}
