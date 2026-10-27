import type { DocContent } from "@/lib/docs"

const doc: DocContent = {
  intro: [
    "Message Context Menu is the menu a message opens on right click, or on a long press on touch. A row of reactions sits above the message's actions, and pressing the one you already gave takes it back.",
    "The actions are the aiellie menu's own `MenuItem`, `MenuSeparator` and `MenuSub`. This adds the area that opens the menu and the row of reactions.",
  ],
  gettingStarted: {
    steps: [
      {
        title: "Wrap the message",
        body: [
          "The trigger fits the message, so a right click in the empty part of the thread opens nothing. Render it as the bubble with `render`.",
        ],
        code: {
          title: "components/message-with-menu.tsx",
          code: `"use client"

import * as React from "react"

import { MenuItem } from "@/components/aiellie/menu"
import { MessagePart } from "@/components/aiellie/message"
import {
  MessageContextMenu,
  MessageContextMenuContent,
  MessageContextMenuTrigger,
  MessageReactionPicker,
} from "@/components/aiellie/message-context-menu"

export function MessageWithMenu({ text }: { text: string }) {
  const [reaction, setReaction] = React.useState<string | null>(null)

  return (
    <MessageContextMenu>
      <MessageContextMenuTrigger render={<MessagePart />}>
        {text}
      </MessageContextMenuTrigger>
      <MessageContextMenuContent>
        <MessageReactionPicker value={reaction} onValueChange={setReaction} />
        <MenuItem onClick={() => navigator.clipboard.writeText(text)}>
          Copy
        </MenuItem>
      </MessageContextMenuContent>
    </MessageContextMenu>
  )
}`,
        },
      },
    ],
  },
  anatomy: {
    code: `<div data-slot="message-context-menu-trigger" /> {/* the message */}
<div data-slot="message-context-menu-content"> {/* in a portal, at the pointer */}
  <div data-slot="message-reaction-picker" role="group">
    <div data-slot="message-reaction" role="menuitemcheckbox" />
  </div>
  {/* your menu items */}
</div>`,
    body: [
      "It's Base UI's context menu with the aiellie menu's surface. The reactions are checkbox items, so they can be taken back, and the menu closes once one is picked.",
    ],
  },
  examples: [
    {
      title: "Your own reactions",
      body: ["`reactions` replaces the six defaults."],
      sample: "message-context-menu/your-reactions",
    },
  ],
  api: [
    {
      title: "MessageReactionPicker",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        [
          "`reactions`",
          "`string[]`",
          "`DEFAULT_REACTIONS`",
          "👍 ❤️ 😂 🎉 👀 🙏",
        ],
        ["`value`", "`string | null`", "`null`", "The reaction you gave."],
        [
          "`onValueChange`",
          "`(value: string | null) => void`",
          "",
          "Called with `null` when you take it back.",
        ],
      ],
      after: ["All other `div` props are forwarded."],
    },
    {
      title: "Other parts",
      head: ["Part", "Built on", "Default", "Description"],
      rows: [
        ["`MessageContextMenu`", "`ContextMenu.Root`", "", ""],
        [
          "`MessageContextMenuTrigger`",
          "`ContextMenu.Trigger`",
          "",
          "Fits its content.",
        ],
        [
          "`MessageContextMenuContent`",
          "`MenuContent`",
          "`sideOffset={2}`",
          "Opens at the pointer.",
        ],
      ],
    },
  ],
}

export default doc
