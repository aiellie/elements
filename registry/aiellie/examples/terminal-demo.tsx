"use client"

import { CommandLineIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockCopy,
  CodeBlockHeader,
  CodeBlockTitle,
} from "@/registry/aiellie/components/code-block"
import {
  TerminalCommand,
  TerminalContent,
  TerminalOutput,
  TerminalStatus,
} from "@/registry/aiellie/components/terminal"

export default function TerminalDemo() {
  return (
    <CodeBlock className="max-w-md">
      <CodeBlockHeader>
        <CodeBlockTitle
          icon={<HugeiconsIcon aria-hidden icon={CommandLineIcon} />}
        >
          Terminal
        </CodeBlockTitle>
        <CodeBlockActions>
          <CodeBlockCopy
            code={"pnpm typecheck\npnpm lint"}
            tooltip="Copy commands"
          />
        </CodeBlockActions>
      </CodeBlockHeader>
      <TerminalContent>
        <TerminalCommand>pnpm typecheck</TerminalCommand>
        <TerminalOutput>{"> tsc --noEmit"}</TerminalOutput>
        <TerminalStatus status="success" />
        <TerminalCommand>pnpm lint --max-warnings 0</TerminalCommand>
        <TerminalOutput tone="error">
          {
            "app/page.tsx\n  12:7  error  'user' is assigned a value but never used"
          }
        </TerminalOutput>
        <TerminalStatus status="error" exitCode={1} />
      </TerminalContent>
    </CodeBlock>
  )
}
