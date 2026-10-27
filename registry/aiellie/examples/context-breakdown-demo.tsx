"use client"

import * as React from "react"

import { ContextBreakdown } from "@/registry/aiellie/components/context-breakdown"
import { Button } from "@/registry/aiellie/ui/button"

export default function ContextBreakdownDemo() {
  const [compacted, setCompacted] = React.useState(false)

  return (
    <div className="flex w-full max-w-xs flex-col items-start gap-4 px-4">
      <ContextBreakdown
        max={200_000}
        segments={[
          { key: "system", label: "System prompt", tokens: 8_200 },
          { key: "tools", label: "Tools", tokens: 21_600 },
          { key: "files", label: "Files", tokens: 46_900 },
          {
            key: "conversation",
            label: "Conversation",
            tokens: compacted ? 12_300 : 81_700,
          },
        ]}
      />
      <Button
        variant="outline"
        size="sm"
        onClick={() => setCompacted((value) => !value)}
      >
        {compacted ? "Restore" : "Compact"}
      </Button>
    </div>
  )
}
