"use client"

import { Search01Icon, PencilEdit02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { TooltipIconButton } from "@/registry/aiellie/ui/tooltip-icon-button"

export default function Shortcut() {
  return (
    <div className="flex items-center gap-1">
      <TooltipIconButton tooltip="New chat" shortcut="⌘⇧O">
        <HugeiconsIcon aria-hidden icon={PencilEdit02Icon} />
      </TooltipIconButton>
      <TooltipIconButton tooltip="Search chats" shortcut="⌘K">
        <HugeiconsIcon aria-hidden icon={Search01Icon} />
      </TooltipIconButton>
    </div>
  )
}
