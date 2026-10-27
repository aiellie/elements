import type { DocContent } from "@/lib/docs"

const doc: DocContent = {
  intro: [
    "Code Diff shows what a change did, read straight from the unified diff that `git diff` or an agent's edit tool writes. Added and removed lines are tinted and marked, both sides of the change are numbered, and each hunk keeps its header. `CodeDiffStat` counts the lines for the header.",
    "It goes inside a `CodeBlock`, so a diff has the same frame, title and actions as any other code.",
  ],
  gettingStarted: {
    steps: [
      {
        title: "Install the code block too",
        body: [
          "The diff installs `code-block` with it, for its frame and its colouring.",
        ],
      },
      {
        title: "Show a diff",
        code: {
          title: "components/change.tsx",
          code: `import {
  CodeBlock,
  CodeBlockHeader,
  CodeBlockTitle,
} from "@/components/aiellie/code-block"
import { CodeDiffContent, CodeDiffStat } from "@/components/aiellie/code-diff"

export function Change({ file, diff }: { file: string; diff: string }) {
  return (
    <CodeBlock>
      <CodeBlockHeader>
        <CodeBlockTitle>{file}</CodeBlockTitle>
        <CodeDiffStat diff={diff} className="ms-auto" />
      </CodeBlockHeader>
      <CodeDiffContent diff={diff} language="ts" />
    </CodeBlock>
  )
}`,
        },
        after: [
          "Lines before the first hunk, like `diff --git` and the `---` and `+++` names, are left out, since the header already names the file.",
        ],
      },
    ],
  },
  anatomy: {
    code: `<pre data-slot="code-diff-content" dir="ltr">
  <span data-slot="code-diff-hunk" /> {/* @@ -1,8 +1,9 @@ */}
  <span data-slot="code-diff-line" data-kind="context | added | removed" />
</pre>
<span data-slot="code-diff-stat" /> {/* +3 −2 */}`,
    body: [
      'Each line\'s gutter holds its old number, its new number and a + or −, and stays put while the code scrolls. A screen reader hears "Added" or "Removed" before a changed line, so the change doesn\'t rest on colour alone.',
      "The tints are mixed into the ground rather than laid over it, so the pinned gutter can share its line's colour. Added lines use emerald, since a shadcn theme has no success colour.",
    ],
  },
  examples: [
    {
      title: "A new file",
      body: [
        "A diff against `/dev/null` is all additions. Leave out `lineNumbers` when the numbers say nothing, and leave out `language` to keep the lines plain.",
      ],
      sample: "code-diff/new-file",
    },
    {
      title: "Count what changed",
      body: [
        "`diffStat` gives the same counts as numbers, for a summary of several files.",
      ],
      code: {
        code: `import { diffStat } from "@/components/aiellie/code-diff"

const { added, removed } = diffStat(diff)`,
      },
    },
  ],
  api: [
    {
      title: "CodeDiffContent",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        ["`diff`", "`string`", "required", "A unified diff."],
        [
          "`language`",
          "`string`",
          "",
          "Any language Shiki knows. Left out, the lines stay plain.",
        ],
        [
          "`lineNumbers`",
          "`boolean`",
          "`true`",
          "Numbers both sides of each line.",
        ],
      ],
      after: ["All other `pre` props are forwarded."],
    },
    {
      title: "CodeDiffStat",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [["`diff`", "`string`", "required", "The diff to count."]],
      after: ["All other `span` props are forwarded."],
    },
    {
      title: "parseDiff",
      head: ["Argument", "Type", "Default", "Description"],
      rows: [["`diff`", "`string`", "required", "A unified diff."]],
      after: [
        "Returns its rows as `DiffLine`s: hunk headers, and context, added and removed lines with their numbers.",
      ],
    },
  ],
}

export default doc
