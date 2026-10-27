"use client"

import * as React from "react"
import { File02Icon } from "@hugeicons/core-free-icons"

import {
  AttachmentFile,
  AttachmentImage,
  Attachments,
} from "@/registry/aiellie/components/attachments"
import { formatSize } from "@/registry/aiellie/components/file-preview"
import { Button } from "@/registry/aiellie/ui/button"

type Picked = { id: string; file: File; url?: string }

export default function FromInput() {
  const input = React.useRef<HTMLInputElement>(null)
  const [picked, setPicked] = React.useState<Picked[]>([])

  const remove = (id: string) =>
    setPicked((all) => {
      const gone = all.find((each) => each.id === id)
      if (gone?.url) URL.revokeObjectURL(gone.url)
      return all.filter((each) => each.id !== id)
    })

  return (
    <div className="flex w-full max-w-md flex-col items-start gap-3">
      <input
        ref={input}
        type="file"
        multiple
        hidden
        onChange={(event) => {
          const files = [...(event.target.files ?? [])]
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
          event.target.value = ""
        }}
      />
      <Button
        variant="outline"
        size="sm"
        onClick={() => input.current?.click()}
      >
        Add files
      </Button>
      {picked.length ? (
        <Attachments size="sm">
          {picked.map(({ id, file, url }) =>
            url ? (
              <AttachmentImage
                key={id}
                src={url}
                name={file.name}
                onRemove={() => remove(id)}
              />
            ) : (
              <AttachmentFile
                key={id}
                icon={File02Icon}
                name={file.name}
                description={formatSize(file.size)}
                onRemove={() => remove(id)}
              />
            )
          )}
        </Attachments>
      ) : null}
    </div>
  )
}
