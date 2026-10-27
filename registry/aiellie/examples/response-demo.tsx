"use client"

import * as React from "react"
import { RepeatIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Response } from "@/registry/aiellie/components/response"
import { TooltipIconButton } from "@/registry/aiellie/components/tooltip-icon-button"

const REPLY = `Container queries style an element by the size of its **parent** rather than the viewport.

1. Mark the parent with \`@container\`.
2. Style children with variants like \`@md:flex-row\`.

\`\`\`tsx
<div className="@container">
  <div className="flex flex-col @md:flex-row" />
</div>
\`\`\`

> They work anywhere the parent's width can change, like a resizable panel.`

// Writes the reply out a few characters at a time, like a stream would.
function useStreamed(text: string) {
  const [run, setRun] = React.useState(0)
  const [length, setLength] = React.useState(0)

  React.useEffect(() => {
    const timer = setInterval(() => {
      setLength((current) => {
        if (current >= text.length) {
          clearInterval(timer)
          return current
        }
        return current + 4
      })
    }, 30)
    return () => clearInterval(timer)
  }, [text, run])

  const replay = () => {
    setLength(0)
    setRun((current) => current + 1)
  }

  return {
    text: text.slice(0, length),
    streaming: length < text.length,
    replay,
  }
}

export default function ResponseDemo() {
  const { text, streaming, replay } = useStreamed(REPLY)

  return (
    <div className="relative flex h-full max-h-80 w-full max-w-md flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto pe-8">
        <Response streaming={streaming}>{text}</Response>
      </div>
      <TooltipIconButton
        tooltip="Replay"
        onClick={replay}
        className="absolute end-0 top-0"
      >
        <HugeiconsIcon aria-hidden icon={RepeatIcon} />
      </TooltipIconButton>
    </div>
  )
}
