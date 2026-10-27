"use client"

import * as React from "react"

import {
  CompactionMarker,
  type CompactionItem,
  type CompactionState,
} from "@/registry/aiellie/components/compaction-marker"

const ITEMS: CompactionItem[] = [
  { id: "d1", kind: "decision", label: "Keep prices in cents, as integers" },
  {
    id: "d2",
    kind: "decision",
    label: "Tax is worked out per line, not per cart",
  },
  {
    id: "t1",
    kind: "task",
    label: "Move the price maths into lib/price.ts",
    done: true,
  },
  { id: "t2", kind: "task", label: "Use the new helper in the cart" },
  { id: "f1", kind: "file", label: "lib/price.ts" },
  { id: "f2", kind: "file", label: "app/cart/page.tsx" },
]

export default function CompactionMarkerDemo() {
  const [state, setState] = React.useState<CompactionState>("compacting")
  const [run, setRun] = React.useState(0)

  React.useEffect(() => {
    const timer = setTimeout(() => setState("compacted"), 2400)
    return () => clearTimeout(timer)
  }, [run])

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-3">
      <CompactionMarker
        state={state}
        tokensBefore={48213}
        tokensAfter={6100}
        items={ITEMS}
      />
      {state === "compacted" ? (
        <button
          type="button"
          onClick={() => {
            setState("compacting")
            setRun((count) => count + 1)
          }}
          className="cursor-pointer rounded-sm border border-transparent text-xs text-muted-foreground outline-none hover:text-foreground focus-visible:border-ring"
        >
          Compact again
        </button>
      ) : null}
    </div>
  )
}
