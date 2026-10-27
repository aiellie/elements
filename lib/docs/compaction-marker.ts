import type { DocContent } from "@/lib/docs"

const doc: DocContent = {
  intro: [
    'Compaction Marker is the line across a thread where an agent summarised its context to make room. While it works, a live segment sweeps along the line, or fills it if you pass `progress`. Once it\'s done it reads "Context compacted 48.2k → 6.1k", counting down if you watched it finish.',
    "Pressing it opens what the summary kept: decisions, tasks and files, with finished tasks struck through so they don't come back as new work. You can leave items out of the next turn. If compacting fails, it says the full history was kept and can offer a retry.",
  ],
  gettingStarted: {
    steps: [
      {
        title: "Put it in the thread",
        code: {
          title: "components/compaction.tsx",
          code: `import {
  CompactionMarker,
  type CompactionItem,
} from "@/components/aiellie/compaction-marker"

export function Compaction({
  done,
  before,
  after,
  items,
}: {
  done: boolean
  before: number
  after: number
  items: CompactionItem[]
}) {
  return (
    <CompactionMarker
      state={done ? "compacted" : "compacting"}
      tokensBefore={before}
      tokensAfter={after}
      items={items}
    />
  )
}`,
        },
      },
      {
        title: "Leave items out",
        body: [
          "`onDroppedChange` gives the ids someone left out. Strip them from the summary before the next turn.",
        ],
        code: {
          title: "components/compaction.tsx",
          code: `<CompactionMarker
  state="compacted"
  tokensBefore={before}
  tokensAfter={after}
  items={items}
  dropped={dropped}
  onDroppedChange={setDropped}
/>`,
        },
      },
    ],
  },
  anatomy: {
    code: `<div data-slot="compaction-marker" data-state="compacted" role="group">
  {/* rule, then the label or the trigger, then a rule */}
  <button data-slot="compaction-marker-trigger" aria-expanded />
  <div data-slot="compaction-marker-panel" data-open>
    {/* kept of total, a bar, then the items by group */}
  </div>
</div>`,
    body: [
      "Each state is read out once as it changes. The panel slides open, and is inert while closed so its buttons can't be reached.",
      "`formatTokens` is exported too: 48213 becomes 48.2k.",
    ],
  },
  examples: [
    {
      title: "Failed, with retry",
      body: ["Press Retry to watch it fill with `progress` and finish."],
      sample: "compaction-marker/failed",
    },
  ],
  api: [
    {
      title: "CompactionMarker",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        ["`state`", '`"compacting" | "compacted" | "failed"`', "required", ""],
        ["`tokensBefore`", "`number`", "required", ""],
        ["`tokensAfter`", "`number`", "", "Needed once compacted."],
        ["`items`", "`CompactionItem[]`", "`[]`", "What the summary kept."],
        [
          "`progress`",
          "`number`",
          "",
          "From 0 to 1. Left out, the line sweeps.",
        ],
        [
          "`dropped`, `defaultDropped`, `onDroppedChange`",
          "`string[]`",
          "",
          "The ids left out of the next turn.",
        ],
        ["`open`, `defaultOpen`, `onOpenChange`", "`boolean`", "`false`", ""],
        ["`onRetry`", "`() => void`", "", "Adds Retry when failed."],
        ["`readOnly`", "`boolean`", "`false`", "Hides the drop buttons."],
      ],
      after: ["All other `div` props are forwarded."],
    },
    {
      title: "CompactionItem",
      head: ["Field", "Type", "Default", "Description"],
      rows: [
        ["`id`", "`string`", "required", ""],
        ["`kind`", '`"decision" | "task" | "file"`', "required", ""],
        ["`label`", "`string`", "required", ""],
        ["`done`", "`boolean`", "", "A finished task, shown struck through."],
      ],
    },
  ],
}

export default doc
