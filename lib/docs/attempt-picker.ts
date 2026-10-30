import type { DocContent } from "@/lib/docs"

const doc: DocContent = {
  intro: [
    "Attempt Picker lays out several attempts at the same task, from different models or approaches, so you can pick one. While they run, each shows its progress. Once they're done, each shows the lines it added and removed and how many tests pass, and the one you select opens to its summary, files, cost and time.",
    "It suggests one: the most tests passing, then the smallest change. It waits until every attempt has reported, so an early finisher isn't suggested over the rest. Applying one discards the others.",
  ],
  gettingStarted: {
    steps: [
      {
        title: "Pass the attempts",
        body: [
          "Update `attempts` as they report. `onApply` adds the button; set `applied` once it's done.",
        ],
        code: {
          title: "components/attempts.tsx",
          code: `import { AttemptPicker } from "@/components/aiellie/attempt-picker"

export function Attempts({ run }: { run: Run }) {
  const [applied, setApplied] = useState<string>()

  return (
    <AttemptPicker
      task={run.task}
      attempts={run.attempts}
      applied={applied}
      onApply={async (id) => {
        await run.apply(id)
        setApplied(id)
      }}
    />
  )
}`,
        },
      },
    ],
  },
  anatomy: {
    code: `<div data-slot="attempt-picker" data-state="ready" role="group">
  <div data-slot="attempt-picker-header" />
  <div role="radiogroup">
    <div data-slot="attempt-picker-attempt" data-state="done" data-selected role="radio" />
  </div>
  <button data-slot="attempt-picker-apply" />
</div>`,
    body: [
      "The attempts are a radio group: the arrow keys move the selection. Failing tests and failed attempts take the destructive colour, and the suggested one carries a quiet tag.",
      "`suggestAttempt` is exported too, if you'd rather show the suggestion somewhere else.",
    ],
  },
  examples: [
    {
      title: "No suggestion",
      body: [
        "Pass `suggested={null}` when there's nothing to measure, like two drafts of the same text.",
      ],
      sample: "attempt-picker/no-suggestion",
    },
  ],
  api: [
    {
      title: "AttemptPicker",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        ["`task`", "`string`", "required", "What every attempt was given."],
        ["`attempts`", "`Attempt[]`", "required", ""],
        [
          "`selected`, `defaultSelected`, `onSelectedChange`",
          "`string`",
          "the first",
          "",
        ],
        [
          "`suggested`",
          "`string | null`",
          "`suggestAttempt(attempts)`",
          "`null` for none.",
        ],
        ["`applied`", "`string`", "", "The others show as discarded."],
        ["`onApply`", "`(id: string) => void`", "", "Adds Apply."],
      ],
      after: ["All other `div` props are forwarded."],
    },
    {
      title: "Attempt",
      head: ["Field", "Type", "Default", "Description"],
      rows: [
        ["`id`, `label`", "`string`", "required", ""],
        ["`state`", '`"running" | "done" | "failed"`', "required", ""],
        ["`progress`", "`number`", "", "From 0 to 1 while running."],
        ["`summary`", "`string`", "", "What it did, in a sentence."],
        ["`additions`, `deletions`, `files`", "`number`", "", ""],
        ["`tests`", "`{ passed: number; total: number }`", "", ""],
        ["`cost`", "`string`", "", 'Already formatted: "$0.42".'],
        ["`seconds`", "`number`", "", ""],
      ],
    },
  ],
}

export default doc
