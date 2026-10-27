"use client"

import * as React from "react"

import { AttemptPicker } from "@/registry/aiellie/components/attempt-picker"

export default function NoSuggestion() {
  const [selected, setSelected] = React.useState("short")

  return (
    <AttemptPicker
      task="Write the release announcement"
      suggested={null}
      selected={selected}
      onSelectedChange={setSelected}
      onApply={(id) => console.log("Apply", id)}
      attempts={[
        {
          id: "short",
          label: "Short",
          state: "done",
          summary: "Three sentences: what changed, who it's for, the link.",
        },
        {
          id: "long",
          label: "With examples",
          state: "done",
          summary: "Adds a before and after for each change, and a FAQ.",
        },
      ]}
    />
  )
}
