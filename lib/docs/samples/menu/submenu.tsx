"use client"

import {
  Copy01Icon,
  Delete02Icon,
  FolderLibraryIcon,
  MoreHorizontalIcon,
  PencilEdit02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  Menu,
  MenuContent,
  MenuItem,
  MenuSeparator,
  MenuShortcut,
  MenuSub,
  MenuSubContent,
  MenuSubTrigger,
  MenuTrigger,
} from "@/registry/aiellie/ui/menu"
import { TooltipIconButton } from "@/registry/aiellie/ui/tooltip-icon-button"

export default function Submenu() {
  return (
    <Menu>
      <MenuTrigger render={<TooltipIconButton tooltip="Chat options" />}>
        <HugeiconsIcon aria-hidden icon={MoreHorizontalIcon} />
      </MenuTrigger>
      <MenuContent className="w-52">
        <MenuItem>
          <HugeiconsIcon aria-hidden icon={PencilEdit02Icon} />
          Rename
          <MenuShortcut>⌘R</MenuShortcut>
        </MenuItem>
        <MenuItem>
          <HugeiconsIcon aria-hidden icon={Copy01Icon} />
          Duplicate
        </MenuItem>
        <MenuSub>
          <MenuSubTrigger>
            <HugeiconsIcon aria-hidden icon={FolderLibraryIcon} />
            Move to project
          </MenuSubTrigger>
          <MenuSubContent>
            <MenuItem>Website redesign</MenuItem>
            <MenuItem>Q3 planning</MenuItem>
          </MenuSubContent>
        </MenuSub>
        <MenuSeparator />
        <MenuItem variant="destructive">
          <HugeiconsIcon aria-hidden icon={Delete02Icon} />
          Delete
        </MenuItem>
      </MenuContent>
    </Menu>
  )
}
