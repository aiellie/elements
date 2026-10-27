"use client"

import * as React from "react"
import { File02Icon } from "@hugeicons/core-free-icons"

import {
  AttachmentFile,
  AttachmentImage,
  Attachments,
} from "@/registry/aiellie/components/attachments"
import {
  Composer,
  ComposerFooter,
  ComposerHeader,
  ComposerInput,
  ComposerSubmit,
} from "@/registry/aiellie/components/composer"
import { formatSize } from "@/registry/aiellie/components/file-preview"

type Picked = { id: string; file: File; url?: string }

export default function DropFiles() {
  const [picked, setPicked] = React.useState<Picked[]>([])

  const add = (files: File[]) =>
    setPicked((all) => [
      ...all,
      ...files.map((file) => ({
        id: crypto.randomUUID(),
        file,
        url: file.type.startsWith("image/")
          ? URL.createObjectURL(file)
          : undefined,
      })),
    ])

  const clear = () =>
    setPicked((all) => {
      all.forEach((each) => each.url && URL.revokeObjectURL(each.url))
      return []
    })

  return (
    <div className="w-full max-w-md">
      <ComposerHeader open={picked.length > 0}>
        <Attachments size="sm">
          {picked.map(({ id, file, url }) =>
            url ? (
              <AttachmentImage
                key={id}
                src={url}
                name={file.name}
                onRemove={() =>
                  setPicked((all) => all.filter((each) => each.id !== id))
                }
              />
            ) : (
              <AttachmentFile
                key={id}
                icon={File02Icon}
                name={file.name}
                description={formatSize(file.size)}
                onRemove={() =>
                  setPicked((all) => all.filter((each) => each.id !== id))
                }
              />
            )
          )}
        </Attachments>
      </ComposerHeader>
      <Composer
        hasAttachments={picked.length > 0}
        onFilesAdd={add}
        onSubmit={clear}
      >
        <ComposerInput placeholder="Drop or paste a file here" />
        <ComposerFooter>
          <ComposerSubmit />
        </ComposerFooter>
      </Composer>
    </div>
  )
}
