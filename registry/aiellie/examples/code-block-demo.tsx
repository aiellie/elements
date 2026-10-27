"use client"

import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopy,
  CodeBlockDownload,
  CodeBlockHeader,
  CodeBlockTitle,
} from "@/registry/aiellie/components/code-block"

const CODE = `import * as React from "react"

export function useCopied(timeout = 1500) {
  const [copied, setCopied] = React.useState(false)

  React.useEffect(() => {
    if (!copied) return
    const id = setTimeout(() => setCopied(false), timeout)
    return () => clearTimeout(id)
  }, [copied, timeout])

  return [copied, setCopied] as const
}`

export default function CodeBlockDemo() {
  return (
    <CodeBlock className="max-w-md">
      <CodeBlockHeader>
        <CodeBlockTitle>use-copied.ts</CodeBlockTitle>
        <CodeBlockActions>
          <CodeBlockDownload code={CODE} filename="use-copied.ts" />
          <CodeBlockCopy code={CODE} />
        </CodeBlockActions>
      </CodeBlockHeader>
      <CodeBlockContent
        code={CODE}
        language="ts"
        lineNumbers
        highlightLines={[7, 8]}
        className="max-h-60"
      />
    </CodeBlock>
  )
}
