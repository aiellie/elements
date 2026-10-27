"use client"

import {
  Copy01Icon,
  RepeatIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  Toolbar,
  ToolbarButton,
  ToolbarSeparator,
} from "@/registry/aiellie/components/toolbar"

export default function MessageActions() {
  return (
    <Toolbar
      aria-label="Message actions"
      className="border-transparent bg-transparent p-0"
    >
      <ToolbarButton aria-label="Copy" tooltip="Copy">
        <HugeiconsIcon aria-hidden icon={Copy01Icon} strokeWidth={2} />
      </ToolbarButton>
      <ToolbarButton aria-label="Try again" tooltip="Try again">
        <HugeiconsIcon aria-hidden icon={RepeatIcon} strokeWidth={2} />
      </ToolbarButton>
      <ToolbarSeparator />
      <ToolbarButton aria-label="Good reply" tooltip="Good reply">
        <HugeiconsIcon aria-hidden icon={ThumbsUpIcon} strokeWidth={2} />
      </ToolbarButton>
      <ToolbarButton aria-label="Bad reply" tooltip="Bad reply">
        <HugeiconsIcon aria-hidden icon={ThumbsDownIcon} strokeWidth={2} />
      </ToolbarButton>
    </Toolbar>
  )
}
