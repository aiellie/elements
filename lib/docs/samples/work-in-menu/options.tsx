"use client"

import * as React from "react"
import { CloudIcon, LaptopIcon } from "@hugeicons/core-free-icons"

import {
  WorkInMenu,
  type WorkInOption,
} from "@/registry/aiellie/components/work-in-menu"

const OPTIONS: WorkInOption[] = [
  { id: "this-machine", name: "This machine", icon: LaptopIcon },
  { id: "sandbox", name: "Sandbox", icon: CloudIcon },
]

export default function Options() {
  const [workIn, setWorkIn] = React.useState("sandbox")

  return (
    <WorkInMenu
      options={OPTIONS}
      value={workIn}
      onValueChange={setWorkIn}
      label="Run in"
    />
  )
}
