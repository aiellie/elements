"use client"

import * as React from "react"

import { WorkInMenu } from "@/registry/aiellie/components/work-in-menu"

export default function WorkInMenuDemo() {
  const [workIn, setWorkIn] = React.useState("local")

  return (
    <WorkInMenu value={workIn} onValueChange={setWorkIn} onConnect={() => {}} />
  )
}
