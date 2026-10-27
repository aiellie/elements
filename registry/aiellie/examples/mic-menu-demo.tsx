"use client"

import * as React from "react"

import { MicMenu } from "@/registry/aiellie/components/mic-menu"

export default function MicMenuDemo() {
  const [device, setDevice] = React.useState("")

  return <MicMenu value={device} onValueChange={setDevice} side="bottom" />
}
