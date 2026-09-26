"use client"

import * as React from "react"
import { File02Icon, Folder01Icon } from "@hugeicons/core-free-icons"

import {
  ChatAttachmentDialog,
  describe,
} from "@/registry/aiellie/blocks/chat/components/chat-attachment-dialog"
import {
  AttachmentFile,
  AttachmentImage,
  Attachments,
} from "@/registry/aiellie/components/attachments"

type ChatAttachment = {
  id: string
  name: string
  kind: "file" | "image" | "folder"
  /** In bytes. Left out for a folder. */
  size?: number
  /** A link to the file made in the browser, for an image or a PDF to show. */
  url?: string
  /** One for a file or an image, every file inside for a folder. */
  files: File[]
}

let nextId = 0

function toAttachments(files: File[]): ChatAttachment[] {
  const attachments: ChatAttachment[] = []
  const folders = new Map<string, File[]>()

  for (const file of files) {
    // Files picked as a folder carry their path, so they gather under the
    // folder they came from.
    const folder = file.webkitRelativePath.split("/")[0]
    if (folder) {
      folders.set(folder, [...(folders.get(folder) ?? []), file])
      continue
    }
    const image = file.type.startsWith("image/")
    const shown = image || file.type === "application/pdf"
    attachments.push({
      id: `attachment-${++nextId}`,
      name: file.name,
      kind: image ? "image" : "file",
      size: file.size,
      url: shown ? URL.createObjectURL(file) : undefined,
      files: [file],
    })
  }

  for (const [name, inside] of folders) {
    attachments.push({
      id: `attachment-${++nextId}`,
      name,
      kind: "folder",
      files: inside,
    })
  }

  return attachments
}

function ChatAttachments({
  attachments,
  size = "default",
  onRemove,
  className,
}: {
  attachments: ChatAttachment[]
  size?: "default" | "sm"
  /** Left out where the files can no longer be taken back, as in a sent message. */
  onRemove?: (id: string) => void
  className?: string
}) {
  // Held apart from `open` so the dialog keeps its contents while it closes,
  // even after the file is removed.
  const [shown, setShown] = React.useState<ChatAttachment | null>(null)
  const [open, setOpen] = React.useState(false)

  const show = (attachment: ChatAttachment) => {
    setShown(attachment)
    setOpen(true)
  }

  return (
    <>
      {attachments.length > 0 ? (
        <Attachments size={size} className={className}>
          {attachments.map((attachment) => {
            const remove = onRemove ? () => onRemove(attachment.id) : undefined
            return attachment.kind === "image" && attachment.url ? (
              <AttachmentImage
                key={attachment.id}
                src={attachment.url}
                name={attachment.name}
                onOpen={() => show(attachment)}
                onRemove={remove}
              />
            ) : (
              <AttachmentFile
                key={attachment.id}
                icon={attachment.kind === "folder" ? Folder01Icon : File02Icon}
                name={attachment.name}
                description={describe(attachment)}
                onOpen={() => show(attachment)}
                onRemove={remove}
              />
            )
          })}
        </Attachments>
      ) : null}
      <ChatAttachmentDialog
        attachment={shown}
        open={open}
        onOpenChange={setOpen}
        onRemove={
          onRemove && shown
            ? () => {
                onRemove(shown.id)
                setOpen(false)
              }
            : undefined
        }
      />
    </>
  )
}

export { ChatAttachments, toAttachments }
export type { ChatAttachment }
