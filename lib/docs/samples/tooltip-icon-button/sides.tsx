"use client"

import {
  ArrowDown01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  ArrowUp01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { TooltipIconButton } from "@/registry/aiellie/components/tooltip-icon-button"

export default function Sides() {
  return (
    <div className="flex items-center gap-1">
      <TooltipIconButton tooltip="Top" side="top">
        <HugeiconsIcon aria-hidden icon={ArrowUp01Icon} />
      </TooltipIconButton>
      <TooltipIconButton tooltip="Bottom" side="bottom">
        <HugeiconsIcon aria-hidden icon={ArrowDown01Icon} />
      </TooltipIconButton>
      <TooltipIconButton tooltip="Left" side="left">
        <HugeiconsIcon aria-hidden icon={ArrowLeft01Icon} />
      </TooltipIconButton>
      <TooltipIconButton tooltip="Right" side="right">
        <HugeiconsIcon aria-hidden icon={ArrowRight01Icon} />
      </TooltipIconButton>
    </div>
  )
}
