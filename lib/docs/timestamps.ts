import type { DocContent } from "@/lib/docs"

const doc: DocContent = {
  intro: [
    'Timestamps says when a message was sent, worded by how long ago. Within the hour it says the gap, like "4 minutes ago". Earlier the same day it says the time, and before that the day. `format` picks one of those wordings for good.',
    "`TimestampRow` puts it beside a message, and can keep it hidden until the row is hovered or focused, holding its space so the message never moves.",
  ],
  gettingStarted: {
    steps: [
      {
        title: "Put it beside a message",
        body: ["`live` keeps a relative label current, ticking every minute."],
        code: {
          title: "components/stamped-message.tsx",
          code: `import {
  Message,
  MessageContent,
  MessagePart,
} from "@/components/aiellie/message"
import { Timestamp, TimestampRow } from "@/components/aiellie/timestamps"

export function StampedMessage({ text, sentAt }: { text: string; sentAt: Date }) {
  return (
    <TimestampRow align="end" reveal="hover">
      <Message align="end">
        <MessageContent>
          <MessagePart>{text}</MessagePart>
        </MessageContent>
      </Message>
      <Timestamp date={sentAt} live />
    </TimestampRow>
  )
}`,
        },
      },
      {
        title: "Or across the thread",
        code: {
          title: "components/thread.tsx",
          code: `<Timestamp date={sentAt} format="datetime" variant="separator" />`,
        },
      },
    ],
  },
  anatomy: {
    code: `<div data-slot="timestamp-row" data-align="end" data-reveal="hover">
  {/* the message */}
  <time data-slot="timestamp" dateTime="…" title="…"> {/* marker */}
    <span data-slot="marker-content" />
  </time>
</div>`,
    body: [
      "It's a `time` element with the full date as its title. The wording is worked out in the browser only, since the server doesn't know the reader's clock or time zone.",
      "Every live timestamp ticking at the same rate shares one timer.",
    ],
  },
  examples: [
    {
      title: "Formats",
      body: ["The same moment, three hours ago, in each format."],
      sample: "timestamps/formats",
    },
  ],
  api: [
    {
      title: "Timestamp",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        ["`date`", "`Date | string | number`", "required", ""],
        [
          "`format`",
          '`"auto" | "relative" | "time" | "day" | "datetime"`',
          '`"auto"`',
          "",
        ],
        [
          "`variant`",
          '`"default" | "separator" | "border"`',
          '`"default"`',
          "The marker's look.",
        ],
        [
          "`live`",
          "`boolean | number`",
          "`false`",
          "Keeps it current: every minute, or every so many milliseconds.",
        ],
        ["`locale`, `hour12`", "", "the reader's", ""],
        ["`icon`", "`ReactNode`", "", "Before the label."],
        ["`children`", "`ReactNode`", "", "Your own label."],
      ],
      after: [
        "All other marker props are forwarded. `formatTimestamp(date, options)` gives the label as a string.",
      ],
    },
    {
      title: "TimestampRow",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        [
          "`align`",
          '`"start" | "end"`',
          '`"start"`',
          "Which side the message sits on.",
        ],
        [
          "`reveal`",
          '`"always" | "hover"`',
          '`"always"`',
          "Shows the timestamp only on hover or focus.",
        ],
      ],
    },
  ],
}

export default doc
