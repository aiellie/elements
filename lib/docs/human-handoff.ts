import type { DocContent } from "@/lib/docs"

const doc: DocContent = {
  intro: [
    "Human Handoff hands a chat from the assistant to a person. It offers one, with a summary of what they'll see first that the user can edit, and the facts that come along. Once they connect, it shows their place in line as dots and counts the wait down.",
    "Then it says who joined, with their avatar and a live dot, and that the assistant steps back. If no one's in, it says when they will be and takes an email to reach the user at. When the person leaves, the assistant picks up again.",
  ],
  gettingStarted: {
    steps: [
      {
        title: "Offer a person",
        body: [
          "Pass the state your support queue reports. `onConnect` gets the summary as the user left it.",
        ],
        code: {
          title: "components/handoff.tsx",
          code: `import { HumanHandoff } from "@/components/aiellie/human-handoff"

export function Handoff({ queue }: { queue: Queue }) {
  return (
    <HumanHandoff
      state={queue.state}
      reason="Refunds need someone from billing"
      summary={queue.summary}
      queuePosition={queue.position}
      waitSeconds={queue.estimate}
      agent={queue.agent}
      onConnect={(summary) => queue.join(summary)}
      onCancel={queue.leave}
      onEnd={queue.end}
    />
  )
}`,
        },
      },
    ],
  },
  anatomy: {
    code: `<div data-slot="human-handoff" data-state="connecting" role="group">
  <div data-slot="human-handoff-header" />
  {/* offered: the summary and details, Keep chatting and Connect */}
  {/* connecting: the queue, what was sent, Leave queue */}
  {/* connected: who joined, End chat */}
  {/* unavailable: when they're back, an email field */}
</div>`,
    body: [
      "The wait counts down once a second from the last estimate you pass. Only the place in line and whole minutes are read out, not every second.",
      'When someone ahead leaves, their dot shrinks away. `queueLabel` is exported too: 1 is "Next in line", 3 is "3rd in line".',
    ],
  },
  examples: [
    {
      title: "No one's in",
      body: [
        "With `onLeaveContact`, the unavailable state takes an email and confirms it.",
      ],
      sample: "human-handoff/unavailable",
    },
  ],
  api: [
    {
      title: "HumanHandoff",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        [
          "`state`",
          '`"offered" | "connecting" | "connected" | "unavailable" | "ended"`',
          "required",
          "",
        ],
        ["`reason`", "`string`", "", "Why a person is offered."],
        ["`summary`", "`string`", '`""`', "What the person sees first."],
        [
          "`details`",
          "`{ label: string; value: string }[]`",
          "`[]`",
          "Facts that come along.",
        ],
        ["`queuePosition`", "`number`", "`1`", "1 is next in line."],
        ["`waitSeconds`", "`number`", "", "The estimate it counts down."],
        [
          "`agent`",
          "`{ name: string; role?: string; image?: string }`",
          "",
          "Who joined.",
        ],
        ["`hours`", "`string`", "", "When support is back."],
        ["`onConnect`", "`(summary: string) => void`", "", ""],
        ["`onDismiss`", "`() => void`", "", "Adds Keep chatting."],
        ["`onCancel`", "`() => void`", "", "Adds Leave queue."],
        ["`onLeaveContact`", "`(contact: string) => void`", "", ""],
        ["`onEnd`", "`() => void`", "", "Adds End chat."],
      ],
      after: ["All other `div` props are forwarded."],
    },
  ],
}

export default doc
