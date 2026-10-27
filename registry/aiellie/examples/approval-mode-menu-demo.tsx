"use client"

import * as React from "react"

import { ApprovalModeMenu } from "@/registry/aiellie/components/approval-mode-menu"

export default function ApprovalModeMenuDemo() {
  const [mode, setMode] = React.useState("auto")

  return <ApprovalModeMenu value={mode} onValueChange={setMode} />
}
