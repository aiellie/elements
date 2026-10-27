import type { DocContent } from "@/lib/docs"

const doc: DocContent = {
  intro: [
    "Work in menu chooses where an agent runs a task: on this machine, in a fresh local copy, in a git worktree or in the cloud. The trigger shows the choice with its icon. It starts from those four, and takes a list of your own to rename, reorder or replace them.",
  ],
  gettingStarted: {
    steps: [
      {
        title: "Hold the choice",
        body: ["`value` is the `id` of the option chosen."],
        code: {
          title: "components/task-composer.tsx",
          code: `"use client"

import * as React from "react"

import { WorkInMenu } from "@/components/aiellie/work-in-menu"

export function TaskWorkIn() {
  const [workIn, setWorkIn] = React.useState("local")

  return <WorkInMenu value={workIn} onValueChange={setWorkIn} />
}`,
        },
      },
      {
        title: "Offer to connect an account",
        body: [
          "`onConnect` adds a row under the options, for linking an account that a cloud option needs. Without it the row is left out.",
        ],
        code: {
          code: `<WorkInMenu
  value={workIn}
  onValueChange={setWorkIn}
  onConnect={() => router.push("/settings/connections")}
  connectLabel="Connect a cloud account"
/>`,
        },
      },
    ],
  },
  anatomy: {
    code: `<button data-slot="work-in-menu"> {/* render, a small ghost Button by default */}
  <svg /> {/* the chosen option's icon */}
  <span class="sr-only">{label}: </span>
  {selected.name}
</button>

<div data-slot="menu-content">
  <div data-slot="menu-radio-group">
    <div data-slot="menu-radio-item" /> {/* one per option */}
  </div>
  <div data-slot="menu-separator" /> {/* only with onConnect */}
  <div data-slot="menu-item" /> {/* the connect row */}
</div>`,
    body: [
      "Choosing an option closes the menu. While `value` matches no option the trigger shows a laptop and the `label`. `WORK_IN_OPTIONS` is exported, so a list of your own can start from it.",
    ],
  },
  examples: [
    {
      title: "Your own options",
      body: ["Pass `options` with an icon each, and a `label` that fits them."],
      sample: "work-in-menu/options",
    },
    {
      title: "Extend the defaults",
      code: {
        code: `import { WORK_IN_OPTIONS } from "@/components/aiellie/work-in-menu"

const options = [...WORK_IN_OPTIONS, { id: "ssh", name: "Remote", icon: ServerStack01Icon }]`,
      },
    },
  ],
  api: [
    {
      title: "WorkInMenu",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        ["`value`", "`string`", "required", "The `id` of the option chosen."],
        [
          "`onValueChange`",
          "`(value: string) => void`",
          "required",
          "Called with the `id` chosen.",
        ],
        [
          "`options`",
          "`WorkInOption[]`",
          "`WORK_IN_OPTIONS`",
          "The places to choose from, each `{ id, name, icon }`.",
        ],
        [
          "`onConnect`",
          "`() => void`",
          "",
          "Shows a row under the options that links an account. Left out, the row is too.",
        ],
        [
          "`connectLabel`",
          "`string`",
          '`"Connect Claude Code on the web"`',
          "What the connect row says.",
        ],
        [
          "`label`",
          "`string`",
          '`"Work in"`',
          "What is being chosen, read out ahead of the option's name.",
        ],
        [
          "`render`",
          "`ReactElement`",
          '`<Button variant="ghost" size="sm" />`',
          "The trigger's element.",
        ],
        [
          "`side` / `align`",
          "`MenuContent` placement",
          "",
          "Where the menu opens.",
        ],
      ],
    },
    {
      title: "WORK_IN_OPTIONS",
      head: ["id", "name"],
      rows: [
        ["`local`", "Local"],
        ["`new-local`", "New local"],
        ["`worktree`", "Worktree"],
        ["`cloud`", "Cloud"],
      ],
    },
  ],
}

export default doc
