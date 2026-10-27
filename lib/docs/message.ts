import type { DocContent } from "@/lib/docs"

const doc: DocContent = {
  intro: [
    "Message lays out one turn of a conversation: an optional avatar, then a column of parts with a header above them and a footer below. Parts that follow each other stack tightly and only the last one gets the tail, so a reply sent as several bubbles reads as one message. `align` puts it on either side and `variant` sets how its parts are filled.",
  ],
  gettingStarted: {
    steps: [
      {
        title: "Render a turn",
        body: [
          "A message needs `MessageContent` and at least one `MessagePart`. Put the user's on the end side and the assistant's on the start side, usually as `ghost` so a long reply reads as plain text.",
        ],
        code: {
          title: "components/turn.tsx",
          code: `import {
  Message,
  MessageContent,
  MessagePart,
} from "@/components/aiellie/message"

export function Turn({
  from,
  text,
}: {
  from: "user" | "assistant"
  text: string
}) {
  return (
    <Message
      align={from === "user" ? "end" : "start"}
      variant={from === "user" ? "secondary" : "ghost"}
    >
      <MessageContent>
        <MessagePart>{text}</MessagePart>
      </MessageContent>
    </Message>
  )
}`,
        },
      },
      {
        title: "Add the actions",
        body: [
          "`MessageFooter` goes after the parts. `MessageActions` shows on hover where there's a pointer that can hover, and always on touch, and each `MessageAction` is a `TooltipIconButton`.",
        ],
        code: {
          title: "components/turn.tsx",
          code: `import { Copy01Icon, RepeatIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  MessageAction,
  MessageActions,
  MessageFooter,
} from "@/components/aiellie/message"

<MessageFooter>
  <MessageActions>
    <MessageAction tooltip="Copy" onClick={copy}>
      <HugeiconsIcon icon={Copy01Icon} />
    </MessageAction>
    <MessageAction tooltip="Retry" onClick={retry}>
      <HugeiconsIcon icon={RepeatIcon} />
    </MessageAction>
  </MessageActions>
</MessageFooter>`,
        },
        after: [
          "With an avatar, the avatar rises to sit beside the last part rather than the footer.",
        ],
      },
    ],
  },
  anatomy: {
    code: `<div data-slot="message-group"> {/* optional: a run of messages */}
  <div data-slot="message" data-align="start" data-variant="ghost" data-streaming>
    <div data-slot="message-avatar" />
    <div data-slot="message-content">
      <div data-slot="message-header" />
      <div data-slot="message-part">
        <div data-slot="message-reactions" />
        <span data-slot="message-caret" /> {/* shown on the last part while streaming */}
      </div>
      <div data-slot="message-footer">
        <time data-slot="message-time" />
        <div data-slot="message-actions">
          <button /> {/* MessageAction */}
        </div>
      </div>
    </div>
  </div>
</div>`,
    body: [
      "Every part reads `align` and `variant` from its message, so nothing below `Message` takes either. `streaming` sets `data-streaming` and `aria-busy`, and shows a caret after the last part, unless that part holds a `StreamText`, which draws its own.",
    ],
  },
  examples: [
    {
      title: "Variants",
      body: [
        "`primary` and `secondary` fill the part, `tinted` washes it with the primary color, `outline` draws a border, `ghost` drops the bubble for plain text the width of the thread, and `destructive` is for a reply that failed.",
      ],
      sample: "message/variants",
    },
    {
      title: "A part that does something",
      body: [
        "`MessagePart` takes `render`, so a part can be a button or a link. It gets a hover fill and a focus border to match its variant.",
      ],
      sample: "message/clickable-part",
    },
    {
      title: "Reactions",
      body: [
        "`MessageReactions` sits on the edge of the part it's in. `side` picks the top or bottom edge and `align` the corner; give the part a bottom margin so the next row clears it.",
      ],
      code: {
        code: `<MessagePart className="mb-2">
  Ship it on Friday?
  <MessageReactions side="bottom" align="end">👍 2</MessageReactions>
</MessagePart>`,
      },
    },
  ],
  api: [
    {
      title: "Message",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        [
          "`align`",
          '`"start" | "end"`',
          '`"start"`',
          "Which side the message sits on.",
        ],
        [
          "`variant`",
          '`"primary" | "secondary" | "tinted" | "outline" | "ghost" | "destructive"`',
          '`"secondary"`',
          "How its parts are filled.",
        ],
        [
          "`streaming`",
          "`boolean`",
          "`false`",
          "Shows a caret after the last part while the reply is still being written.",
        ],
        ["`className`", "`string`", "", "Merged onto the root."],
      ],
      after: ["All other `div` props are forwarded."],
    },
    {
      title: "MessagePart",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        [
          "`render`",
          "`ReactElement | function`",
          "",
          "Swaps the `div` for another element, like a `button` or `a`.",
        ],
        ["`className`", "`string`", "", "Merged onto the part."],
      ],
      after: [
        "It grows to 80% of the thread, or the whole width as `ghost`, and keeps the text's own line breaks.",
      ],
    },
    {
      title: "MessageReactions",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        [
          "`side`",
          '`"top" | "bottom"`',
          '`"bottom"`',
          "Which edge of the part it sits on.",
        ],
        [
          "`align`",
          '`"start" | "end"`',
          '`"end"`',
          "Which corner of that edge.",
        ],
      ],
    },
    {
      title: "MessageActions",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        [
          "`reveal`",
          '`"hover" | "always"`',
          '`"hover"`',
          "Whether the actions wait for the pointer. On touch they always show.",
        ],
      ],
    },
    {
      title: "MessageAction",
      body: ["Takes the props of `TooltipIconButton`, `tooltip` among them."],
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        [
          "`tooltip`",
          "`ReactNode`",
          "required",
          "The tooltip, which is also its accessible name.",
        ],
      ],
    },
    {
      title: "Other parts",
      head: ["Part", "Element", "Description"],
      rows: [
        ["`MessageGroup`", "`div`", "A column of messages."],
        [
          "`MessageAvatar`",
          "`div`",
          "A 28px circle beside the parts; icons inside it are 16px.",
        ],
        [
          "`MessageContent`",
          "`div`",
          "The column of header, parts and footer.",
        ],
        ["`MessageHeader`", "`div`", "A caption above the parts, like a name."],
        [
          "`MessageFooter`",
          "`div`",
          "A row below the parts, for the time and actions.",
        ],
        [
          "`MessageTime`",
          "`time`",
          "The time it was sent, in tabular figures.",
        ],
      ],
      after: ["Each takes its element's props and merges `className`."],
    },
  ],
}

export default doc
