import type { DocContent } from "@/lib/docs"

const doc: DocContent = {
  intro: [
    "Needs You collects every agent that's waiting on you into one list, longest wait first. An approval shows the command or file in question with Deny and Approve. A question shows its choices. A blocked task links to its thread.",
    "Waits count up while the list is open, and turn to the destructive colour, marked overdue, past `staleAfter`. An answered item folds away, and focus moves to the one that takes its place.",
  ],
  gettingStarted: {
    steps: [
      {
        title: "Pass what's waiting",
        body: [
          "Send the answer on, then take the item out of `items`. It folds away whoever removes it.",
        ],
        code: {
          title: "components/inbox.tsx",
          code: `import { NeedsYou } from "@/components/aiellie/needs-you"

export function Inbox({ waiting }: { waiting: WaitingItem[] }) {
  return (
    <NeedsYou
      items={waiting}
      onAnswer={(id, answer) => respond(id, answer)}
      onOpen={(id) => router.push(\`/threads/\${id}\`)}
    />
  )
}`,
        },
      },
    ],
  },
  anatomy: {
    code: `<div data-slot="needs-you" role="region">
  <div data-slot="needs-you-header" />
  <ul>
    <li data-item data-leaving>
      <div data-slot="needs-you-item" data-kind="approval" data-stale role="group" />
    </li>
  </ul>
</div>`,
    body: [
      "Each answer is read out with the thread it frees. The list scrolls inside the region once it's taller than its container, so give it a `max-h-*` where space is short.",
      '`formatWait` is exported too: "now", "45s", "12m", "3h".',
    ],
  },
  examples: [
    {
      title: "Read only",
      body: [
        "Without `onAnswer` and `onOpen`, it lists what's waiting with no buttons, for a summary elsewhere.",
      ],
      sample: "needs-you/read-only",
    },
  ],
  api: [
    {
      title: "NeedsYou",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        ["`items`", "`WaitingItem[]`", "required", ""],
        [
          "`onAnswer`",
          "`(id: string, answer: WaitingAnswer) => void`",
          "",
          '`{ kind: "approval"; approved }` or `{ kind: "question"; answer }`.',
        ],
        [
          "`onOpen`",
          "`(id: string) => void`",
          "",
          "Links each thread, and adds Open to blocked tasks.",
        ],
        [
          "`staleAfter`",
          "`number`",
          "`600`",
          "Seconds after which a wait is overdue.",
        ],
      ],
      after: ["All other `div` props are forwarded."],
    },
    {
      title: "WaitingItem",
      head: ["Field", "Type", "Default", "Description"],
      rows: [
        ["`id`, `thread`, `prompt`", "`string`", "required", ""],
        ["`kind`", '`"approval" | "question" | "blocked"`', "required", ""],
        ["`detail`", "`string`", "", "Shown in mono."],
        ["`options`", "`string[]`", "", "The choices for a question."],
        [
          "`waitingSeconds`",
          "`number`",
          "required",
          "How long it had waited when the list was built.",
        ],
      ],
    },
  ],
}

export default doc
