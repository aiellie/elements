"use client"

import * as React from "react"

import { DictateButton } from "@/registry/aiellie/components/dictate-button"
import { Input } from "@/registry/aiellie/ui/input"

export default function DictateButtonDemo() {
  const [value, setValue] = React.useState("")

  return (
    <div className="flex w-full max-w-xs items-center gap-2">
      <Input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Press the mic and speak"
        aria-label="Dictated text"
      />
      <DictateButton value={value} onValueChange={setValue} />
    </div>
  )
}
