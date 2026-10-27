"use client"

import * as React from "react"
import Link from "next/link"
import { SquareArrowExpand01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { CodeBlock } from "@/components/docs/code-block"
import { Tabs, TabsList, TabsTrigger } from "@/registry/aiellie/ui/tabs"
import { Button } from "@/registry/aiellie/ui/button"

function DemoFigure({
  name,
  file,
  html,
  code,
  children,
}: {
  name: string
  /** Where the component's file installs, shown above its source. */
  file: string
  /** The component's source, highlighted. */
  html: string
  code: string
  children: React.ReactNode
}) {
  const [tab, setTab] = React.useState("preview")

  return (
    <figure data-slot="demo-figure" className="mt-10 flex flex-col gap-2">
      <Tabs value={tab} onValueChange={setTab} className="self-end">
        <TabsList aria-label="Show">
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
        </TabsList>
      </Tabs>
      {/* Hidden rather than unmounted, so the demo keeps its state across a
          look at the code. */}
      <div
        hidden={tab !== "preview"}
        className="relative flex h-[360px] items-center justify-center overflow-hidden rounded-xl border border-foreground/10 p-5 md:p-6"
      >
        <div className="flex h-full min-h-0 w-full items-center justify-center">
          {children}
        </div>
        <Button
          variant="ghost"
          size="icon-sm"
          nativeButton={false}
          render={<Link href={`/demo/${name}`} />}
          className="absolute end-2 top-2 text-muted-foreground"
        >
          <HugeiconsIcon aria-hidden icon={SquareArrowExpand01Icon} />
          <span className="sr-only">Open full screen</span>
        </Button>
      </div>
      {tab === "code" ? (
        <CodeBlock
          html={html}
          code={code}
          title={file}
          className="flex h-[360px] flex-col [&>div:nth-child(2)]:min-h-0 [&>div:nth-child(2)]:flex-1 [&>div:nth-child(2)]:overflow-y-auto"
        />
      ) : null}
      <figcaption className="mt-0.5 text-caption text-muted-foreground">
        {tab === "preview"
          ? "fig. 01 · open it full screen from the corner"
          : "fig. 01 · the file the registry installs"}
      </figcaption>
    </figure>
  )
}

export { DemoFigure }
