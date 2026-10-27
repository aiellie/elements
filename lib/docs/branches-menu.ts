import type { DocContent } from "@/lib/docs"

const doc: DocContent = {
  intro: [
    "Branches menu picks the git branch a task works on. The trigger shows the branch checked out; the menu lists the others with a search, and whatever is typed into the search can become a new branch from the row pinned under the list.",
  ],
  gettingStarted: {
    steps: [
      {
        title: "Pass the branches and the one checked out",
        body: [
          "It is controlled. `onValueChange` checks out an existing branch and `onCreate` gets the name typed into the search.",
        ],
        code: {
          title: "components/task-branch.tsx",
          code: `"use client"

import * as React from "react"

import { BranchesMenu } from "@/components/aiellie/branches-menu"

export function TaskBranch({ initial }: { initial: string[] }) {
  const [branches, setBranches] = React.useState(initial)
  const [branch, setBranch] = React.useState(initial[0])

  return (
    <BranchesMenu
      branches={branches}
      value={branch}
      onValueChange={setBranch}
      onCreate={(name) => {
        setBranches((all) => [name, ...all])
        setBranch(name)
      }}
    />
  )
}`,
        },
      },
    ],
  },
  anatomy: {
    code: `<button data-slot="branches-menu"> {/* render, a small ghost Button by default */}
  <svg /> {/* a branch */}
  <span class="sr-only">{label}: </span>
  {value}
</button>

<div data-slot="menu-content">
  <input /> {/* the search, which is also the new branch's name */}
  <div data-slot="menu-radio-group">
    <div data-slot="menu-radio-item" /> {/* one per branch, the checked-out one ticked */}
  </div>
  <div data-slot="menu-footer">
    <div data-slot="menu-item" /> {/* Create and check out “name” */}
  </div>
</div>`,
    body: [
      "Branch names are set in mono. The create row is pinned under the list, so the search never filters it out; it stays disabled until the search holds a name no branch has, since an existing name would check that branch out instead. Choosing a branch closes the menu.",
    ],
  },
  examples: [
    {
      title: "A different trigger",
      body: [
        "`render` replaces the trigger's button, here with an outlined one. The menu opens from wherever it sits.",
      ],
      sample: "branches-menu/outline",
    },
    {
      title: "Something other than a branch",
      body: [
        "`label` is read out before the value, so a screen reader hears what is being chosen. Change it when the list holds something else, like worktrees.",
      ],
      code: { code: `<BranchesMenu label="Worktree" {...props} />` },
    },
  ],
  api: [
    {
      title: "BranchesMenu",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        [
          "`branches`",
          "`string[]`",
          "required",
          "Every branch, in the order to list them.",
        ],
        ["`value`", "`string`", "required", "The branch checked out."],
        [
          "`onValueChange`",
          "`(value: string) => void`",
          "required",
          "Called with the branch chosen.",
        ],
        [
          "`onCreate`",
          "`(name: string) => void`",
          "required",
          "Called with the name typed into the search, to create that branch and check it out.",
        ],
        [
          "`label`",
          "`string`",
          '`"Branch"`',
          "What is being chosen, read out ahead of the branch's name.",
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
      after: ["All other `MenuTrigger` props are forwarded to the trigger."],
    },
  ],
}

export default doc
