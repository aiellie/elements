"use client"

import * as React from "react"

import { Switch } from "@/registry/aiellie/ui/switch"

export default function SwitchDemo() {
  const [fast, setFast] = React.useState(true)

  return (
    <div className="flex flex-col gap-4">
      <label className="flex items-center gap-3 text-sm">
        <Switch checked={fast} onCheckedChange={setFast} />
        Fast mode
      </label>
      <label className="flex items-center gap-3 text-sm text-muted-foreground">
        <Switch size="sm" disabled />
        Not on this plan
      </label>
    </div>
  )
}
