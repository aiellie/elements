"use client"

import * as React from "react"
import { File02Icon, Folder01Icon } from "@hugeicons/core-free-icons"

import {
  AttachmentFile,
  AttachmentImage,
  Attachments,
} from "@/registry/aiellie/components/attachments"
import {
  FilePreview,
  describe,
  type FilePreviewItem,
} from "@/registry/aiellie/components/file-preview"

// Sample files, made here so the demo needs none on disk.
const PICTURE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><defs><linearGradient id="g" x2="1" y2="1"><stop offset="0" stop-color="#a5b4fc"/><stop offset="1" stop-color="#f9a8d4"/></linearGradient></defs><rect width="400" height="300" fill="url(#g)"/></svg>`

const CODE = `export function greet(name: string) {
  return \`Hello, \${name}!\`
}
`

function folder(name: string, files: [string, string][]) {
  return files.map(([path, text]) => {
    const file = new File([text], path.split("/").pop() ?? path)
    Object.defineProperty(file, "webkitRelativePath", {
      value: `${name}/${path}`,
    })
    return file
  })
}

const ITEMS: FilePreviewItem[] = [
  {
    id: "picture",
    name: "cover.svg",
    kind: "image",
    url: `data:image/svg+xml,${encodeURIComponent(PICTURE)}`,
    size: PICTURE.length,
    files: [new File([PICTURE], "cover.svg", { type: "image/svg+xml" })],
  },
  {
    id: "code",
    name: "greet.ts",
    kind: "file",
    size: CODE.length,
    files: [new File([CODE], "greet.ts", { type: "text/plain" })],
  },
  {
    id: "folder",
    name: "src",
    kind: "folder",
    files: folder("src", [
      ["index.ts", "export * from './greet'\n"],
      ["greet.ts", CODE],
      ["styles/app.css", "body { margin: 0 }\n"],
    ]),
  },
]

export default function FilePreviewDemo() {
  const [shown, setShown] = React.useState<FilePreviewItem | null>(null)
  const [open, setOpen] = React.useState(false)

  const show = (item: FilePreviewItem) => {
    setShown(item)
    setOpen(true)
  }

  return (
    <>
      <Attachments className="px-4">
        {ITEMS.map((item) =>
          item.kind === "image" && item.url ? (
            <AttachmentImage
              key={item.id}
              src={item.url}
              name={item.name}
              onOpen={() => show(item)}
            />
          ) : (
            <AttachmentFile
              key={item.id}
              icon={item.kind === "folder" ? Folder01Icon : File02Icon}
              name={item.name}
              description={describe(item)}
              onOpen={() => show(item)}
            />
          )
        )}
      </Attachments>
      <FilePreview item={shown} open={open} onOpenChange={setOpen} />
    </>
  )
}
