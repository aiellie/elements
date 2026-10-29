"use client"

import * as React from "react"
import {
  MoreHorizontalIcon,
  PencilEdit02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { EditableTitle } from "@/registry/aiellie/components/editable-title"
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuTrigger,
} from "@/registry/aiellie/ui/menu"
import { TooltipIconButton } from "@/registry/aiellie/ui/tooltip-icon-button"

export default function FromMenu() {
  const [title, setTitle] = React.useState("Trip to Lisbon")
  const [editing, setEditing] = React.useState(false)

  return (
    <div className="flex w-full max-w-xs items-center gap-1">
      <EditableTitle
        title={title}
        label="Chat name"
        editing={editing}
        onEditingChange={setEditing}
        onRename={setTitle}
        render={<h2 />}
        className="flex-1"
      />
      <Menu>
        <MenuTrigger render={<TooltipIconButton tooltip="Chat options" />}>
          <HugeiconsIcon aria-hidden icon={MoreHorizontalIcon} />
        </MenuTrigger>
        <MenuContent align="end">
          <MenuItem onClick={() => setEditing(true)}>
            <HugeiconsIcon aria-hidden icon={PencilEdit02Icon} />
            Rename
          </MenuItem>
        </MenuContent>
      </Menu>
    </div>
  )
}
