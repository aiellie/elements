import type { DocContent } from "@/lib/docs"

const doc: DocContent = {
  intro: [
    "File Tree shows the files a change touched and where they sit, which a list of paths makes the reader work out. Files are marked added, changed or removed in the same ink as a diff, and each file wears the mark of its language.",
    "It's a real tree for the keyboard: up and down walk the rows, right opens a folder and then steps into it, left closes it and then steps out, and Home and End reach the ends. The whole tree is one tab stop.",
  ],
  gettingStarted: {
    steps: [
      {
        title: "Describe the files",
        body: [
          "A node with `children` is a folder. Folders start closed unless `defaultOpen` is set.",
        ],
        code: {
          title: "components/changed-files.tsx",
          code: `"use client"

import * as React from "react"

import { FileTree, type FileNode } from "@/components/aiellie/file-tree"

const FILES: FileNode[] = [
  {
    name: "app",
    defaultOpen: true,
    children: [{ name: "page.tsx", status: "modified" }],
  },
  { name: "README.md", status: "added" },
]

export function ChangedFiles() {
  const [path, setPath] = React.useState("app/page.tsx")
  return <FileTree nodes={FILES} selected={path} onSelect={setPath} />
}`,
        },
      },
    ],
  },
  anatomy: {
    code: `<div data-slot="file-tree" role="tree">
  <button data-slot="file-tree-item" role="treeitem" data-status="added" data-selected>
    {/* twisty, folder or file mark, name, status */}
  </button>
</div>`,
    body: [
      "Rows are flat, with depth set as padding, so hover and selection span the whole width. `aria-level` and the set sizes give screen readers the nesting back.",
      "Selection is by path, like `app/page.tsx`, since most projects have more than one `page.tsx`. Which folders are open the tree keeps itself.",
    ],
  },
  examples: [
    {
      title: "Beside the code",
      body: ["Show the chosen file in a `CodeBlock`."],
      sample: "file-tree/with-code",
    },
  ],
  api: [
    {
      title: "FileTree",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        ["`nodes`", "`FileNode[]`", "required", ""],
        ["`selected`", "`string`", "", "The chosen file's path."],
        [
          "`onSelect`",
          "`(path: string) => void`",
          "",
          "Called when a file is pressed.",
        ],
        ["`aria-label`", "`string`", '`"Files"`', ""],
      ],
      after: ["All other `div` props are forwarded."],
    },
    {
      title: "FileNode",
      head: ["Field", "Type", "Default", "Description"],
      rows: [
        ["`name`", "`string`", "required", ""],
        ["`children`", "`FileNode[]`", "", "Makes it a folder."],
        ["`status`", '`"added" | "modified" | "removed"`', "", ""],
        ["`defaultOpen`", "`boolean`", "", "Opens a folder to begin with."],
      ],
    },
  ],
}

export default doc
