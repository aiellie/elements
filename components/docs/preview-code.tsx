"use client"

import * as React from "react"

import { CodeBlock } from "@/components/docs/code-block"
import { Tabs, TabsList, TabsTrigger } from "@/registry/aiellie/ui/tabs"

function PreviewCode({
  html,
  code,
  children,
}: {
  /** The sample's source, highlighted. */
  html: string
  code: string
  children: React.ReactNode
}) {
  const [tab, setTab] = React.useState("preview")

  return (
    <div data-slot="preview-code" className="flex flex-col gap-2">
      <Tabs value={tab} onValueChange={setTab} className="self-end">
        <TabsList aria-label="Show">
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
        </TabsList>
      </Tabs>
      {tab === "preview" ? (
        <div className="relative flex min-h-48 items-center justify-center overflow-hidden rounded-xl border border-foreground/10 p-6">
          <div className="flex w-full justify-center">{children}</div>
        </div>
      ) : (
        <CodeBlock
          html={html}
          code={code}
          className="[&>div:first-child]:max-h-96"
        />
      )}
    </div>
  )
}

export { PreviewCode }
