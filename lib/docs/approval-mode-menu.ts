import type { DocContent } from "@/lib/docs"

const doc: DocContent = {
  intro: [
    "Approval Mode Menu chooses how much an agent may do without asking, from the composer. Each mode says what it allows under its name: Auto asks only when something looks risky, Manual asks every time, Accept edits writes files freely, and Plan changes nothing until you agree. Full access, which never asks, sits under a rule in the destructive ink, and the button turns that ink while it's chosen.",
  ],
  gettingStarted: {
    steps: [
      {
        title: "Add it beside the composer",
        code: {
          title: "components/agent-input.tsx",
          code: `"use client"

import * as React from "react"

import { ApprovalModeMenu } from "@/components/aiellie/approval-mode-menu"

export function AgentMode() {
  const [mode, setMode] = React.useState("auto")
  return <ApprovalModeMenu value={mode} onValueChange={setMode} />
}`,
        },
        after: [
          "Your agent decides what each mode means. The menu only keeps the choice.",
        ],
      },
    ],
  },
  anatomy: {
    code: `<button data-slot="approval-mode-menu" data-destructive /> {/* menu trigger */}
<div data-slot="menu-content"> {/* in a portal */}
  <div data-slot="menu-radio-group">
    {/* a row per mode: icon, name, description, tick */}
    {/* a rule, then the destructive modes */}
  </div>
</div>`,
    body: [
      "It's the aiellie `Menu` with radio rows, so arrow keys move through the modes and the chosen one carries a tick.",
    ],
  },
  examples: [
    {
      title: "Your own modes",
      body: [
        "`modes` replaces the list. Mark a mode `destructive` to set it apart.",
      ],
      sample: "approval-mode-menu/your-modes",
    },
  ],
  api: [
    {
      title: "ApprovalModeMenu",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        ["`value`", "`string`", "required", "The chosen mode's id."],
        ["`onValueChange`", "`(value: string) => void`", "required", ""],
        ["`modes`", "`ApprovalMode[]`", "`APPROVAL_MODES`", "The modes."],
        [
          "`label`",
          "`string`",
          '`"Approvals"`',
          "Heads the menu and is read out on the button.",
        ],
        ["`side`, `align`", "", "", "Where the menu opens."],
        [
          "`render`",
          "`ReactElement`",
          "a small ghost `Button`",
          "The button it renders as.",
        ],
      ],
      after: ["All other menu trigger props are forwarded."],
    },
    {
      title: "ApprovalMode",
      head: ["Field", "Type", "Default", "Description"],
      rows: [
        ["`id`", "`string`", "required", ""],
        ["`name`", "`string`", "required", ""],
        ["`description`", "`string`", "required", "What it allows."],
        ["`icon`", "`IconSvgElement`", "required", "A Hugeicons glyph."],
        [
          "`destructive`",
          "`boolean`",
          "",
          "Sets it apart under a rule, in the destructive ink.",
        ],
      ],
    },
  ],
}

export default doc
