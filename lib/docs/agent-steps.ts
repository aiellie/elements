import type { DocContent } from "@/lib/docs"

const doc: DocContent = {
  intro: [
    'Agent Steps lays out what an agent did as a list of steps under one row. While it runs, the row reads Working with a live count and the steps fill in below it. Once it\'s done, the row folds shut and reads "Worked for 12s", and opens again on a click.',
    "Each step has a status. A finished step shows its own icon or a tick, the step in progress shows a live dot with a shimmer, and a failed one turns destructive. Under its label a step can carry a line of detail, the results it found, or anything else.",
  ],
  gettingStarted: {
    steps: [
      {
        title: "List the steps",
        body: [
          "`streaming` opens it and shows the indicator. `duration` is how many seconds the run took, which the row shows once it's done.",
        ],
        code: {
          title: "components/run.tsx",
          code: `import { Globe02Icon } from "@hugeicons/core-free-icons"

import {
  AgentStep,
  AgentStepResult,
  AgentStepResults,
  AgentSteps,
  AgentStepsContent,
  AgentStepsTrigger,
} from "@/components/aiellie/agent-steps"

export function Run({ streaming }: { streaming: boolean }) {
  return (
    <AgentSteps streaming={streaming} duration={18}>
      <AgentStepsTrigger />
      <AgentStepsContent>
        <AgentStep icon={Globe02Icon} label="Searched for container queries">
          <AgentStepResults>
            <AgentStepResult href="https://developer.mozilla.org">
              MDN
            </AgentStepResult>
          </AgentStepResults>
        </AgentStep>
        <AgentStep status="active" label="Reading chart.tsx" />
      </AgentStepsContent>
    </AgentSteps>
  )
}`,
        },
      },
    ],
  },
  anatomy: {
    code: `<div data-slot="agent-steps" data-streaming> {/* Base UI Collapsible */}
  <button data-slot="agent-steps-trigger" />
  <div data-slot="agent-steps-content">
    <ol>
      <li data-slot="agent-step" data-status="done">
        <p data-slot="agent-step-detail" />
        <ul data-slot="agent-step-results">
          <li data-slot="agent-step-result" />
        </ul>
      </li>
    </ol>
  </div>
</div>`,
    body: [
      "A rail joins each step's mark to the next one's. Each step's status is read out after its label, so the list makes sense without the icons.",
      "It opens while `streaming` is on and folds when it turns off, unless someone opened or shut it themselves, which it then leaves alone. That's the same as Reasoning, so the two read alike side by side.",
    ],
  },
  examples: [
    {
      title: "A step that failed",
      body: [
        "A failed step turns its mark destructive. Steps after it can stay `pending`, in muted ink.",
      ],
      sample: "agent-steps/failed",
    },
  ],
  api: [
    {
      title: "AgentSteps",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        [
          "`streaming`",
          "`boolean`",
          "`false`",
          "Whether the agent is still working.",
        ],
        ["`duration`", "`number`", "", "Seconds the run took, once it's done."],
        [
          "`startedAt`",
          "`Date | number`",
          "when `streaming` turned on",
          "When it started, so the count survives a remount.",
        ],
        [
          "`open`, `defaultOpen`",
          "`boolean`",
          "`streaming`",
          "Holds it, or starts it, open.",
        ],
        ["`onOpenChange`", "`(open: boolean) => void`", "", ""],
      ],
      after: ["All other `Collapsible.Root` props are forwarded."],
    },
    {
      title: "AgentStepsTrigger",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        [
          "`label`",
          "`ReactNode`",
          '`"Working"`',
          "What it says while the agent works.",
        ],
        ["`children`", "`ReactNode`", "", "Replaces the label in every state."],
      ],
    },
    {
      title: "AgentStep",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        ["`label`", "`ReactNode`", "required", "What the step does."],
        [
          "`status`",
          '`"pending" | "active" | "done" | "error"`',
          '`"done"`',
          "",
        ],
        [
          "`icon`",
          "`IconSvgElement`",
          "a tick",
          "Shown once the step is done, like a globe for a search.",
        ],
        [
          "`children`",
          "`ReactNode`",
          "",
          "Detail, results, or anything else under the label.",
        ],
      ],
    },
    {
      title: "AgentStepResult",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        [
          "`href`",
          "`string`",
          "",
          "Makes the chip a link that opens in a new tab.",
        ],
      ],
      after: [
        "`AgentStepsContent`, `AgentStepDetail` and `AgentStepResults` forward their element's props.",
      ],
    },
  ],
}

export default doc
