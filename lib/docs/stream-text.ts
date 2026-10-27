import type { DocContent } from "@/lib/docs"

const doc: DocContent = {
  intro: [
    "Stream text writes a streamed reply out a whole word at a time. Tokens rarely end on a word, so each word waits until it is whole, and the words go out at the rate the stream has been arriving: a burst doesn't land all at once, and a pause slows the writing instead of stopping it. Pass it the reply so far as `text` and whether more is coming as `streaming`; it keeps its own pace from there.",
  ],
  gettingStarted: {
    steps: [
      {
        title: "Render the reply so far",
        body: [
          "Pass the text as it grows. Each value should carry on from the one before, the way a stream appends.",
        ],
        code: {
          title: "components/reply.tsx",
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
      },
      {
        title: "Put it in a message",
        body: [
          "In a thread it goes inside a `MessagePart`. It draws its own caret, so the message leaves its caret out. With the AI SDK, stream the latest reply and show the rest as they are.",
        ],
        code: {
          title: "components/messages.tsx",
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
    const streaming =
      index === messages.length - 1 && status === "streaming"

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
        after: [
          "Only the latest reply streams. Earlier ones mount with their whole text and show it at once.",
        ],
      },
    ],
  },
  anatomy: {
    code: `<span data-slot="stream-text" data-streaming aria-busy>
  {/* words already on screen, then the newest ones in the live ink */}
  <code data-slot="stream-text-code" /> {/* a run inside \`backticks\`, kept whole */}
  <span data-slot="stream-text-caret" aria-hidden /> {/* only while streaming */}
</span>`,
    body: [
      "`data-streaming` and `aria-busy` are set while there are words still to write, which can outlast `streaming` by a moment while the last words go out. The caret and the newest words take the `--live` color from the aiellie theme and fall back to the text color without it; the caret's blink comes from `tw-animate-css`.",
      "With reduced motion, or in a tab that's hidden, each word shows as it arrives instead of being paced, so nothing builds up a backlog to play out later.",
    ],
  },
  examples: [
    {
      title: "Write out text it mounts with",
      body: [
        "By default the text a reply mounts with shows at once, so a reload doesn't replay history. `revealInitial` writes it out instead, at `pace` words a second.",
      ],
      sample: "stream-text/reveal-initial",
    },
    {
      title: "Hold more words in the live ink",
      body: [
        "`freshWords` sets how many of the newest words keep the live color while more are coming. A larger number leaves a longer trail behind the caret.",
      ],
      sample: "stream-text/fresh-words",
    },
    {
      title: "Know when it's done",
      body: [
        "`onRevealed` fires once `streaming` is off and every word is on screen, which is later than the stream itself finishing. Use it for anything that should wait for the reading, like showing the message's actions.",
      ],
      code: {
        code: `<StreamText
  text={text}
  streaming={streaming}
  onRevealed={() => setActionsVisible(true)}
/>`,
      },
    },
  ],
  api: [
    {
      title: "StreamText",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        [
          "`text`",
          "`string`",
          "required",
          "The reply so far. Each value should carry on from the one before.",
        ],
        [
          "`streaming`",
          "`boolean`",
          "`false`",
          "Whether more is still on its way. While it is, the last word waits until it's whole and the newest words hold the live ink.",
        ],
        [
          "`pace`",
          "`number`",
          "`16`",
          "Words a second, until the stream's own rate is known, and for `revealInitial`.",
        ],
        [
          "`revealInitial`",
          "`boolean`",
          "`false`",
          "Write out the text it mounts with too, instead of showing it at once.",
        ],
        [
          "`inlineCode`",
          "`boolean`",
          "`true`",
          "Set runs inside `backticks` as code.",
        ],
        [
          "`freshWords`",
          "`number`",
          "`2`",
          "How many of the newest words hold the live ink while more are coming.",
        ],
        [
          "`onRevealed`",
          "`() => void`",
          "",
          "Called once the reply is finished and every word of it is on screen.",
        ],
        ["`className`", "`string`", "", "Merged onto the root `span`."],
      ],
      after: ["All other `span` props are forwarded to the root."],
    },
  ],
}

export default doc
