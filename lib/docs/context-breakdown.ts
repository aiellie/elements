import type { DocContent } from "@/lib/docs"

const doc: DocContent = {
  intro: [
    "Context Breakdown shows what fills a model's context window: one bar split into its parts, like the system prompt, tools, files and the conversation, with a legend of token counts and what's left free. Hovering a row in the legend picks out its part of the bar.",
    "When a part changes, its width slides to the new size, so compacting a conversation reads as the conversation shrinking. For a single number, use [Meter](/components/meter).",
  ],
  gettingStarted: {
    steps: [
      {
        title: "Pass the parts",
        body: [
          "`max` is the model's whole window. The parts fill it in the order given, darkest first.",
        ],
        code: {
          title: "components/context.tsx",
          code: `import { ContextBreakdown } from "@/components/aiellie/context-breakdown"

export function Context({ usage }: { usage: Usage }) {
  return (
    <ContextBreakdown
      max={200_000}
      segments={[
        { key: "system", label: "System prompt", tokens: usage.system },
        { key: "tools", label: "Tools", tokens: usage.tools },
        { key: "conversation", label: "Conversation", tokens: usage.messages },
      ]}
    />
  )
}`,
        },
      },
    ],
  },
  anatomy: {
    code: `<div data-slot="context-breakdown">
  <div /> {/* the label, tokens used of the window, and the percent */}
  <div role="meter">
    <span data-dim /> {/* one per part */}
  </div>
  <ul /> {/* the legend, then what's free */}
</div>`,
    body: [
      "The bar is a `meter`, so a screen reader hears how much of the window is used. The fills are shades of `foreground`, so the parts read as one whole in both themes. `formatTokens` is exported too: 820, 46.9K, 1.2M.",
    ],
  },
  examples: [
    {
      title: "Colour a part",
      body: [
        "A part's `className` replaces its fill in the bar and the legend, like `bg-destructive` for a conversation that's about to need compacting.",
      ],
      sample: "context-breakdown/nearly-full",
    },
  ],
  api: [
    {
      title: "ContextBreakdown",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        [
          "`segments`",
          "`ContextSegment[]`",
          "required",
          "The parts, in the order they fill it.",
        ],
        ["`max`", "`number`", "required", "The whole window, in tokens."],
        ["`label`", "`ReactNode`", '`"Context"`', ""],
      ],
      after: ["All other `div` props are forwarded."],
    },
    {
      title: "ContextSegment",
      head: ["Field", "Type", "Default", "Description"],
      rows: [
        ["`key`, `label`", "`string`", "required", ""],
        ["`tokens`", "`number`", "required", ""],
        ["`className`", "`string`", "a shade of `foreground`", "Its fill."],
      ],
    },
  ],
}

export default doc
