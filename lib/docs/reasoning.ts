import type { DocContent } from "@/lib/docs"

const doc: DocContent = {
  intro: [
    'Reasoning shows what a model thought before it replied. While the model thinks, its row says so with a live count and the thoughts stream in below it; once it\'s done the row folds shut and reads "Worked for 12s", and opens again on a click. If someone opens or shuts it themselves while it streams, it leaves it the way they chose.',
  ],
  gettingStarted: {
    steps: [
      {
        title: "Show the thoughts",
        body: [
          "`streaming` opens it and shows the thinking indicator. `duration` is how many seconds it thought for, which the row shows once it's done.",
        ],
        code: {
          title: "components/thoughts.tsx",
          code: `import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/aiellie/reasoning"

export function Thoughts({
  text,
  streaming,
  duration,
}: {
  text: string
  streaming: boolean
  duration?: number
}) {
  return (
    <Reasoning streaming={streaming} duration={duration}>
      <ReasoningTrigger />
      <ReasoningContent>{text}</ReasoningContent>
    </Reasoning>
  )
}`,
        },
      },
      {
        title: "Read it off the AI SDK",
        body: [
          "A model that shows its thinking sends `reasoning` parts before its text. It's still thinking while the message streams and no text has arrived yet.",
        ],
        code: {
          title: "components/messages.tsx",
          code: `const reasoning = message.parts
  .filter((part) => part.type === "reasoning")
  .map((part) => part.text)
  .join("")
const answered = message.parts.some(
  (part) => part.type === "text" && part.text
)

{reasoning ? (
  <Reasoning streaming={streaming && !answered} startedAt={sentAt}>
    <ReasoningTrigger />
    <ReasoningContent>{reasoning}</ReasoningContent>
  </Reasoning>
) : null}`,
        },
        after: [
          'Without a `duration` the finished row reads "Worked for a moment". Time it yourself, from asking to the first word of text, to show the seconds.',
        ],
      },
    ],
  },
  anatomy: {
    code: `<div data-slot="reasoning" data-streaming> {/* Base UI Collapsible */}
  <button data-slot="reasoning-trigger">
    {/* ThinkingIndicator while streaming, then "Worked for 12s" */}
    <svg /> {/* chevron, turns down while open */}
  </button>
  <div data-slot="reasoning-content" /> {/* the thoughts, behind a rule */}
</div>`,
    body: [
      "It's a Base UI `Collapsible`, so the panel's height animates from `--collapsible-panel-height` and it's `data-panel-open` on the trigger while open. The thoughts keep their own line breaks and sit behind a rule on the start side, in muted text, so they read as aside from the reply.",
    ],
  },
  examples: [
    {
      title: "Say what it's doing",
      body: [
        '`label` on the trigger replaces "Thinking" while it streams, for a model that\'s searching or reading. `startedAt` keeps the count going from when it was asked, even if the row remounts.',
      ],
      sample: "reasoning/activity",
    },
    {
      title: "Write your own row",
      body: [
        "Children replace the trigger's label altogether, in every state. The chevron stays.",
      ],
      code: {
        code: `<ReasoningTrigger>
  {streaming ? "Planning the change" : "See the plan"}
</ReasoningTrigger>`,
      },
    },
    {
      title: "Keep it open",
      body: [
        "Pass `open` and `onOpenChange` to hold it yourself, like a setting that always shows thoughts, or `defaultOpen` to start it open.",
      ],
      code: {
        code: `<Reasoning open={alwaysShow || undefined} streaming={streaming}>`,
      },
    },
  ],
  api: [
    {
      title: "Reasoning",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        [
          "`streaming`",
          "`boolean`",
          "`false`",
          "Whether the model is still thinking. It opens when this turns on and folds when it turns off, unless someone chose otherwise.",
        ],
        [
          "`duration`",
          "`number`",
          "",
          "Seconds it thought for, once it's done.",
        ],
        [
          "`startedAt`",
          "`Date | number`",
          "when `streaming` turned on",
          "When it started, so the count survives a remount.",
        ],
        ["`open`", "`boolean`", "", "Holds it open or shut."],
        [
          "`defaultOpen`",
          "`boolean`",
          "`streaming`",
          "Whether it starts open.",
        ],
        [
          "`onOpenChange`",
          "`(open: boolean) => void`",
          "",
          "Called when someone opens or shuts it.",
        ],
        ["`className`", "`string`", "", "Merged onto the root."],
      ],
      after: ["All other `Collapsible.Root` props are forwarded."],
    },
    {
      title: "ReasoningTrigger",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        [
          "`label`",
          "`ReactNode`",
          '`"Thinking"`',
          'What it says while the model works, like "Searching the web".',
        ],
        ["`children`", "`ReactNode`", "", "Replaces the label in every state."],
        ["`className`", "`string`", "", "Merged onto the button."],
      ],
    },
    {
      title: "ReasoningContent",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        ["`children`", "`ReactNode`", "", "The thoughts, so far."],
        ["`className`", "`string`", "", "Merged onto the panel."],
      ],
      after: ["All other `Collapsible.Panel` props are forwarded."],
    },
  ],
}

export default doc
