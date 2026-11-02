"use client"

import * as React from "react"
import { RepeatIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Markdown } from "@/registry/aiellie/components/markdown"
import { Button } from "@/registry/aiellie/ui/button"

const CITATIONS = [
  {
    url: "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries",
    title: "CSS container queries | MDN",
  },
]

const TEXT = `Size the chart from its **container**, not the page [1](${CITATIONS[0].url}):

\`\`\`css
.card { container-type: inline-size; }
.chart { width: 100cqi; }
\`\`\`

- Works in every major browser
- No JavaScript needed`

export default function MarkdownDemo() {
  const [run, setRun] = React.useState(0)

  return (
    <div className="flex w-full max-w-md flex-col items-start gap-4 px-4 text-sm">
      <Markdown key={run} revealInitial citations={CITATIONS}>
        {TEXT}
      </Markdown>
      <Button variant="outline" size="sm" onClick={() => setRun((n) => n + 1)}>
        <HugeiconsIcon aria-hidden icon={RepeatIcon} />
        Replay
      </Button>
    </div>
  )
}
