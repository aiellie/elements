import type { DocContent } from "@/lib/docs"

const doc: DocContent = {
  intro: [
    "Agent Cursor is a document you and an agent edit at the same time. The paragraph the agent is rewriting gets a live edge, and its draft streams in underneath with a caret. Once it's done you replace the paragraph or discard the draft. Nothing changes until you choose.",
    "If you edit that paragraph while the agent works on it, the two versions clash. It says so, tells your app once so it can pause the agent, and offers Keep yours, Use the agent's, or Merge, which asks the agent to start again from your text.",
  ],
  gettingStarted: {
    steps: [
      {
        title: "Hold the document and the rewrite",
        body: [
          "Pass the paragraphs, the id the agent is rewriting, and its draft as it streams.",
        ],
        code: {
          title: "components/doc.tsx",
          code: `import { AgentCursor, type DocBlock } from "@/components/aiellie/agent-cursor"

export function Doc({ rewrite }: { rewrite: Rewrite }) {
  const [blocks, setBlocks] = useState<DocBlock[]>(initial)

  return (
    <AgentCursor
      title="Team update"
      blocks={blocks}
      onBlocksChange={setBlocks}
      target={rewrite.blockId}
      draft={rewrite.text}
      writing={rewrite.streaming}
      onConflict={() => rewrite.pause()}
      onKeepYours={rewrite.cancel}
      onUseAgent={(text) => apply(rewrite.blockId, text)}
      onMerge={(yours) => rewrite.restartFrom(yours)}
    />
  )
}`,
        },
      },
    ],
  },
  anatomy: {
    code: `<div data-slot="agent-cursor" data-state="writing">
  <div data-slot="agent-cursor-header" />
  <textarea data-slot="agent-cursor-block" />   {/* one per paragraph */}
  <div data-slot="agent-cursor-rewrite">
    <span data-slot="agent-cursor-caret" />     {/* while writing */}
  </div>
</div>`,
    body: [
      'The state comes from the props: `writing` while it streams, `ready` once a draft is there, and `conflict` once the held paragraph no longer matches what the agent started from. Leave out `base` and it reads that text as each rewrite starts, so setting `draft` back to "" for a merge starts from your edit.',
      "Each state is read out once, and the held paragraph points at that message.",
    ],
  },
  examples: [
    {
      title: "A draft to review",
      body: [
        "Without `writing`, a draft shows straight away with Replace and Discard.",
      ],
      sample: "agent-cursor/review",
    },
  ],
  api: [
    {
      title: "AgentCursor",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        ["`title`", "`string`", '`"Untitled"`', ""],
        [
          "`blocks`",
          "`{ id: string; text: string }[]`",
          "required",
          "One per paragraph.",
        ],
        [
          "`onBlocksChange`",
          "`(blocks: DocBlock[]) => void`",
          "",
          "Left out, the document is read-only.",
        ],
        ["`agentName`", "`string`", '`"Assistant"`', ""],
        ["`target`", "`string`", "", "The id of the block being rewritten."],
        [
          "`base`",
          "`string`",
          "",
          "The text the agent was given. Left out, it's read as each rewrite starts.",
        ],
        ["`draft`", "`string`", '`""`', "The rewrite so far."],
        ["`writing`", "`boolean`", "`false`", "Whether it's still streaming."],
        [
          "`onConflict`",
          "`(yourText: string) => void`",
          "",
          "Fires once a rewrite, on the clash.",
        ],
        ["`onKeepYours`", "`() => void`", "", "Adds Discard, or Keep yours."],
        [
          "`onUseAgent`",
          "`(draft: string) => void`",
          "",
          "Adds Replace, or Use the agent's.",
        ],
        [
          "`onMerge`",
          "`(yourText: string) => void`",
          "",
          "Adds Merge on a clash.",
        ],
      ],
      after: ["All other `div` props are forwarded."],
    },
  ],
}

export default doc
