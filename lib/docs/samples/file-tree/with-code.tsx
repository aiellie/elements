"use client"

import * as React from "react"

import {
  CodeBlock,
  CodeBlockContent,
  CodeBlockHeader,
  CodeBlockTitle,
} from "@/registry/aiellie/components/code-block"
import {
  FileTree,
  type FileNode,
} from "@/registry/aiellie/components/file-tree"

const FILES: FileNode[] = [
  {
    name: "lib",
    defaultOpen: true,
    children: [{ name: "greet.ts" }, { name: "sum.ts", status: "added" }],
  },
  { name: "README.md" },
]

const CODE: Record<string, string> = {
  "lib/greet.ts": "export const greet = (name: string) => `Hello, ${name}`",
  "lib/sum.ts": "export const sum = (a: number, b: number) => a + b",
  "README.md": "# Utilities\n\nSmall helpers.",
}

export default function WithCode() {
  const [path, setPath] = React.useState("lib/greet.ts")

  return (
    <div className="grid w-full max-w-xl gap-2 sm:grid-cols-[10rem_1fr]">
      <FileTree nodes={FILES} selected={path} onSelect={setPath} />
      <CodeBlock>
        <CodeBlockHeader>
          <CodeBlockTitle>{path}</CodeBlockTitle>
        </CodeBlockHeader>
        <CodeBlockContent
          code={CODE[path]}
          language={path.endsWith(".md") ? "md" : "ts"}
        />
      </CodeBlock>
    </div>
  )
}
