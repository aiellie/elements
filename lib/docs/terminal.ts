import type { DocContent } from "@/lib/docs"

const doc: DocContent = {
  intro: [
    "Terminal shows a run rather than a line to run: the command after its prompt, coloured as shell, what it printed, and a status line saying whether it's running, finished, or failed with its exit code. It goes inside a `CodeBlock`, so the frame, title and copy work as they do for code.",
  ],
  gettingStarted: {
    steps: [
      {
        title: "Show a run",
        code: {
          title: "components/run.tsx",
          code: `import {
  CodeBlock,
  CodeBlockHeader,
  CodeBlockTitle,
} from "@/components/aiellie/code-block"
import {
  TerminalCommand,
  TerminalContent,
  TerminalOutput,
  TerminalStatus,
} from "@/components/aiellie/terminal"

export function Run({
  command,
  output,
  exitCode,
}: {
  command: string
  output: string
  exitCode: number | null
}) {
  return (
    <CodeBlock>
      <CodeBlockHeader>
        <CodeBlockTitle icon={null}>Terminal</CodeBlockTitle>
      </CodeBlockHeader>
      <TerminalContent>
        <TerminalCommand>{command}</TerminalCommand>
        <TerminalOutput tone={exitCode ? "error" : "default"}>
          {output}
        </TerminalOutput>
        <TerminalStatus
          status={exitCode === null ? "running" : exitCode ? "error" : "success"}
          exitCode={exitCode ?? undefined}
        />
      </TerminalContent>
    </CodeBlock>
  )
}`,
        },
      },
    ],
  },
  anatomy: {
    code: `<div data-slot="terminal-content" dir="ltr">
  <div data-slot="terminal-command" /> {/* $ pnpm build */}
  <pre data-slot="terminal-output" data-tone="default | error" />
  <div data-slot="terminal-status" data-status="running | success | error" />
</div>`,
    body: [
      "The prompt is left out of a selection, so a copied command pastes as a command. Several runs stack in one `TerminalContent`, each new command set a little apart from the run before.",
      "The status mark is the `Status` dot: `live` and pulsing while it runs, then success or destructive, always with a word beside it.",
    ],
  },
  examples: [
    {
      title: "While it runs",
      body: [
        "Append output as it arrives and keep the status on `running` until the command exits.",
      ],
      sample: "terminal/running",
    },
    {
      title: "Your own prompt",
      code: {
        code: `<TerminalCommand prompt="~/app ❯">pnpm dev</TerminalCommand>`,
      },
    },
  ],
  api: [
    {
      title: "TerminalCommand",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        ["`children`", "`string`", "required", "What was typed."],
        [
          "`prompt`",
          "`string`",
          '`"$"`',
          "The mark before it, left out of a copy.",
        ],
      ],
      after: ["All other `div` props are forwarded."],
    },
    {
      title: "TerminalOutput",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        [
          "`tone`",
          '`"default" | "error"`',
          '`"default"`',
          "`error` sets the output in the destructive ink.",
        ],
      ],
      after: ["All other `pre` props are forwarded."],
    },
    {
      title: "TerminalStatus",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        [
          "`status`",
          '`"running" | "success" | "error"`',
          "required",
          "Where the run is.",
        ],
        [
          "`exitCode`",
          "`number`",
          "",
          'Said after a failure, like "Exited with 1".',
        ],
        [
          "`children`",
          "`ReactNode`",
          "",
          'Words of your own in place of "Running", "Done" or the exit code.',
        ],
      ],
      after: ["All other `div` props are forwarded."],
    },
  ],
}

export default doc
