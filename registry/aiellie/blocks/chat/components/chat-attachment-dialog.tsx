"use client"

import * as React from "react"
import { Download04Icon, File02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import type { ChatAttachment } from "@/registry/aiellie/blocks/chat/components/chat-attachments"
import { Button } from "@/registry/aiellie/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/registry/aiellie/ui/dialog"

const TEXT_LIMIT = 100_000

const TEXT_EXTENSIONS = new Set(
  "c cpp css csv env go h html ini java js json jsx log md mdx py rb rs scss sh sql svg toml ts tsv tsx txt xml yaml yml".split(
    " "
  )
)

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function describe(attachment: ChatAttachment) {
  if (attachment.kind === "folder") {
    const count = attachment.files.length
    return `${count} ${count === 1 ? "file" : "files"}`
  }
  const extension = attachment.name.includes(".")
    ? attachment.name.split(".").pop()?.toUpperCase()
    : undefined
  const size = formatSize(attachment.size ?? 0)
  return extension ? `${extension} · ${size}` : size
}

function isText(file: File) {
  const extension = file.name.split(".").pop()?.toLowerCase() ?? ""
  return (
    file.type.startsWith("text/") ||
    file.type === "application/json" ||
    TEXT_EXTENSIONS.has(extension)
  )
}

function TextPreview({ file }: { file: File }) {
  const [text, setText] = React.useState<string | null>(null)

  React.useEffect(() => {
    let current = true
    void file
      .slice(0, TEXT_LIMIT)
      .text()
      .then((read) => {
        if (current) setText(read)
      })
    return () => {
      current = false
    }
  }, [file])

  return (
    <div className="flex min-h-0 flex-col gap-2">
      <pre className="max-h-[60vh] min-h-24 overflow-auto rounded-md bg-muted p-3 font-mono text-xs/5 whitespace-pre-wrap">
        {text ?? "Reading…"}
      </pre>
      {file.size > TEXT_LIMIT ? (
        <p className="text-xs text-muted-foreground">
          Showing the first {formatSize(TEXT_LIMIT)} of {formatSize(file.size)}.
        </p>
      ) : null}
    </div>
  )
}

function FolderPreview({ files }: { files: File[] }) {
  const sorted = [...files].sort((a, b) =>
    (a.webkitRelativePath || a.name).localeCompare(
      b.webkitRelativePath || b.name
    )
  )

  return (
    <ul className="max-h-[60vh] overflow-auto rounded-md border">
      {sorted.map((file, i) => (
        <li
          key={i}
          className="flex items-center justify-between gap-4 border-b px-3 py-1.5 last:border-b-0"
        >
          <span className="min-w-0 truncate font-mono text-xs">
            {file.webkitRelativePath || file.name}
          </span>
          <span className="shrink-0 text-xs text-muted-foreground">
            {formatSize(file.size)}
          </span>
        </li>
      ))}
    </ul>
  )
}

function Preview({ attachment }: { attachment: ChatAttachment }) {
  const file = attachment.files[0]

  if (attachment.kind === "folder") {
    return <FolderPreview files={attachment.files} />
  }
  if (attachment.kind === "image" && attachment.url) {
    return (
      // An object URL has nothing for next/image to optimise.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={attachment.url}
        alt={attachment.name}
        className="max-h-[60vh] w-full rounded-md bg-muted object-contain"
      />
    )
  }
  if (attachment.url) {
    return (
      <iframe
        src={attachment.url}
        title={attachment.name}
        className="h-[60vh] w-full rounded-md border bg-muted"
      />
    )
  }
  if (file && isText(file)) {
    return <TextPreview key={attachment.id} file={file} />
  }
  return (
    <div className="flex flex-col items-center gap-2 rounded-md bg-muted px-4 py-10 text-center">
      <HugeiconsIcon
        aria-hidden
        icon={File02Icon}
        className="size-6 text-muted-foreground"
      />
      <p className="text-sm text-muted-foreground">
        There&apos;s no preview for this kind of file.
      </p>
    </div>
  )
}

function download(file: File) {
  const url = URL.createObjectURL(file)
  const link = document.createElement("a")
  link.href = url
  link.download = file.name
  link.click()
  // Revoked on the next turn, once the browser has started the download.
  setTimeout(() => URL.revokeObjectURL(url))
}

function ChatAttachmentDialog({
  attachment,
  open,
  onOpenChange,
  onRemove,
}: {
  attachment: ChatAttachment | null
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Left out where the file can no longer be taken back, as in a sent message. */
  onRemove?: () => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        {attachment ? (
          <>
            <DialogHeader>
              <DialogTitle className="truncate">{attachment.name}</DialogTitle>
              <DialogDescription>{describe(attachment)}</DialogDescription>
            </DialogHeader>
            <Preview attachment={attachment} />
            <DialogFooter>
              {onRemove ? (
                <Button
                  variant="destructive"
                  onClick={onRemove}
                  className="sm:me-auto"
                >
                  Remove
                </Button>
              ) : null}
              <DialogClose render={<Button variant="outline" />}>
                Close
              </DialogClose>
              {/* A folder would need zipping first, which the browser can't do alone. */}
              {attachment.kind !== "folder" ? (
                <Button onClick={() => download(attachment.files[0])}>
                  <HugeiconsIcon aria-hidden icon={Download04Icon} />
                  Download
                </Button>
              ) : null}
            </DialogFooter>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}

export { ChatAttachmentDialog, describe, formatSize }
