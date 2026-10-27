import type { DocContent } from "@/lib/docs"

const doc: DocContent = {
  intro: [
    "Thread transcript is a rail of short bars down the side of a thread, one per turn, that shows where the reader is and jumps to any turn on a click. It's `NavBars` hooked up to a `Thread`: the bars in view light up as the thread scrolls, and picking one scrolls its turn to the top. It hides where the pointer is coarse, since a rail that small is no target for a finger.",
  ],
  gettingStarted: {
    steps: [
      {
        title: "Put it inside the thread",
        body: [
          "It reads the thread's scroll state, so it goes inside `ThreadProvider`, and it's placed over the thread, so it goes inside `Thread`. Each item's `id` is the `messageId` of the turn it jumps to.",
        ],
        code: {
          title: "components/conversation.tsx",
          code: `import {
  Thread,
  ThreadContent,
  ThreadItem,
  ThreadProvider,
  ThreadViewport,
} from "@/components/aiellie/thread"
import { ThreadTranscript } from "@/components/aiellie/thread-transcript"

<ThreadProvider>
  <Thread>
    <ThreadViewport aria-label="Conversation">
      <ThreadContent className="ps-12">
        {turns.map((turn) => (
          <ThreadItem key={turn.id} messageId={turn.id} scrollAnchor>
            {/* the turn */}
          </ThreadItem>
        ))}
      </ThreadContent>
    </ThreadViewport>
    <ThreadTranscript
      items={turns.map((turn) => ({ id: turn.id, label: turn.question }))}
    />
  </Thread>
</ThreadProvider>`,
        },
        after: [
          "Pad the content's start side so the rail doesn't sit on the text, or move the rail with `className`.",
        ],
      },
    ],
  },
  anatomy: {
    code: `<nav data-slot="thread-transcript" aria-label="Transcript" data-variant="list">
  {/* NavBars: one bar per item, lit while its turn is in view */}
</nav>`,
    body: [
      "It sits absolutely at the start edge of the `Thread`, centred down it, above the messages. A bar is active while its turn is on screen or is the anchor the thread last settled on, so one is always lit even mid-reply. Jumps glide, or jump straight there under reduced motion.",
    ],
  },
  examples: [
    {
      title: "Peek at a turn",
      body: [
        '`variant="peek"` opens a card beside the rail on hover, with the turn\'s label and its `description`, like the start of the reply.',
      ],
      sample: "thread-transcript/peek",
    },
    {
      title: "Open the rail on hover",
      body: [
        '`variant="expand"` widens the rail into a list of labels while the pointer is over it, and `side` sets which way it grows.',
      ],
      code: {
        code: `<ThreadTranscript variant="expand" side="inline-end" items={items} />`,
      },
    },
  ],
  api: [
    {
      title: "ThreadTranscript",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        [
          "`items`",
          "`NavBarsItem[]`",
          "required",
          "One per turn. Each `id` is the `messageId` of the thread item it jumps to.",
        ],
        [
          "`variant`",
          '`"list" | "peek" | "expand"`',
          '`"list"`',
          "Bars only, a card on hover, or a rail that widens into labels.",
        ],
        [
          "`side`",
          '`"inline-start" | "inline-end"`',
          '`"inline-end"`',
          "Which way the card opens, or the rail grows.",
        ],
        ["`className`", "`string`", "", "Merged onto the rail."],
      ],
      after: [
        "All other `NavBars` props but `active` and `onSelect`, which the thread drives, are forwarded.",
      ],
    },
    {
      title: "NavBarsItem",
      head: ["Field", "Type", "Default", "Description"],
      rows: [
        ["`id`", "`string`", "required", "The turn's `messageId`."],
        [
          "`label`",
          "`string`",
          "required",
          "What the turn was, like its question.",
        ],
        [
          "`description`",
          "`string`",
          "",
          "A line or two under the label, in the `peek` card.",
        ],
      ],
    },
  ],
}

export default doc
