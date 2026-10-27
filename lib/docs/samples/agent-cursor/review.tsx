"use client"

import * as React from "react"

import { AgentCursor } from "@/registry/aiellie/components/agent-cursor"

const DRAFT = "Ship on Friday, once the last two fixes are in."

export default function Review() {
  const [blocks, setBlocks] = React.useState([
    { id: "1", text: "We might ship on friday if things go ok." },
    { id: "2", text: "Ping me with anything that should hold it." },
  ])
  const [target, setTarget] = React.useState<string | undefined>("1")

  return (
    <AgentCursor
      title="Release note"
      blocks={blocks}
      target={target}
      draft={target ? DRAFT : ""}
      onKeepYours={() => setTarget(undefined)}
      onUseAgent={(text) => {
        setBlocks((current) =>
          current.map((block) =>
            block.id === target ? { ...block, text } : block
          )
        )
        setTarget(undefined)
      }}
    />
  )
}
