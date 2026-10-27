import type { DocContent } from "@/lib/docs"

const doc: DocContent = {
  intro: [
    "Quick chat is a small conversation that floats in the corner of a page, for a question that shouldn't pull someone out of what they're doing. It brings its own thread, which follows the reply as it streams, and a compact composer; hand it the messages and what to do on send. It isn't modal: the page behind it stays usable, Escape closes it, and focus goes back where it came from.",
  ],
  gettingStarted: {
    steps: [
      {
        title: "Open it from a button",
        body: [
          "`open` and `onOpenChange` are yours. It stays mounted while closed, so it can scale away rather than vanish, and it's inert while it's gone.",
        ],
        code: {
          title: "components/ask.tsx",
          code: `"use client"

import * as React from "react"

import {
  QuickChat,
  type QuickChatMessage,
} from "@/components/aiellie/quick-chat"
import { Button } from "@/components/ui/button"

export function Ask() {
  const [open, setOpen] = React.useState(false)
  const [messages, setMessages] = React.useState<QuickChatMessage[]>([])

  return (
    <>
      <Button onClick={() => setOpen(true)}>Ask</Button>
      <QuickChat
        open={open}
        onOpenChange={setOpen}
        messages={messages}
        onSubmit={(text) =>
          setMessages((all) => [
            ...all,
            { id: crypto.randomUUID(), from: "user", content: text },
          ])
        }
      />
    </>
  )
}`,
        },
      },
      {
        title: "Stream replies with the AI SDK",
        body: [
          "Map `useChat`'s messages onto `QuickChatMessage`. Mark the last reply `streaming` while the status says so and the panel writes it out word by word and shows the thinking indicator until the first word.",
        ],
        code: {
          title: "components/ask.tsx",
          code: `const { messages, sendMessage, status, stop, setMessages } = useChat()
const busy = status === "submitted" || status === "streaming"

<QuickChat
  open={open}
  onOpenChange={setOpen}
  onNewChat={() => setMessages([])}
  status={status}
  onStop={stop}
  onSubmit={(text) => sendMessage({ text })}
  messages={messages.map((message, index) => ({
    id: message.id,
    from: message.role === "user" ? "user" : "assistant",
    content: message.parts
      .map((part) => (part.type === "text" ? part.text : ""))
      .join(""),
    streaming: busy && index === messages.length - 1,
  }))}
/>`,
        },
        after: [
          "While a reply is `submitted`, add an empty assistant message marked `streaming` so the indicator has somewhere to show.",
        ],
      },
    ],
  },
  anatomy: {
    code: `<section data-slot="quick-chat" data-state="open" role="dialog" aria-modal="false">
  <header data-slot="quick-chat-header">
    <h2 /> {/* title */}
    <button /> {/* new chat, with onNewChat */}
    <button /> {/* close */}
  </header>
  <div data-slot="thread">
    {/* one Message per entry, with its Reasoning, attachments and StreamText */}
  </div>
  <div data-slot="quick-chat-footer">
    <form data-slot="composer" /> {/* or your own, through \`composer\` */}
  </div>
</section>`,
    body: [
      "It's built from `Thread`, `Message`, `Reasoning`, `StreamText`, `ThinkingIndicator` and `Composer`, which install with it. The panel is fixed to the end corner at 288 by 320px, 384px square from `sm` up, and it's a floating layer, so it's glass with a shadow. Each user message is a scroll anchor, so a new question scrolls to the top and the reply writes in below it.",
    ],
  },
  examples: [
    {
      title: "Answer in place",
      body: [
        "Send something and the reply lands in the panel. The pencil starts over without closing it.",
      ],
      sample: "quick-chat/echo",
    },
    {
      title: "Show what the reply is doing",
      body: [
        "A message carries the model's `reasoning` and how long it took in `reasoningDuration`, which show as a `Reasoning` row above the reply. `activity` names what it's doing while no words come, like a web search, and `startedAt` is when it was asked, which the thinking count starts from.",
      ],
      code: {
        code: `{
  id: "reply-1",
  from: "assistant",
  content: "",
  streaming: true,
  activity: "Searching the web",
  reasoning: "They want this week's release notes, so…",
  startedAt: Date.now(),
}`,
      },
    },
    {
      title: "Bring your own composer",
      body: [
        "`composer` swaps the compact composer for anything else, like the chat block's composer with its model selector, while keeping it in the panel's footer. Hand it its own `onSubmit` and status, since the panel's go to its own composer only.",
      ],
      code: {
        code: `<QuickChat
  open={open}
  onOpenChange={setOpen}
  messages={messages}
  composer={<ChatComposer onSend={send} status={status} {...rest} />}
/>`,
      },
    },
  ],
  api: [
    {
      title: "QuickChat",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        ["`open`", "`boolean`", "required", "Whether the panel shows."],
        [
          "`onOpenChange`",
          "`(open: boolean) => void`",
          "required",
          "Called by the close button and by Escape.",
        ],
        [
          "`messages`",
          "`QuickChatMessage[]`",
          "required",
          "The conversation, oldest first.",
        ],
        [
          "`onSubmit`",
          "`(value: string) => void`",
          "",
          "Called with the trimmed text. Without it the composer is disabled.",
        ],
        [
          "`onStop`",
          "`() => void`",
          "",
          "Called by the stop button while `status` is busy.",
        ],
        [
          "`status`",
          '`"ready" | "submitted" | "streaming" | "error"`',
          '`"ready"`',
          "The AI SDK's `useChat` status.",
        ],
        [
          "`onNewChat`",
          "`() => void`",
          "",
          "Shows a new chat button that calls it and puts focus back in the composer.",
        ],
        ["`title`", "`ReactNode`", '`"Quick chat"`', "The panel's heading."],
        [
          "`placeholder`",
          "`string`",
          '`"Ask anything"`',
          "The compact composer's placeholder.",
        ],
        [
          "`empty`",
          "`ReactNode`",
          '`"Ask something without leaving this page."`',
          "What shows while there are no messages.",
        ],
        [
          "`composer`",
          "`ReactNode`",
          "",
          "Replaces the compact composer while keeping it inside the panel's footer.",
        ],
        [
          "`autoFocus`",
          "`boolean`",
          "`true`",
          "Puts focus in the composer when the panel opens.",
        ],
        ["`className`", "`string`", "", "Merged onto the panel."],
      ],
      after: ["All other `section` props are forwarded."],
    },
    {
      title: "QuickChatMessage",
      head: ["Field", "Type", "Default", "Description"],
      rows: [
        ["`id`", "`string`", "required", "Keys the message in the thread."],
        ["`from`", '`"user" | "assistant"`', "required", "Who sent it."],
        ["`content`", "`string`", "required", "Its text, so far."],
        [
          "`attachments`",
          "`ReactNode`",
          "",
          "Shown above the text, like an `Attachments` row.",
        ],
        [
          "`streaming`",
          "`boolean`",
          "",
          "Whether the reply is still being written.",
        ],
        [
          "`reasoning`",
          "`string`",
          "",
          "What the model thought before replying, for a model that shows it.",
        ],
        [
          "`reasoningDuration`",
          "`number`",
          "",
          "Seconds from asking to the reply's first word.",
        ],
        [
          "`startedAt`",
          "`Date | number`",
          "",
          "When the reply was asked for, which the thinking count starts from.",
        ],
        [
          "`activity`",
          "`string`",
          "",
          "What a streaming reply is doing while no words come.",
        ],
      ],
    },
  ],
}

export default doc
