import type { DocContent } from "@/lib/docs"

const doc: DocContent = {
  intro: [
    "Tool Call shows a tool the model called as one quiet row: what it called, the one detail worth reading, like the query, and whether it's queued, waiting on approval, running, done or failed. The row opens to show what went in and what came back. A call that needs approval asks for it under the row.",
  ],
  gettingStarted: {
    steps: [
      {
        title: "Show a call",
        code: {
          title: "components/search-call.tsx",
          code: `import { Globe02Icon } from "@hugeicons/core-free-icons"

import {
  ToolCall,
  ToolCallCode,
  ToolCallContent,
  ToolCallSection,
  ToolCallTrigger,
} from "@/components/aiellie/tool-call"

export function SearchCall({ query, results }: { query: string; results: unknown }) {
  return (
    <ToolCall status="done">
      <ToolCallTrigger icon={Globe02Icon} name="Searched the web" summary={query} />
      <ToolCallContent>
        <ToolCallSection title="Output">
          <ToolCallCode value={results} />
        </ToolCallSection>
      </ToolCallContent>
    </ToolCall>
  )
}`,
        },
      },
      {
        title: "Map the AI SDK's tool parts",
        body: [
          "A tool part's `state` maps onto `status`. `ToolCallCode` shows a string as it is and anything else as JSON.",
        ],
        code: {
          code: `import { getToolOrDynamicToolName, isToolUIPart } from "ai"

const STATUS = {
  "input-streaming": "pending",
  "input-available": "running",
  "approval-requested": "awaiting",
  "approval-responded": "running",
  "output-available": "done",
  "output-error": "error",
  "output-denied": "error",
} as const

{message.parts.filter(isToolUIPart).map((part) => (
  <ToolCall key={part.toolCallId} status={STATUS[part.state] ?? "done"}>
    <ToolCallTrigger name={getToolOrDynamicToolName(part)} />
    <ToolCallContent>
      <ToolCallSection title="Input">
        <ToolCallCode value={part.input} />
      </ToolCallSection>
      {part.output ? (
        <ToolCallSection title="Output">
          <ToolCallCode value={part.output} />
        </ToolCallSection>
      ) : null}
    </ToolCallContent>
  </ToolCall>
))}`,
        },
      },
    ],
  },
  anatomy: {
    code: `<div data-slot="tool-call" data-status="pending | awaiting | running | done | error">
  <button data-slot="tool-call-trigger" /> {/* icon, name, summary, status, chevron */}
  <div data-slot="tool-call-approval" /> {/* optional, Deny and Allow */}
  <div data-slot="tool-call-content">
    <section data-slot="tool-call-section">
      <h4 /> <pre data-slot="tool-call-code" />
    </section>
  </div>
</div>`,
    body: [
      "It's a Base UI collapsible, so `open`, `defaultOpen` and `onOpenChange` work as they do there. The panel folds at 280 ms and sits beside a hairline on the start side, like the thoughts in `Reasoning`.",
      "While it runs the name shimmers and a pulsing `live` dot follows it. Done is a tick; failed is a destructive mark with the word Failed; waiting says Needs approval. The status is read out after the name, so it never rests on the mark alone.",
    ],
  },
  examples: [
    {
      title: "A call that failed",
      body: ["Show what went wrong in a section of its own."],
      sample: "tool-call/failed",
    },
    {
      title: "Ask before it runs",
      body: [
        "Put `ToolCallApproval` under the trigger while the call is `awaiting`, and move the status on when the person answers.",
      ],
      code: {
        code: `<ToolCall status={status}>
  <ToolCallTrigger name="Run" summary="pnpm test" />
  {status === "awaiting" ? (
    <ToolCallApproval
      onApprove={() => approve(call.id)}
      onDeny={() => deny(call.id)}
    />
  ) : null}
</ToolCall>`,
      },
    },
    {
      title: "Your own words",
      body: ["`labels` renames any status."],
      code: {
        code: `<ToolCallTrigger name="Deploy" labels={{ awaiting: "Waiting for you" }} />`,
      },
    },
  ],
  api: [
    {
      title: "ToolCall",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        [
          "`status`",
          '`"pending" | "awaiting" | "running" | "done" | "error"`',
          '`"done"`',
          "Where the call is.",
        ],
      ],
      after: ["All other Base UI `Collapsible.Root` props are forwarded."],
    },
    {
      title: "ToolCallTrigger",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        ["`name`", "`ReactNode`", "required", "What was called."],
        [
          "`summary`",
          "`ReactNode`",
          "",
          "The one detail worth reading without opening it.",
        ],
        ["`icon`", "`IconSvgElement`", "a wrench", "A Hugeicons glyph."],
        [
          "`labels`",
          "`Partial<Record<ToolCallStatus, string>>`",
          "",
          "Words of your own for each status.",
        ],
      ],
    },
    {
      title: "ToolCallSection",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        ["`title`", "`ReactNode`", "required", 'Like "Input" or "Output".'],
      ],
    },
    {
      title: "ToolCallCode",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        [
          "`value`",
          "`unknown`",
          "required",
          "A string shows as it is; anything else as JSON.",
        ],
      ],
    },
    {
      title: "ToolCallApproval",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        ["`onApprove`", "`() => void`", "required", ""],
        ["`onDeny`", "`() => void`", "required", ""],
        ["`approveLabel`", "`string`", '`"Allow"`', ""],
        ["`denyLabel`", "`string`", '`"Deny"`', ""],
        [
          "`children`",
          "`ReactNode`",
          '`"Allow this tool to run?"`',
          "The question.",
        ],
      ],
    },
  ],
}

export default doc
