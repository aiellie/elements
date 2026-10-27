"use client"

import * as React from "react"

import {
  FileTree,
  type FileNode,
} from "@/registry/aiellie/components/file-tree"

const FILES: FileNode[] = [
  {
    name: "app",
    defaultOpen: true,
    children: [
      { name: "layout.tsx" },
      { name: "page.tsx", status: "modified" },
      {
        name: "settings",
        defaultOpen: true,
        children: [{ name: "page.tsx", status: "added" }],
      },
    ],
  },
  {
    name: "lib",
    children: [{ name: "format.ts", status: "modified" }, { name: "utils.ts" }],
  },
  { name: "legacy.js", status: "removed" },
  { name: "package.json", status: "modified" },
]

export default function FileTreeDemo() {
  const [selected, setSelected] = React.useState("app/page.tsx")

  return (
    <FileTree
      nodes={FILES}
      selected={selected}
      onSelect={setSelected}
      className="max-h-72 max-w-xs"
    />
  )
}
