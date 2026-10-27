import type { DocContent } from "@/lib/docs"

const doc: DocContent = {
  intro: [
    "Editable title is a page or chat heading that renames in place. Click it and it becomes a field with the name selected; Enter or clicking away keeps the new name, Escape or an empty field keeps the old one. Without `onRename` it is plain text, for something that can't be renamed yet.",
  ],
  gettingStarted: {
    steps: [
      {
        title: "Hold the title and the editing state",
        body: [
          "Both are controlled, so something else, like a Rename menu item, can open the field too.",
        ],
        code: {
          title: "components/chat-title.tsx",
          code: `"use client"

import * as React from "react"

import { EditableTitle } from "@/components/aiellie/editable-title"

export function ChatTitle({
  title,
  onRename,
}: {
  title: string
  onRename: (title: string) => void
}) {
  const [editing, setEditing] = React.useState(false)

  return (
    <EditableTitle
      title={title}
      label="Chat name"
      editing={editing}
      onEditingChange={setEditing}
      onRename={onRename}
    />
  )
}`,
        },
      },
    ],
  },
  anatomy: {
    code: `<h1 data-slot="editable-title"> {/* render, an h1 by default */}
  <button title="Rename"> {/* only with onRename */}
    <span>{title}</span>
  </button>
</h1>

{/* while editing, in place of the heading: */}
<input data-slot="editable-title-input" aria-label={label} />`,
    body: [
      "The heading is set at 14px in `label` weight, and the button inside it gets the `accent` fill on hover. While editing, the field takes the heading's place rather than sitting inside it, so there's never an input inside an `h1`. It takes focus a frame late, so a menu that opened it can hand focus back to its trigger first without stealing it. `onRename` only fires for a name that changed.",
      "`useRenameInput` is exported too: the same Enter, Escape and blur handling for a rename field of your own, like one in a sidebar row.",
    ],
  },
  examples: [
    {
      title: "Rename from a menu",
      body: [
        "Set `editing` from a menu item. `render` makes it an `h2` here, since the page has its own `h1`.",
      ],
      sample: "editable-title/from-menu",
    },
    {
      title: "Your own rename field",
      body: [
        "`useRenameInput` returns the props for an input: its ref, value and handlers. `onDone` gets the trimmed name, or nothing when it was cancelled or emptied.",
      ],
      code: {
        code: `function RowRename({ title, onDone }: { title: string; onDone: (title?: string) => void }) {
  return <Input {...useRenameInput(title, onDone)} aria-label="Chat name" />
}`,
      },
    },
  ],
  api: [
    {
      title: "EditableTitle",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        [
          "`title`",
          "`string`",
          "required",
          "The name shown, and what the field starts from.",
        ],
        ["`editing`", "`boolean`", "required", "Whether the field is open."],
        [
          "`onEditingChange`",
          "`(editing: boolean) => void`",
          "required",
          "Called to open the field on a click, and to close it when done.",
        ],
        [
          "`onRename`",
          "`(title: string) => void`",
          "",
          "Called with a new name. Left out for something that can't be renamed yet, which shows plain text.",
        ],
        [
          "`label`",
          "`string`",
          '`"Name"`',
          "What the field is called for screen readers, like `Chat name`.",
        ],
        ["`render`", "`ReactElement`", "`<h1 />`", "The heading's element."],
        ["`className`", "`string`", "", "Merged onto the heading."],
      ],
    },
    {
      title: "useRenameInput",
      head: ["Export", "Type", "Description"],
      rows: [
        [
          "`useRenameInput(title, onDone)`",
          "`(title: string, onDone: (title?: string) => void) => InputProps`",
          "Props for a rename input: focused and selected on mount, Enter keeps, Escape cancels, blur keeps.",
        ],
      ],
    },
  ],
}

export default doc
