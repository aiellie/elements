"use client"

import * as React from "react"
import { Copy01Icon, Tick02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  CodeWorkspace,
  CodeWorkspacePanel,
  CodeWorkspaceSidebar,
  useCodeWorkspace,
  type CodeWorkspaceFile,
} from "@/registry/aiellie/components/code-workspace"
import { TooltipIconButton } from "@/registry/aiellie/ui/tooltip-icon-button"

const FILES: CodeWorkspaceFile[] = [
  {
    path: "src/greet.ts",
    content: `export function greet(name: string) {
  return \`Hello, \${name}!\`
}
`,
  },
  {
    path: "src/index.ts",
    content: `import { greet } from "./greet"

console.log(greet("world"))
`,
  },
  {
    path: "README.md",
    content: `# greet

Says hello.
`,
  },
]

function CopyFile() {
  const { activeFile, contentOf } = useCodeWorkspace()
  const [copied, setCopied] = React.useState(false)

  React.useEffect(() => {
    if (!copied) return
    const timeout = setTimeout(() => setCopied(false), 1500)
    return () => clearTimeout(timeout)
  }, [copied])

  return (
    <TooltipIconButton
      tooltip={copied ? "Copied" : "Copy file"}
      disabled={!activeFile}
      onClick={async () => {
        if (!activeFile) return
        await navigator.clipboard.writeText(contentOf(activeFile))
        setCopied(true)
      }}
    >
      <HugeiconsIcon aria-hidden icon={copied ? Tick02Icon : Copy01Icon} />
    </TooltipIconButton>
  )
}

export default function CopyAction() {
  return (
    <CodeWorkspace files={FILES} defaultFile="src/index.ts" className="h-80">
      <CodeWorkspaceSidebar defaultSize="12rem" />
      <CodeWorkspacePanel actions={<CopyFile />} />
    </CodeWorkspace>
  )
}
