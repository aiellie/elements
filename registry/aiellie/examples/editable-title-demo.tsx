"use client"

import * as React from "react"

import { EditableTitle } from "@/registry/aiellie/components/editable-title"

export default function EditableTitleDemo() {
  const [title, setTitle] = React.useState("Launch checklist")
  const [editing, setEditing] = React.useState(false)

  return (
    <div className="flex w-full max-w-xs flex-col items-center gap-2">
      <EditableTitle
        title={title}
        label="Document name"
        editing={editing}
        onEditingChange={setEditing}
        onRename={setTitle}
      />
      <p className="text-xs text-muted-foreground">
        Click the title to rename it.
      </p>
    </div>
  )
}
