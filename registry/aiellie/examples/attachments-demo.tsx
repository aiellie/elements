"use client"

import * as React from "react"
import { File02Icon, Folder01Icon } from "@hugeicons/core-free-icons"

import {
  AttachmentFile,
  AttachmentImage,
  Attachments,
} from "@/registry/aiellie/components/attachments"
import { Button } from "@/registry/aiellie/ui/button"

// Placeholder pictures, so the demo needs no image files.
const picture = (from: string, to: string) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><defs><linearGradient id="g" x2="1" y2="1"><stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient></defs><rect width="40" height="40" fill="url(#g)"/></svg>`
  )}`

const FILES = [
  {
    id: "mockup",
    kind: "image",
    name: "mockup.png",
    src: picture("#a5b4fc", "#f9a8d4"),
  },
  {
    id: "photo",
    kind: "image",
    name: "photo.jpg",
    src: picture("#fcd34d", "#fb7185"),
  },
  {
    id: "report",
    kind: "file",
    name: "report.pdf",
    description: "PDF · 1.2 MB",
  },
  { id: "src", kind: "folder", name: "src", description: "24 files" },
] as const

export default function AttachmentsDemo() {
  const [shown, setShown] = React.useState<string[]>(
    FILES.map((file) => file.id)
  )
  const files = FILES.filter((file) => shown.includes(file.id))
  const remove = (id: string) =>
    setShown((all) => all.filter((each) => each !== id))

  if (files.length === 0) {
    return (
      <Button
        variant="outline"
        onClick={() => setShown(FILES.map((file) => file.id))}
      >
        Bring them back
      </Button>
    )
  }

  return (
    <div className="flex w-full max-w-sm flex-col gap-4 px-4">
      <Attachments>
        {files.map((file) =>
          file.kind === "image" ? (
            <AttachmentImage
              key={file.id}
              src={file.src}
              name={file.name}
              onRemove={() => remove(file.id)}
            />
          ) : (
            <AttachmentFile
              key={file.id}
              icon={file.kind === "folder" ? Folder01Icon : File02Icon}
              name={file.name}
              description={file.description}
              onRemove={() => remove(file.id)}
            />
          )
        )}
      </Attachments>
      <Attachments size="sm">
        {files.map((file) =>
          file.kind === "image" ? (
            <AttachmentImage key={file.id} src={file.src} name={file.name} />
          ) : (
            <AttachmentFile
              key={file.id}
              icon={file.kind === "folder" ? Folder01Icon : File02Icon}
              name={file.name}
              description={file.description}
            />
          )
        )}
      </Attachments>
    </div>
  )
}
