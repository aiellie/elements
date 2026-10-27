import type { DocContent } from "@/lib/docs"

const doc: DocContent = {
  intro: [
    'Run Budget puts a spend cap on an agent run. Before it starts, you pick the cap. While it runs, a meter fills in the live colour, then turns to the warning colour with "May finish over budget" once it passes `warnAt`. A notch on the meter marks that point.',
    "When the run stops at the cap, it lists what got done and offers two ways on: keep that work, or raise the cap and carry on. The step that crosses the cap still finishes, so spend can go past it, and the card says by how much.",
  ],
  gettingStarted: {
    steps: [
      {
        title: "Drive it from the run",
        body: [
          "The component holds no run of its own. Pass the state and the spend as they change.",
        ],
        code: {
          title: "components/budget.tsx",
          code: `import { RunBudget } from "@/components/aiellie/run-budget"

export function Budget({ run }: { run: Run }) {
  return (
    <RunBudget
      state={run.state}
      limit={run.limit}
      spent={run.spent}
      turns={run.turns}
      elapsedSeconds={run.seconds}
      onLimitChange={run.setLimit}
      onStart={run.start}
    />
  )
}`,
        },
      },
      {
        title: "Handle the stop",
        body: [
          "Once `state` is `stopped`, pass what was kept and the two ways on. `onRaise` gets the new cap, double the old one unless you set `raiseTo`.",
        ],
        code: {
          title: "components/budget.tsx",
          code: `<RunBudget
  state="stopped"
  limit={run.limit}
  spent={run.spent}
  kept={[{ label: "Files changed", value: "4" }]}
  onKeep={run.finish}
  onRaise={(limit) => run.resume(limit)}
/>`,
        },
      },
    ],
  },
  anatomy: {
    code: `<div data-slot="run-budget" data-state="running" data-warning role="group">
  <div data-slot="run-budget-header" />
  <div role="radiogroup" />            {/* while setting */}
  <div data-slot="run-budget-meter" role="meter" />
  {/* left, unused or past the cap; then the share or the warning */}
</div>`,
    body: [
      "The caps are a radio group: the arrow keys move between them. The warning is read out once a run, not on every tick, and stopping and finishing are each read out as they happen.",
      "`formatMoney` is exported too. Spend always shows cents, and a whole cap doesn't: $5, $4.18.",
    ],
  },
  examples: [
    {
      title: "Stopped, with nothing to decide",
      body: [
        "Leave out `onKeep` and `onRaise`, and a stopped run says the finished work is kept.",
      ],
      sample: "run-budget/no-actions",
    },
  ],
  api: [
    {
      title: "RunBudget",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        [
          "`state`",
          '`"setting" | "running" | "stopped" | "done"`',
          "required",
          "",
        ],
        ["`limit`", "`number`", "required", "The cap, in `currency`."],
        ["`spent`", "`number`", "`0`", "It can pass `limit`."],
        ["`options`", "`number[]`", "`[1, 5, 20]`", "The caps offered."],
        ["`onLimitChange`", "`(limit: number) => void`", "", ""],
        ["`onStart`", "`() => void`", "", "Adds Start run while setting."],
        ["`turns`", "`number`", "", ""],
        ["`elapsedSeconds`", "`number`", "", ""],
        [
          "`warnAt`",
          "`number`",
          "`0.8`",
          "The share of the cap at which it warns.",
        ],
        ["`raiseTo`", "`number`", "double `limit`", "The cap offered."],
        ["`onRaise`", "`(limit: number) => void`", "", ""],
        ["`onKeep`", "`() => void`", "", ""],
        [
          "`kept`",
          "`{ label: string; value: string }[]`",
          "`[]`",
          "What the run finished before it stopped.",
        ],
        ["`currency`", "`string`", '`"USD"`', ""],
      ],
      after: ["All other `div` props are forwarded."],
    },
  ],
}

export default doc
