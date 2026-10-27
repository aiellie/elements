"use client"

import * as React from "react"

import { BranchesMenu } from "@/registry/aiellie/components/branches-menu"
import { Button } from "@/registry/aiellie/ui/button"

export default function Outline() {
  const [branches, setBranches] = React.useState(["main", "develop"])
  const [branch, setBranch] = React.useState("develop")

  return (
    <BranchesMenu
      branches={branches}
      value={branch}
      onValueChange={setBranch}
      onCreate={(name) => {
        setBranches((all) => [name, ...all])
        setBranch(name)
      }}
      render={<Button variant="outline" size="sm" />}
      align="start"
    />
  )
}
