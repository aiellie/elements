"use client"

import * as React from "react"
import { CommandLineIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  CodeBlock,
  CodeBlockHeader,
  CodeBlockTitle,
} from "@/registry/aiellie/components/code-block"
import {
  TerminalCommand,
  TerminalContent,
  TerminalOutput,
  TerminalStatus,
} from "@/registry/aiellie/components/terminal"
import { Button } from "@/registry/aiellie/ui/button"

const LINES = [
  "✓ lib/format.test.ts (4 tests)",
  "✓ lib/models.test.ts (12 tests)",
  "✓ components/composer.test.tsx (9 tests)",
  "Test Files  3 passed (3)",
]

export default function Running() {
  const [run, setRun] = React.useState(0)
  const [shown, setShown] = React.useState(0)

  React.useEffect(() => {
    const timer = setInterval(() => {
      setShown((count) => {
        if (count >= LINES.length) clearInterval(timer)
        return Math.min(LINES.length, count + 1)
      })
    }, 700)
    return () => clearInterval(timer)
  }, [run])

  return (
    <div className="flex w-full max-w-md flex-col items-start gap-3">
      <CodeBlock>
        <CodeBlockHeader>
          <CodeBlockTitle
            icon={<HugeiconsIcon aria-hidden icon={CommandLineIcon} />}
          >
            Terminal
          </CodeBlockTitle>
        </CodeBlockHeader>
        <TerminalContent className="min-h-40">
          <TerminalCommand>pnpm vitest run</TerminalCommand>
          {shown > 0 ? (
            <TerminalOutput>{LINES.slice(0, shown).join("\n")}</TerminalOutput>
          ) : null}
          <TerminalStatus
            status={shown < LINES.length ? "running" : "success"}
          />
        </TerminalContent>
      </CodeBlock>
      <Button
        variant="outline"
        onClick={() => {
          setShown(0)
          setRun((count) => count + 1)
        }}
      >
        Run again
      </Button>
    </div>
  )
}
