"use client"

import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { File01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  CodeBlockCopy,
  CodeBlockDownload,
} from "@/registry/aiellie/components/code-block"
import { Button } from "@/registry/aiellie/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/registry/aiellie/ui/dialog"

function DesignMdDialog({ markdown }: { markdown: string }) {
  // The skill's frontmatter is for the agent loading it, not for a reader.
  const body = markdown.replace(/^---\n[\s\S]*?\n---\n/, "")

  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline" size="sm" />}>
        <HugeiconsIcon aria-hidden icon={File01Icon} />
        DESIGN.md
      </DialogTrigger>
      <DialogContent className="flex max-h-[calc(100dvh-2rem)] flex-col gap-0 p-0 sm:max-w-3xl">
        <DialogHeader className="flex-row items-start justify-between gap-4 border-b border-border p-4 pe-12">
          <div className="flex min-w-0 flex-col gap-1">
            <DialogTitle className="font-mono">DESIGN.md</DialogTitle>
            <DialogDescription>
              The design skill every item here is built to. Hand it to your
              agent so what it builds matches.
            </DialogDescription>
          </div>
          <div className="flex shrink-0 items-center gap-0.5">
            <CodeBlockCopy code={markdown} tooltip="Copy DESIGN.md" />
            <CodeBlockDownload
              code={markdown}
              filename="DESIGN.md"
              tooltip="Download DESIGN.md"
            />
          </div>
        </DialogHeader>
        <div className="min-h-0 overflow-y-auto overscroll-contain px-6 pt-2 pb-10">
          <div className="typeset">
            <Markdown remarkPlugins={[remarkGfm]}>{body}</Markdown>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export { DesignMdDialog }
