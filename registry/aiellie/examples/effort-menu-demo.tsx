"use client"

import * as React from "react"

import { EffortMenu } from "@/registry/aiellie/components/effort-menu"

export default function EffortMenuDemo() {
  const [effort, setEffort] = React.useState("medium")

  return <EffortMenu value={effort} onValueChange={setEffort} side="bottom" />
}
