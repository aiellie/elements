"use client"

import * as React from "react"
import {
  Cancel01Icon,
  File02Icon,
  Folder01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  ChatAttachmentDialog,
  describe,
} from "@/registry/aiellie/blocks/chat/components/chat-attachment-dialog"
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
  AttachmentTrigger,
} from "@/registry/aiellie/ui/attachment"

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
  size = "sm",
  onRemove,
  className,
}: {
  attachments: ChatAttachment[]
  size?: "default" | "sm" | "xs"
  /** Left out where the files can no longer be taken back, as in a sent message. */
  onRemove?: (id: string) => void
  className?: string
}) {
  // Held apart from `open` so the dialog keeps its contents while it closes,
  // even after the file is removed.
  const [shown, setShown] = React.useState<ChatAttachment | null>(null)
  const [open, setOpen] = React.useState(false)

  return (
    <>
      {attachments.length > 0 ? (
        <AttachmentGroup className={className}>
          {attachments.map((attachment) => (
            <Attachment key={attachment.id} size={size}>
              <AttachmentTrigger
                onClick={() => {
                  setShown(attachment)
                  setOpen(true)
                }}
              >
                <span className="sr-only">Open {attachment.name}</span>
              </AttachmentTrigger>
              <AttachmentMedia
                variant={attachment.kind === "image" ? "image" : "icon"}
                className="text-muted-foreground"
              >
                {attachment.kind === "image" && attachment.url ? (
                  // An object URL has nothing for next/image to optimise.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={attachment.url} alt="" />
                ) : (
                  <HugeiconsIcon
                    aria-hidden
                    icon={
                      attachment.kind === "folder" ? Folder01Icon : File02Icon
                    }
                  />
                )}
              </AttachmentMedia>
              <AttachmentContent>
                <AttachmentTitle>{attachment.name}</AttachmentTitle>
                <AttachmentDescription>
                  {describe(attachment)}
                </AttachmentDescription>
              </AttachmentContent>
              {onRemove ? (
                <AttachmentActions>
                  <AttachmentAction onClick={() => onRemove(attachment.id)}>
                    <HugeiconsIcon aria-hidden icon={Cancel01Icon} />
                    <span className="sr-only">Remove {attachment.name}</span>
                  </AttachmentAction>
                </AttachmentActions>
              ) : null}
            </Attachment>
          ))}
        </AttachmentGroup>
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
