"use client"

import * as React from "react"
import {
  Cursor01Icon,
  PencilEdit02Icon,
  SquareIcon,
  TextIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  Toolbar,
  ToolbarButton,
  ToolbarGroup,
} from "@/registry/aiellie/components/toolbar"

const TOOLS = [
  { id: "select", label: "Select", icon: Cursor01Icon },
  { id: "draw", label: "Draw", icon: PencilEdit02Icon },
  { id: "shape", label: "Shape", icon: SquareIcon },
  { id: "text", label: "Text", icon: TextIcon },
]

export default function Vertical() {
  const [tool, setTool] = React.useState("select")

  return (
    <Toolbar aria-label="Tools" orientation="vertical">
      <ToolbarGroup aria-label="Tool">
        {TOOLS.map((entry) => (
          <ToolbarButton
            key={entry.id}
            aria-label={entry.label}
            tooltip={entry.label}
            tooltipSide="right"
            aria-pressed={tool === entry.id}
            onClick={() => setTool(entry.id)}
          >
            <HugeiconsIcon aria-hidden icon={entry.icon} strokeWidth={2} />
          </ToolbarButton>
        ))}
      </ToolbarGroup>
    </Toolbar>
  )
}
