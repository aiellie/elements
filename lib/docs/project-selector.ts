import type { DocContent } from "@/lib/docs"

const doc: DocContent = {
  intro: [
    "Project selector files a chat under a project, or under none. The trigger shows the project's name; the menu lists every project with a search, and choosing the current one again takes the chat out of it.",
  ],
  gettingStarted: {
    steps: [
      {
        title: "Pass the projects and the chat's project",
        body: ["`value` is `null` while the chat has no project."],
        code: {
          title: "components/chat-project.tsx",
          code: `"use client"

import * as React from "react"

import {
  ProjectSelector,
  type ProjectOption,
} from "@/components/aiellie/project-selector"

export function ChatProject({ projects }: { projects: ProjectOption[] }) {
  const [project, setProject] = React.useState<string | null>(null)

  return (
    <ProjectSelector
      projects={projects}
      value={project}
      onValueChange={setProject}
    />
  )
}`,
        },
      },
    ],
  },
  anatomy: {
    code: `<button data-slot="project-selector"> {/* render, a small ghost Button by default */}
  <svg /> {/* a folder */}
  <span class="sr-only">{label}: </span>
  {selected.name} {/* or the placeholder */}
</button>

<div data-slot="menu-content">
  <input /> {/* the search */}
  <div data-slot="menu-checkbox-item" /> {/* one per project, the current one ticked */}
</div>`,
    body: [
      "Rows are checkboxes rather than radio rows, so pressing the ticked one unticks it and `onValueChange` gets `null`. Choosing a row closes the menu.",
    ],
  },
  examples: [
    {
      title: "In a submenu",
      body: [
        "`projectSelectorItems` returns just the rows. It is a function rather than a component, so the search of the menu around it still sees each row.",
      ],
      sample: "project-selector/submenu",
    },
    {
      title: "Placeholder",
      body: ["Set what the trigger says while the chat has no project."],
      code: {
        code: `<ProjectSelector placeholder="Add to a project" {...props} />`,
      },
    },
  ],
  api: [
    {
      title: "ProjectSelector",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        [
          "`projects`",
          "`ProjectOption[]`",
          "required",
          "Every project, as `{ id, name }`, in the order to list them.",
        ],
        [
          "`value`",
          "`string | null`",
          "required",
          "The chat's project, or `null` when it has none.",
        ],
        [
          "`onValueChange`",
          "`(value: string | null) => void`",
          "required",
          "Called with the project chosen, or `null` when the current one is unticked.",
        ],
        [
          "`label`",
          "`string`",
          '`"Project"`',
          "What is being chosen, read out ahead of the project's name.",
        ],
        [
          "`placeholder`",
          "`string`",
          '`"Choose a project"`',
          "Shown while there's no project.",
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
      title: "projectSelectorItems",
      head: ["Export", "Type", "Description"],
      rows: [
        [
          "`projectSelectorItems({ projects, value, onValueChange })`",
          "`ReactNode[]`",
          "The rows alone, for a menu of your own.",
        ],
      ],
    },
  ],
}

export default doc
