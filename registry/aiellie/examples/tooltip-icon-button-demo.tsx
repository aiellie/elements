"use client"

import {
  Bookmark01Icon,
  Copy01Icon,
  Delete01Icon,
  Link01Icon,
  PencilEdit01Icon,
  Share01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { TooltipIconButton } from "@/registry/aiellie/ui/tooltip-icon-button"

export default function TooltipIconButtonDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-1">
      <TooltipIconButton tooltip="Copy">
        <HugeiconsIcon icon={Copy01Icon} />
      </TooltipIconButton>
      <TooltipIconButton tooltip="Edit">
        <HugeiconsIcon icon={PencilEdit01Icon} />
      </TooltipIconButton>
      <TooltipIconButton tooltip="Copy link">
        <HugeiconsIcon icon={Link01Icon} />
      </TooltipIconButton>
      <TooltipIconButton tooltip="Share">
        <HugeiconsIcon icon={Share01Icon} />
      </TooltipIconButton>
      <TooltipIconButton tooltip="Save">
        <HugeiconsIcon icon={Bookmark01Icon} />
      </TooltipIconButton>
      <TooltipIconButton tooltip="Delete" side="top">
        <HugeiconsIcon icon={Delete01Icon} />
      </TooltipIconButton>
    </div>
  )
}
