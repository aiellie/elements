import type { DocContent } from "@/lib/docs"

const doc: DocContent = {
  intro: [
    "Temporary chat toggle is the button that turns a chat temporary: one that won't be saved to history or used to remember anything. It is a toggle, so it reads as pressed while on, and its tooltip says what pressing it will do next.",
  ],
  gettingStarted: {
    steps: [
      {
        title: "Hold the state",
        body: [
          "It is controlled: pass whether the chat is temporary and a setter.",
        ],
        code: {
          title: "components/chat-header.tsx",
          code: `"use client"

import * as React from "react"

import { TemporaryChatToggle } from "@/components/aiellie/temporary-chat-toggle"

export function ChatHeader() {
  const [temporary, setTemporary] = React.useState(false)

  return (
    <header className="flex items-center justify-end p-2">
      <TemporaryChatToggle pressed={temporary} onPressedChange={setTemporary} />
    </header>
  )
}`,
        },
      },
      {
        title: "Send it with the chat",
        body: [
          "The toggle only holds the choice. Send it with each request so the server knows not to store the chat.",
        ],
        code: {
          code: `const { sendMessage } = useChat({
  transport: new DefaultChatTransport({ body: { temporary } }),
})`,
        },
      },
    ],
  },
  anatomy: {
    code: `<button data-slot="temporary-chat-toggle" aria-pressed> {/* a TooltipIconButton */}
  <svg /> {/* a dashed chat bubble */}
</button>`,
    body: [
      "It is a 28px `TooltipIconButton`. While pressed it takes the `muted` fill and its icon the foreground color, and its tooltip switches from `tooltip` to `pressedTooltip`, so the label always names the next press.",
    ],
  },
  examples: [
    {
      title: "Custom labels",
      body: [
        "Set both tooltips to say what changes in your product's own words.",
      ],
      sample: "temporary-chat-toggle/header",
    },
  ],
  api: [
    {
      title: "TemporaryChatToggle",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        [
          "`pressed`",
          "`boolean`",
          "required",
          "Whether the chat is temporary.",
        ],
        [
          "`onPressedChange`",
          "`(pressed: boolean) => void`",
          "required",
          "Called with the new value when pressed.",
        ],
        ["`tooltip`", "`string`", '`"Temporary chat"`', "The label while off."],
        [
          "`pressedTooltip`",
          "`string`",
          '`"Turn off temporary chat"`',
          "The label while on.",
        ],
        ["`className`", "`string`", "", "Merged onto the button."],
      ],
      after: [
        "All other `TooltipIconButton` props are forwarded, except `onClick` and `aria-pressed`, which it sets itself.",
      ],
    },
  ],
}

export default doc
