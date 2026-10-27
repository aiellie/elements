import type { DocContent } from "@/lib/docs"

const doc: DocContent = {
  intro: [
    "Code Workspace lays out a set of files the way an editor does: a tree down the side, the open files as tabs, and the chosen file highlighted with numbered lines. It is for reading code an agent wrote or is about to change, without the weight of a real editor.",
    "Search looks through file names, file contents or both, with match case, whole word and regular expressions. Replace previews the result in every file it touches and undoes in one press. It never writes anything back, so a workspace is always safe to hand to a reader.",
  ],
  gettingStarted: {
    steps: [
      {
        title: "Give it the files",
        body: [
          "Each file is a path and its content. Folders come from the paths, so there is nothing else to describe. The language is read off the extension unless you set `language`.",
        ],
        code: {
          title: "components/project-files.tsx",
          code: `"use client"

import {
  CodeWorkspace,
  CodeWorkspacePanel,
  CodeWorkspaceSidebar,
  type CodeWorkspaceFile,
} from "@/components/aiellie/code-workspace"

const FILES: CodeWorkspaceFile[] = [
  { path: "app/page.tsx", content: "export default function Page() {}" },
  { path: "lib/price.ts", content: "export const TAX_RATE = 0.2" },
]

export function ProjectFiles() {
  return (
    <CodeWorkspace files={FILES} defaultFile="lib/price.ts">
      <CodeWorkspaceSidebar title="shop" />
      <CodeWorkspacePanel />
    </CodeWorkspace>
  )
}`,
        },
      },
      {
        title: "Size it",
        body: [
          "The workspace is 384px tall unless you give it a height. The tree and the code scroll inside it, so it needs a definite one, like `h-96` or `h-full` in a sized parent.",
        ],
      },
    ],
  },
  anatomy: {
    code: `<div data-slot="code-workspace">
  <div data-slot="code-workspace-sidebar">
    {/* title and count, or the search */}
    <div data-slot="file-tree" />
  </div>
  {/* resize handle */}
  <div data-slot="code-workspace-panel">
    {/* tabs, the open-a-file picker, actions */}
    <div data-slot="code-workspace-code" />
  </div>
</div>`,
    body: [
      "The sidebar draws its own resize handle after itself, so a workspace is always two children: the sidebar, then the panel. Drag the handle to give the tree more room.",
      "The tree is `FileTree`, so it walks with the arrow keys and opens the folders around whichever file you choose, from a tab, a search or the picker. A tab closes with its cross or a middle click, and the last one stays open.",
      "The line a text result points at is marked and centred in the pane. Line numbers stay put while a long line scrolls sideways, and they are left out when you copy.",
    ],
  },
  examples: [
    {
      title: "An action in the tab strip",
      body: [
        "`actions` sits at the end of the tab strip. A component inside it can read the workspace with `useCodeWorkspace`, here to copy the file that's open.",
      ],
      sample: "code-workspace/copy-action",
    },
    {
      title: "Search text from the start",
      body: [
        "Search opens on file names. Pass `defaultScopes` to look through contents as well, or only. With both on, files and lines are listed under their own labels.",
      ],
      code: {
        title: "components/project-files.tsx",
        code: `<CodeWorkspaceSidebar defaultScopes={["names", "contents"]} />`,
      },
    },
  ],
  api: [
    {
      title: "CodeWorkspace",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        ["`files`", "`CodeWorkspaceFile[]`", "required", ""],
        [
          "`defaultFile`",
          "`string`",
          "the first file",
          "The file open to begin with.",
        ],
        [
          "`onFileChange`",
          "`(path: string) => void`",
          "",
          "Called when another file is chosen.",
        ],
      ],
      after: ["All other `div` props are forwarded."],
    },
    {
      title: "CodeWorkspaceFile",
      head: ["Field", "Type", "Default", "Description"],
      rows: [
        ["`path`", "`string`", "required", "Split on `/` into the tree."],
        ["`content`", "`string`", "required", ""],
        [
          "`language`",
          "`string`",
          "the extension",
          "A Shiki language id, like `tsx` or `json`.",
        ],
      ],
    },
    {
      title: "CodeWorkspaceSidebar",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        ["`title`", "`ReactNode`", '`"Files"`', "Shown above the tree."],
        [
          "`defaultScopes`",
          '`("names" | "contents")[]`',
          '`["names"]`',
          "What search looks through when it first opens.",
        ],
        ["`defaultSize`", "`string`", '`"16rem"`', "A length or a percentage."],
        ["`minSize`", "`string`", '`"11rem"`', ""],
        ["`maxSize`", "`string`", '`"50%"`', ""],
      ],
      after: ["All other `div` props are forwarded."],
    },
    {
      title: "CodeWorkspacePanel",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        ["`actions`", "`ReactNode`", "", "Set at the end of the tab strip."],
      ],
      after: ["All other `div` props are forwarded."],
    },
    {
      title: "useCodeWorkspace",
      head: ["Field", "Type", "Description"],
      rows: [
        ["`activeFile`", "`string | null`", "The file being shown."],
        ["`openFiles`", "`string[]`", "The files open as tabs, in order."],
        [
          "`selectFile`",
          "`(path: string, line?: number) => void`",
          "Opens a file, and marks a line if given one.",
        ],
        ["`closeFile`", "`(path: string) => void`", ""],
        [
          "`contentOf`",
          "`(path: string) => string`",
          "What a file shows, with any replacement applied.",
        ],
        [
          "`replaced`",
          "`Record<string, string>`",
          "The files showing a replacement, by path.",
        ],
        ["`revertReplacements`", "`() => void`", ""],
      ],
    },
  ],
}

export default doc
