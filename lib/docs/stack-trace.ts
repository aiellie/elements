import type { DocContent } from "@/lib/docs"

const doc: DocContent = {
  intro: [
    "Stack Trace reads an error from the text it was printed as and shows its type and message, opening to its frames. Frames in `node_modules` and Node's own internals fold away behind one row, so the frames in your code come first. A file path can open the file, and the whole trace can be copied.",
    "It reads V8's frames (Chrome, Node) and Firefox's and Safari's, and leaves out any line it can't read.",
  ],
  gettingStarted: {
    steps: [
      {
        title: "Pass the trace",
        body: [
          "Give it `error.stack`, or a trace from a log or a tool's output.",
        ],
        code: {
          title: "components/run-error.tsx",
          code: `import {
  StackTrace,
  StackTraceCopy,
  StackTraceFrames,
  StackTraceHeader,
} from "@/components/aiellie/stack-trace"

export function RunError({ trace }: { trace: string }) {
  return (
    <StackTrace
      trace={trace}
      onOpenFile={(frame) => openInEditor(frame.file, frame.line)}
    >
      <StackTraceHeader>
        <StackTraceCopy />
      </StackTraceHeader>
      <StackTraceFrames />
    </StackTrace>
  )
}`,
        },
      },
    ],
  },
  anatomy: {
    code: `<div data-slot="stack-trace"> {/* Base UI Collapsible */}
  <div data-slot="stack-trace-header">
    <button /> {/* the type, the message and the frame count */}
    <button data-slot="stack-trace-copy" />
  </div>
  <div data-slot="stack-trace-frames">
    <ol>
      <li data-library />
    </ol>
  </div>
</div>`,
    body: [
      "The header's children sit at its end, outside the button that opens it. Frames read left to right whatever the page's direction, since they're code. `parseStackTrace` is exported too, for reading a trace without showing it.",
    ],
  },
  examples: [
    {
      title: "Show library frames",
      body: ["`showLibrary` shows every frame from the start."],
      sample: "stack-trace/library-frames",
    },
  ],
  api: [
    {
      title: "StackTrace",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        [
          "`trace`",
          "`string`",
          "required",
          "The error's text as it was printed.",
        ],
        [
          "`onOpenFile`",
          "`(frame: StackFrame) => void`",
          "",
          "Makes each of your frames' paths a button.",
        ],
      ],
      after: ["All other `Collapsible.Root` props are forwarded."],
    },
    {
      title: "StackTraceFrames",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        [
          "`showLibrary`",
          "`boolean`",
          "`false`",
          "Shows library frames from the start.",
        ],
      ],
    },
    {
      title: "StackFrame",
      head: ["Field", "Type", "Default", "Description"],
      rows: [
        ["`file`", "`string`", "required", ""],
        ["`name`", "`string`", "", "The function, when the trace names one."],
        ["`line`, `column`", "`number`", "", ""],
        [
          "`library`",
          "`boolean`",
          "required",
          "In `node_modules` or Node's internals.",
        ],
        ["`raw`", "`string`", "required", "The line it was read from."],
      ],
      after: ['`StackTraceCopy` takes a `tooltip`, `"Copy trace"` by default.'],
    },
  ],
}

export default doc
