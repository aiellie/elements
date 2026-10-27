import type { DocContent } from "@/lib/docs"

const doc: DocContent = {
  intro: [
    "Code Snippet shows a command to copy, with tabs for npm, pnpm, yarn and bun. You write the command once, like `shadcn@latest add button`, and each tab puts its own runner in front: `npx`, `pnpm dlx`, `yarn dlx` or `bunx`. The copy button copies the line on the open tab.",
    "The line is highlighted as shell and scrolls rather than wraps, so a long command stays one line to paste.",
  ],
  gettingStarted: {
    steps: [
      {
        title: "Give it the command",
        code: {
          title: "app/install.tsx",
          code: `import { CodeSnippet } from "@/components/aiellie/code-snippet"

export function Install() {
  return <CodeSnippet command="shadcn@latest add button" />
}`,
        },
      },
      {
        title: "Remember the reader's manager",
        body: [
          "Pass `manager` and `onManagerChange` to keep the tab, so every snippet on the page agrees.",
        ],
        code: {
          title: "app/install.tsx",
          code: `const [manager, setManager] = React.useState<PackageManager>("pnpm")

<CodeSnippet
  command="shadcn@latest add button"
  manager={manager}
  onManagerChange={setManager}
/>`,
        },
      },
    ],
  },
  anatomy: {
    code: `<div data-slot="code-snippet">
  <div> {/* header */}
    <div role="tablist">{/* a tab per manager */}</div>
    <button data-slot="code-block-copy" />
  </div>
  <div role="tabpanel">
    <span>$</span>
    <code />
  </div>
</div>`,
    body: [
      "The tabs are Base UI's, so the arrow keys move between them. The highlighting and the copy button come from `code-block`.",
    ],
  },
  examples: [
    {
      title: "Without tabs",
      body: [
        "Pass `managers={[]}` for a command that isn't run through a package manager. The copy button moves onto the line.",
      ],
      sample: "code-snippet/no-tabs",
    },
  ],
  api: [
    {
      title: "CodeSnippet",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        [
          "`command`",
          "`string`",
          "required",
          "What follows the runner. With no tabs, the whole line.",
        ],
        [
          "`managers`",
          "`PackageManager[]`",
          '`["npm", "pnpm", "yarn", "bun"]`',
          "The tabs. `[]` for none.",
        ],
        ["`manager`", "`PackageManager`", "", "The open tab, to control it."],
        ["`defaultManager`", "`PackageManager`", "the first", ""],
        ["`onManagerChange`", "`(manager: PackageManager) => void`", "", ""],
      ],
      after: [
        "All other `div` props are forwarded. `runWith(manager, command)` gives the full line, for copying it elsewhere.",
      ],
    },
  ],
}

export default doc
