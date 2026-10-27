"use client"

import * as React from "react"

import {
  FilePreview,
  describe,
  type FilePreviewItem,
} from "@/registry/aiellie/components/file-preview"
import { Button } from "@/registry/aiellie/ui/button"

function toItem(file: File): FilePreviewItem {
  const image = file.type.startsWith("image/")
  const pdf = file.type === "application/pdf"
  return {
    name: file.name,
    kind: image ? "image" : "file",
    size: file.size,
    url: image || pdf ? URL.createObjectURL(file) : undefined,
    files: [file],
  }
}

export default function PickAFile() {
  const input = React.useRef<HTMLInputElement>(null)
  const [item, setItem] = React.useState<FilePreviewItem | null>(null)
  const [open, setOpen] = React.useState(false)

  return (
    <div className="flex flex-col items-center gap-2">
      <input
        ref={input}
        type="file"
        hidden
        onChange={(event) => {
          const file = event.target.files?.[0]
          if (!file) return
          setItem(toItem(file))
          setOpen(true)
          event.target.value = ""
        }}
      />
      <Button
        variant="outline"
        size="sm"
        onClick={() => input.current?.click()}
      >
        Choose a file to preview
      </Button>
      {item ? (
        <span className="text-xs text-muted-foreground">
          {item.name} · {describe(item)}
        </span>
      ) : null}
      <FilePreview
        item={item}
        open={open}
        onOpenChange={setOpen}
        onRemove={() => {
          setItem(null)
          setOpen(false)
        }}
      />
    </div>
  )
}
