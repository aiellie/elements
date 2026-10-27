import type { DocContent } from "@/lib/docs"

const doc: DocContent = {
  intro: [
    "Reactions shows the emoji a message has collected, each with its count. Pressing one adds yours, and pressing it again takes it back. The ones you gave are tinted, so you can find them in a long row, and a tooltip says who reacted.",
    "`toggleReaction` returns the list with an emoji added or taken back, which is the update every app writes once a row is wired up.",
  ],
  gettingStarted: {
    steps: [
      {
        title: "Keep the list",
        code: {
          title: "components/message-reactions.tsx",
          code: `"use client"

import * as React from "react"

import {
  Reactions,
  toggleReaction,
  type Reaction,
} from "@/components/aiellie/reactions"

export function MessageReactionsRow({ initial }: { initial: Reaction[] }) {
  const [reactions, setReactions] = React.useState(initial)
  return (
    <Reactions
      reactions={reactions}
      onToggle={(emoji) => setReactions((list) => toggleReaction(list, emoji))}
    />
  )
}`,
        },
      },
      {
        title: "Offer more",
        body: [
          "`onAdd` puts a button at the end. Open your emoji picker from it.",
        ],
        code: {
          title: "components/message-reactions.tsx",
          code: `<Reactions reactions={reactions} onToggle={toggle} onAdd={openPicker} />`,
        },
      },
    ],
  },
  anatomy: {
    code: `<div data-slot="reactions" role="group">
  <button data-slot="reaction" data-reacted aria-pressed /> {/* emoji and count */}
  <button data-slot="reactions-add" />
</div>`,
    body: [
      "Each reaction is a toggle button, so screen readers hear whether it's yours. A reaction that drops to zero leaves the row.",
      "It sits under a message, or inside `MessageReactions` to hang off the bubble's corner.",
    ],
  },
  examples: [
    {
      title: "Who reacted",
      body: ["Give `people` and the tooltip names them, with you first."],
      sample: "reactions/who-reacted",
    },
  ],
  api: [
    {
      title: "Reactions",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        ["`reactions`", "`Reaction[]`", "required", ""],
        [
          "`onToggle`",
          "`(emoji: string) => void`",
          "",
          "Called when one is pressed.",
        ],
        ["`onAdd`", "`() => void`", "", "Adds a button for a new one."],
      ],
      after: ["All other `div` props are forwarded."],
    },
    {
      title: "Reaction",
      head: ["Field", "Type", "Default", "Description"],
      rows: [
        ["`emoji`", "`string`", "required", ""],
        ["`count`", "`number`", "required", ""],
        ["`reacted`", "`boolean`", "", "Whether you are one of the count."],
        ["`people`", "`string[]`", "", "Who else reacted."],
      ],
    },
  ],
}

export default doc
