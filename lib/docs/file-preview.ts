import type { DocContent } from "@/lib/docs"

const doc: DocContent = {
  intro: [
    "File preview opens an attachment in a dialog to look at before it's sent, or after. Images and PDFs show as themselves, text and code are read in and highlighted, and a folder lists every file inside. Its footer downloads the file, zipping a folder first, and can remove it from the message.",
  ],
  gettingStarted: {
    steps: [
      {
        title: "Describe the file",
        body: [
          "A `FilePreviewItem` wraps the `File` the browser gave you. Images and PDFs need a `url` to show; make one with `URL.createObjectURL`.",
        ],
        code: {
          code: `const item: FilePreviewItem = {
  name: file.name,
  kind: file.type.startsWith("image/") ? "image" : "file",
  size: file.size,
  url: URL.createObjectURL(file),
  files: [file],
}`,
        },
      },
      {
        title: "Open it from an attachment",
        body: [
          "Keep one dialog for the whole message and change what it shows. `item` can be `null` while nothing is chosen.",
        ],
        code: {
          title: "components/composer-files.tsx",
          code: `"use client"

import * as React from "react"

import { File02Icon } from "@hugeicons/core-free-icons"

import { AttachmentFile, Attachments } from "@/components/aiellie/attachments"
import {
  FilePreview,
  describe,
  type FilePreviewItem,
} from "@/components/aiellie/file-preview"

export function ComposerFiles({
  items,
  onRemove,
}: {
  items: FilePreviewItem[]
  onRemove: (item: FilePreviewItem) => void
}) {
  const [shown, setShown] = React.useState<FilePreviewItem | null>(null)
  const [open, setOpen] = React.useState(false)

  return (
    <>
      <Attachments>
        {items.map((item) => (
          <AttachmentFile
            key={item.name}
            icon={File02Icon}
            name={item.name}
            description={describe(item)}
            onOpen={() => {
              setShown(item)
              setOpen(true)
            }}
            onRemove={() => onRemove(item)}
          />
        ))}
      </Attachments>
      <FilePreview
        item={shown}
        open={open}
        onOpenChange={setOpen}
        onRemove={() => {
          if (shown) onRemove(shown)
          setOpen(false)
        }}
      />
    </>
  )
}`,
        },
      },
    ],
  },
  anatomy: {
    code: `<div data-slot="dialog-content">
  <div data-slot="dialog-header">
    <h2 data-slot="dialog-title">{item.name}</h2>
    <p data-slot="dialog-description">{describe(item)}</p> {/* TS · 2 KB, or 3 files */}
  </div>
  {/* one of: */}
  <img /> {/* an image with a url */}
  <iframe /> {/* a PDF, or anything else with a url */}
  <pre /> {/* text and code, highlighted */}
  <ul /> {/* a folder's files, by path */}
  <div /> {/* nothing to show */}
  <div data-slot="dialog-footer">
    <button /> {/* Remove, only with onRemove */}
    <button /> {/* Close */}
    <button /> {/* Download, zipping a folder */}
  </div>
</div>`,
    body: [
      "Text is read up to the first 100 KB, with a note when there's more, and highlighted by the file's extension once the highlighter has loaded. The preview area is capped at 60% of the viewport and scrolls inside. A folder downloads as `name.zip`, built in the browser with `fflate`, keeping each file's path.",
    ],
  },
  examples: [
    {
      title: "Any file",
      body: ["Choose an image, a PDF or a text file from your computer."],
      sample: "file-preview/pick-a-file",
    },
    {
      title: "A folder",
      body: [
        "For a folder, `files` holds every file in it. A file's `webkitRelativePath` is what the list shows and what the zip keeps; an input with `webkitdirectory` fills it in.",
      ],
      code: {
        code: `<input
  type="file"
  webkitdirectory=""
  onChange={(event) => {
    const files = [...(event.target.files ?? [])]
    const name = files[0]?.webkitRelativePath.split("/")[0] ?? "folder"
    show({ name, kind: "folder", files })
  }}
/>`,
      },
    },
  ],
  api: [
    {
      title: "FilePreview",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        ["`item`", "`FilePreviewItem | null`", "required", "What to show."],
        ["`open`", "`boolean`", "required", "Whether the dialog is open."],
        [
          "`onOpenChange`",
          "`(open: boolean) => void`",
          "required",
          "Called to open or close it.",
        ],
        [
          "`onRemove`",
          "`() => void`",
          "",
          "Adds a Remove button. Left out where the file can no longer be taken back, like a message already sent.",
        ],
      ],
    },
    {
      title: "FilePreviewItem",
      head: ["Field", "Type", "Description"],
      rows: [
        [
          "`id`",
          "`string`",
          "Keeps what the preview has read apart between files. Defaults to the name.",
        ],
        ["`name`", "`string`", "The file's or the folder's name."],
        ["`kind`", '`"file" | "image" | "folder"`', "What it is."],
        ["`size`", "`number`", "In bytes. Left out for a folder."],
        [
          "`url`",
          "`string`",
          "A link to it made in the browser, for an image or a PDF to show.",
        ],
        [
          "`files`",
          "`File[]`",
          "One for a file or an image, every file inside for a folder.",
        ],
      ],
    },
    {
      title: "Helpers",
      head: ["Export", "Type", "Description"],
      rows: [
        [
          "`describe(item)`",
          "`(item: FilePreviewItem) => string`",
          "A short line about it: `TS · 2 KB`, or `3 files` for a folder.",
        ],
        [
          "`formatSize(bytes)`",
          "`(bytes: number) => string`",
          "`512 B`, `12 KB`, `1.4 MB`.",
        ],
        [
          "`isText(file)`",
          "`(file: File) => boolean`",
          "Whether a file is text the preview can read in.",
        ],
      ],
    },
  ],
}

export default doc
