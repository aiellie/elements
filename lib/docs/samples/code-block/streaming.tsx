"use client"

import * as React from "react"

import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopy,
  CodeBlockHeader,
  CodeBlockTitle,
} from "@/registry/aiellie/components/code-block"
import { Button } from "@/registry/aiellie/ui/button"

const CODE = `export async function GET() {
  const posts = await db.post.findMany({ take: 10 })
  return Response.json(posts)
}`

export default function Streaming() {
  const [run, setRun] = React.useState(0)
  const [length, setLength] = React.useState(0)

  React.useEffect(() => {
    const timer = setInterval(() => {
      setLength((current) => {
        if (current >= CODE.length) clearInterval(timer)
        return Math.min(CODE.length, current + 3)
      })
    }, 40)
    return () => clearInterval(timer)
  }, [run])

  const code = CODE.slice(0, length)

  return (
    <div className="flex w-full max-w-md flex-col items-start gap-3">
      <CodeBlock>
        <CodeBlockHeader>
          <CodeBlockTitle>app/api/posts/route.ts</CodeBlockTitle>
          <CodeBlockActions>
            <CodeBlockCopy code={code} />
          </CodeBlockActions>
        </CodeBlockHeader>
        <CodeBlockContent
          code={code}
          language="ts"
          streaming={length < CODE.length}
        />
      </CodeBlock>
      <Button
        variant="outline"
        onClick={() => {
          setLength(0)
          setRun((count) => count + 1)
        }}
      >
        Replay
      </Button>
    </div>
  )
}
