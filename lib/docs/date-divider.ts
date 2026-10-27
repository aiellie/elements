import type { DocContent } from "@/lib/docs"

const doc: DocContent = {
  intro: [
    'Date divider is the line in a thread that says when the messages after it were sent: "Today at 5:16 PM", "Yesterday at 9:02 AM", "Sunday, September 6 at 5:16 PM", with the year once it isn\'t this one. It writes the date in the reader\'s own language and time zone.',
  ],
  gettingStarted: {
    steps: [
      {
        title: "Put one where the day changes",
        body: [
          "`isSameDay` compares two dates by the reader's calendar, so a thread can put a divider before its first message and before each one sent on a new day.",
        ],
        code: {
          title: "components/messages.tsx",
          code: `"use client"

import { DateDivider, isSameDay } from "@/components/aiellie/date-divider"

export function Messages({
  messages,
}: {
  messages: { id: string; text: string; sentAt: Date }[]
}) {
  return messages.map((message, index) => {
    const previous = messages[index - 1]
    const newDay = !previous || !isSameDay(previous.sentAt, message.sentAt)

    return (
      <div key={message.id}>
        {newDay ? <DateDivider date={message.sentAt} /> : null}
        <p>{message.text}</p>
      </div>
    )
  })
}`,
        },
      },
    ],
  },
  anatomy: {
    code: `<div data-slot="date-divider"> {/* a Marker, centred */}
  <span data-slot="marker-content">
    <time dateTime="2026-09-06T17:16:00.000Z">Sunday, September 6 at 5:16 PM</time>
  </span>
</div>`,
    body: [
      "It's a `Marker` from the aiellie `ui`, so it takes the same quiet caption type as the thread's other markers. The `time` is written in the browser only: the server doesn't know the reader's day or time zone, and a label that differed between the two would break hydration. Until then the line keeps its height with nothing in it.",
    ],
  },
  examples: [
    {
      title: "Between messages",
      body: [
        "A divider before the first message, and again when the day turns.",
      ],
      sample: "date-divider/between-messages",
    },
    {
      title: "In another language",
      body: [
        "`locale` takes any BCP 47 tag. Without it the label follows the browser's language.",
      ],
      code: {
        code: `<DateDivider date={sentAt} locale="fr" />
// Hier à 17:16`,
      },
    },
    {
      title: "The label on its own",
      body: [
        "`formatDividerDate` is the function the divider uses, for a label somewhere else, like a tooltip on a message's time. `now` sets which day counts as today.",
      ],
      code: {
        code: `import { formatDividerDate } from "@/components/aiellie/date-divider"

formatDividerDate(sentAt) // "Yesterday at 5:16 PM"
formatDividerDate(sentAt, { locale: "de", now: new Date(2026, 8, 7) })`,
      },
    },
  ],
  api: [
    {
      title: "DateDivider",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        [
          "`date`",
          "`Date`",
          "required",
          "When the messages after it were sent.",
        ],
        [
          "`locale`",
          "`string`",
          "",
          "The language to write it in. Without it, the browser's.",
        ],
        [
          "`render`",
          "`ReactElement`",
          "",
          "Swaps the element, as on `Marker`.",
        ],
        ["`className`", "`string`", "", "Merged onto the root."],
      ],
      after: ["All other `div` props are forwarded."],
    },
    {
      title: "formatDividerDate",
      head: ["Argument", "Type", "Default", "Description"],
      rows: [
        ["`date`", "`Date`", "required", "The date to write."],
        [
          "`options.now`",
          "`Date`",
          "`new Date()`",
          "Which day counts as today.",
        ],
        ["`options.locale`", "`string`", "", "The language to write it in."],
      ],
      after: ["Returns the label as a `string`."],
    },
    {
      title: "isSameDay",
      head: ["Argument", "Type", "Default", "Description"],
      rows: [["`a`, `b`", "`Date`", "required", "The two dates to compare."]],
      after: [
        "Returns `true` when both fall on the same day in the reader's time zone.",
      ],
    },
  ],
}

export default doc
