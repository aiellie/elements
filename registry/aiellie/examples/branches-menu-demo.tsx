"use client"

import * as React from "react"

import { BranchesMenu } from "@/registry/aiellie/components/branches-menu"

export default function BranchesMenuDemo() {
  const [branches, setBranches] = React.useState([
    "main",
    "feat/composer-tray",
    "fix/attachment-preview",
    "chore/update-deps",
  ])
  const [branch, setBranch] = React.useState("main")

  return (
    <BranchesMenu
      branches={branches}
      value={branch}
      onValueChange={setBranch}
      onCreate={(name) => {
        setBranches((all) => [name, ...all])
        setBranch(name)
      }}
    />
  )
}
