"use client"

import * as React from "react"
import { Download04Icon, File02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { zip } from "fflate"

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
import { cn } from "@/lib/utils"

const TEXT_LIMIT = 100_000

// Shiki's name for a file's language, where it isn't the extension itself.
// Null leaves the file plain.
const LANGUAGES: Record<string, string | null> = {
  env: "dotenv",
  h: "c",
  svg: "xml",
  txt: null,
}

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

function languageOf(name: string) {
  const extension = name.includes(".")
    ? name.split(".").pop()?.toLowerCase()
    : undefined
  if (!extension) return null
  return extension in LANGUAGES ? LANGUAGES[extension] : extension
}

const codeBox =
  "max-h-[60vh] min-h-24 overflow-auto rounded-md bg-muted font-mono text-xs/5"

function TextPreview({ file }: { file: File }) {
  const [text, setText] = React.useState<string | null>(null)
  const [html, setHtml] = React.useState<string | null>(null)

  React.useEffect(() => {
    let current = true
    const language = languageOf(file.name)
    void file
      .slice(0, TEXT_LIMIT)
      .text()
      .then(async (read) => {
        if (!current) return
        setText(read)
        if (!language) return
        try {
          // Loaded on first use, so Shiki stays out of the page until a file
          // is opened.
          const { highlightCode } =
            await import("@/registry/aiellie/lib/highlight-code")
          const highlighted = await highlightCode(read, language)
          if (current) setHtml(highlighted)
        } catch {
          // A language Shiki doesn't know stays plain.
        }
      })
    return () => {
      current = false
    }
  }, [file])

  return (
    <div className="flex min-h-0 flex-col gap-2">
      {html ? (
        <div
          // Shiki escapes the code, so the markup holds nothing from the file
          // but text.
          dangerouslySetInnerHTML={{ __html: html }}
          className={cn(
            codeBox,
            "[&_pre]:overflow-visible! [&_pre]:p-3! [&_pre]:whitespace-pre-wrap dark:[&_span]:text-(color:--shiki-dark)!"
          )}
        />
      ) : (
        <pre className={cn(codeBox, "p-3 whitespace-pre-wrap")}>
          {text ?? "Reading…"}
        </pre>
      )}
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

function save(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = name
  link.click()
  // Revoked on the next turn, once the browser has started the download.
  setTimeout(() => URL.revokeObjectURL(url))
}

async function zipFolder(attachment: ChatAttachment) {
  const entries = Object.fromEntries(
    await Promise.all(
      attachment.files.map(async (file) => [
        file.webkitRelativePath || `${attachment.name}/${file.name}`,
        new Uint8Array(await file.arrayBuffer()),
      ])
    )
  )
  const data = await new Promise<Uint8Array>((resolve, reject) =>
    zip(entries, (error, zipped) => (error ? reject(error) : resolve(zipped)))
  )
  return new Blob([data as Uint8Array<ArrayBuffer>], {
    type: "application/zip",
  })
}

function DownloadButton({ attachment }: { attachment: ChatAttachment }) {
  const [zipping, setZipping] = React.useState(false)

  const download = async () => {
    if (attachment.kind !== "folder") {
      save(attachment.files[0], attachment.name)
      return
    }
    setZipping(true)
    try {
      save(await zipFolder(attachment), `${attachment.name}.zip`)
    } finally {
      setZipping(false)
    }
  }

  return (
    <Button onClick={download} disabled={zipping}>
      <HugeiconsIcon aria-hidden icon={Download04Icon} />
      {zipping ? "Zipping…" : "Download"}
    </Button>
  )
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
              <DownloadButton key={attachment.id} attachment={attachment} />
            </DialogFooter>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}

export { ChatAttachmentDialog, describe, formatSize, isText }
