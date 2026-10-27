import type { DocContent } from "@/lib/docs"

const doc: DocContent = {
  intro: [
    "Commit shows a commit in one row: its message, who made it and when, how many lines it added and removed, and its hash to copy. It opens to the files it touched, each marked added, changed or removed in the same ink as File Tree and Code Diff.",
  ],
  gettingStarted: {
    steps: [
      {
        title: "Pass the commit",
        body: [
          "`files` goes on the root, so the header can count them and the list can show them.",
        ],
        code: {
          title: "components/agent-commit.tsx",
          code: `import {
  Commit,
  CommitFiles,
  CommitHash,
  CommitHeader,
} from "@/components/aiellie/commit"

export function AgentCommit() {
  return (
    <Commit
      files={[
        { path: "app/chart.tsx", status: "modified", additions: 6, deletions: 2 },
        { path: "app/use-width.ts", status: "added", additions: 18 },
      ]}
    >
      <CommitHeader
        message="Size the chart from its container"
        author="Ada Lovelace"
        time="42 minutes ago"
      >
        <CommitHash hash="4f2c9e1b7a03d5e8" />
      </CommitHeader>
      <CommitFiles />
    </Commit>
  )
}`,
        },
      },
    ],
  },
  anatomy: {
    code: `<div data-slot="commit"> {/* Base UI Collapsible */}
  <div data-slot="commit-header">
    <button /> {/* the author, the message and the counts */}
    <button data-slot="commit-hash" />
  </div>
  <div data-slot="commit-files">
    <ul>
      <li data-status="added" />
    </ul>
  </div>
</div>`,
    body: [
      "The header's children sit at its end, outside the button that opens it. Without an `avatar` the author's initials stand in. A commit with no `files` doesn't open.",
    ],
  },
  examples: [
    {
      title: "Open a file",
      body: ["`onOpenFile` on the list makes each path a button."],
      sample: "commit/open-files",
    },
  ],
  api: [
    {
      title: "Commit",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [["`files`", "`CommitFile[]`", "`[]`", "What it changed."]],
      after: ["All other `Collapsible.Root` props are forwarded."],
    },
    {
      title: "CommitHeader",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        ["`message`", "`ReactNode`", "required", "The subject line."],
        ["`author`", "`string`", "", ""],
        ["`avatar`", "`string`", "", "A picture of the author."],
        ["`time`", "`ReactNode`", "", "When it was made, like a `Timestamp`."],
        ["`children`", "`ReactNode`", "", "Actions at the header's end."],
      ],
    },
    {
      title: "CommitHash",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        [
          "`hash`",
          "`string`",
          "required",
          "The full hash, which is what's copied.",
        ],
        ["`length`", "`number`", "`7`", "How much of it to show."],
        ["`tooltip`", "`string`", '`"Copy hash"`', ""],
      ],
    },
    {
      title: "CommitFile",
      head: ["Field", "Type", "Default", "Description"],
      rows: [
        ["`path`", "`string`", "required", ""],
        ["`status`", '`"added" | "modified" | "removed"`', '`"modified"`', ""],
        [
          "`additions`, `deletions`",
          "`number`",
          "",
          "Lines added and removed.",
        ],
      ],
      after: ["`CommitFiles` takes `onOpenFile: (file: CommitFile) => void`."],
    },
  ],
}

export default doc
