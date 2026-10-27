"use client"

import * as React from "react"
import {
  SquareUnlock01Icon,
  TaskDaily01Icon,
  Touch01Icon,
} from "@hugeicons/core-free-icons"

import {
  ApprovalModeMenu,
  type ApprovalMode,
} from "@/registry/aiellie/components/approval-mode-menu"

const MODES: ApprovalMode[] = [
  {
    id: "ask",
    name: "Ask first",
    description: "Checks with you before anything runs.",
    icon: Touch01Icon,
  },
  {
    id: "plan",
    name: "Plan only",
    description: "Writes a plan and stops there.",
    icon: TaskDaily01Icon,
  },
  {
    id: "yolo",
    name: "Run everything",
    description: "Never stops to ask.",
    icon: SquareUnlock01Icon,
    destructive: true,
  },
]

export default function YourModes() {
  const [mode, setMode] = React.useState("ask")

  return (
    <ApprovalModeMenu
      modes={MODES}
      value={mode}
      onValueChange={setMode}
      label="Permissions"
    />
  )
}
