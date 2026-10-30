import type { DocContent } from "@/lib/docs"

const doc: DocContent = {
  intro: [
    "Plan Review shows the plan an agent proposes before it runs anything, and lets you shape it first. Drag a step by its handle, or focus the handle and use the arrow keys. Press a step to rewrite it, remove or restore it, or add one of your own. Then run the plan, or send it back with a note saying what should change.",
    "What comes back is a `PlanDecision`: the steps to run, in order, plus exactly what you changed. A step counts as moved only if it left the order the others kept, so dragging one step down doesn't mark every step it passed. The newest change flashes on a `muted` fill and settles. Once you decide, the controls give way to a line saying what was decided.",
  ],
  gettingStarted: {
    steps: [
      {
        title: "Show the plan",
        body: [
          "Keep the state and the decision, so the card can show what was decided.",
        ],
        code: {
          title: "components/agent-plan.tsx",
          code: `"use client"

import * as React from "react"

import {
  PlanReview,
  type PlanDecision,
  type PlanReviewState,
  type PlanStep,
} from "@/components/aiellie/plan-review"

export function AgentPlan({
  steps,
  onDecide,
}: {
  steps: PlanStep[]
  onDecide: (decision: PlanDecision, note?: string) => void
}) {
  const [state, setState] = React.useState<PlanReviewState>("review")
  const [note, setNote] = React.useState("")

  return (
    <PlanReview
      steps={steps}
      state={state}
      note={note}
      onApprove={(decision) => {
        setState("approved")
        onDecide(decision)
      }}
      onRevise={(text, decision) => {
        setNote(text)
        setState("revising")
        onDecide(decision, text)
      }}
    />
  )
}`,
        },
      },
      {
        title: "Hand the decision back to the agent",
        body: [
          "Send `decision.steps` as the plan to run. `decision.edits` lists the ids that were moved, rewritten, added or removed, if the agent should hear about them.",
        ],
      },
    ],
  },
  anatomy: {
    code: `<div data-slot="plan-review" data-state="review" role="group">
  <div data-slot="plan-review-header" />
  <ol>
    <li data-slot="plan-review-step" data-removed data-dragging data-flashing>
      {/* handle, number, label, tag, remove */}
    </li>
  </ol>
  {/* Add step, then the edit count with Keep planning and Run plan */}
  <div data-slot="plan-review-receipt" role="status" /> {/* once decided */}
</div>`,
    body: [
      "The handle is a button that the arrow keys, Home and End move, and each move is read out. Steps glide to their new place unless motion is reduced.",
      "Removed steps stay listed, struck through, until you decide, so you can restore them. A step you added and then removed simply goes.",
    ],
  },
  examples: [
    {
      title: "From a stored decision",
      body: [
        "Pass the saved `decision` with its `state` to show it again after a reload.",
      ],
      sample: "plan-review/stored-decision",
    },
  ],
  api: [
    {
      title: "PlanReview",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        ["`steps`", "`PlanStep[]`", "required", "The plan as proposed."],
        ["`state`", '`"review" | "approved" | "revising"`', '`"review"`', ""],
        [
          "`onApprove`",
          "`(decision: PlanDecision) => void`",
          "",
          "Adds Run plan.",
        ],
        [
          "`onRevise`",
          "`(note: string, decision: PlanDecision) => void`",
          "",
          "Adds Keep planning, which asks for a note.",
        ],
        ["`decision`", "`PlanDecision`", "", "A stored decision to show."],
        ["`note`", "`string`", "", "The note shown once sent back."],
        [
          "`draft`, `onDraftChange`",
          "`PlanDraftStep[]`",
          "",
          "Controls the edits.",
        ],
        [
          "`readOnly`",
          "`boolean`",
          "`false`",
          "Shows the plan without editing.",
        ],
        ["`title`", "`string`", '`"Proposed plan"`', ""],
        ["`subtitle`", "`string`", '`"Nothing runs until you approve"`', ""],
        ["`approveLabel`", "`string`", '`"Run plan"`', ""],
        ["`reviseLabel`", "`string`", '`"Keep planning"`', ""],
      ],
      after: ["All other `div` props are forwarded."],
    },
    {
      title: "PlanDecision",
      head: ["Field", "Type", "Default", "Description"],
      rows: [
        ["`steps`", "`PlanStep[]`", "", "What to run, in order."],
        [
          "`removed`",
          "`PlanStep[]`",
          "",
          "Proposed steps that were taken out.",
        ],
        [
          "`edits`",
          "`{ moved, rewritten, added, removed }`",
          "",
          "The ids each change touched.",
        ],
      ],
      after: [
        "A `PlanStep` is `{ id, label }`. `decidePlan(steps, draft)` works out a decision yourself.",
      ],
    },
  ],
}

export default doc
