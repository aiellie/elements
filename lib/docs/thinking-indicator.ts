import type { DocContent } from "@/lib/docs"

const doc: DocContent = {
  intro: [
    "Thinking indicator says what a reply is doing before its first word: a live dot, a line of text with a shimmer running through it, and the seconds so far. It's the row a thread shows while it waits, and the one `Reasoning` shows while a model thinks.",
  ],
  gettingStarted: {
    steps: [
      {
        title: "Show it while a reply is on its way",
        body: [
          'With no children it says "Thinking". Give it what the reply is doing as that changes.',
        ],
        code: {
          title: "components/pending-reply.tsx",
          code: `import { ThinkingIndicator } from "@/components/aiellie/thinking-indicator"

export function PendingReply({ activity }: { activity?: string }) {
  return <ThinkingIndicator>{activity ?? "Thinking"}</ThinkingIndicator>
}`,
        },
        after: [
          "Show it until the first word of text arrives, then let the reply take its place.",
        ],
      },
    ],
  },
  anatomy: {
    code: `<span data-slot="thinking-indicator" role="status">
  <div data-slot="status" /> {/* live, pulsing */}
  <span /> {/* the text, shimmering */}
  <span aria-hidden>· 12s</span> {/* from the first second */}
</span>`,
    body: [
      "It's a `status` region, so a screen reader announces the text as it changes. The seconds are hidden from it, or it would speak every one. The dot is `Status` with the `live` variant, and with reduced motion the shimmer stops.",
    ],
  },
  examples: [
    {
      title: "Count from when it was asked",
      body: [
        "`startedAt` sets where the count starts. Without it the count starts when the indicator appears, so a thread that remounts it, or a page that reloads mid-reply, would start again from nothing.",
      ],
      sample: "thinking-indicator/started-at",
    },
    {
      title: "Write a duration the same way",
      body: [
        '`formatDuration` is how it writes the seconds, "12s" or "2m 5s", for a finished row like "Worked for 12s". Anything under a second reads as one.',
      ],
      code: {
        code: `import { formatDuration } from "@/components/aiellie/thinking-indicator"

formatDuration(0.4) // "1s"
formatDuration(125) // "2m 5s"`,
      },
    },
  ],
  api: [
    {
      title: "ThinkingIndicator",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        [
          "`startedAt`",
          "`Date | number`",
          "when it appears",
          "When the work began, to count the seconds from.",
        ],
        [
          "`children`",
          "`ReactNode`",
          '`"Thinking"`',
          "What the reply is doing.",
        ],
        ["`className`", "`string`", "", "Merged onto the root."],
      ],
      after: ["All other `span` props are forwarded."],
    },
    {
      title: "formatDuration",
      head: ["Argument", "Type", "Default", "Description"],
      rows: [
        ["`seconds`", "`number`", "required", "The time to write, in seconds."],
      ],
      after: ['Returns a `string` like `"12s"` or `"2m 5s"`.'],
    },
  ],
}

export default doc
