import type { DocContent } from "@/lib/docs"

const doc: DocContent = {
  intro: [
    "Agent Card says what an agent is: its mark, its name and the model it runs on, then the instructions it follows, the tools it can call and the shape of what it returns. Use it where agents are picked, set up, or handed work, like a list of subagents.",
  ],
  gettingStarted: {
    steps: [
      {
        title: "Describe the agent",
        body: [
          "Each part is optional, so a card can be just the header, or the header and its tools.",
        ],
        code: {
          title: "components/researcher.tsx",
          code: `import { Globe02Icon, RoboticIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  AgentCard,
  AgentCardContent,
  AgentCardHeader,
  AgentCardInstructions,
  AgentCardMark,
  AgentCardSection,
  AgentCardTitle,
  AgentCardTool,
  AgentCardTools,
} from "@/components/aiellie/agent-card"

export function Researcher() {
  return (
    <AgentCard>
      <AgentCardHeader>
        <AgentCardMark>
          <HugeiconsIcon icon={RoboticIcon} />
        </AgentCardMark>
        <AgentCardTitle model="Claude Sonnet 5">Researcher</AgentCardTitle>
      </AgentCardHeader>
      <AgentCardContent>
        <AgentCardSection title="Instructions">
          <AgentCardInstructions>Find three recent sources.</AgentCardInstructions>
        </AgentCardSection>
        <AgentCardSection title="Tools">
          <AgentCardTools>
            <AgentCardTool icon={Globe02Icon}>web_search</AgentCardTool>
          </AgentCardTools>
        </AgentCardSection>
      </AgentCardContent>
    </AgentCard>
  )
}`,
        },
      },
    ],
  },
  anatomy: {
    code: `<article data-slot="agent-card">
  <header data-slot="agent-card-header">
    <span data-slot="agent-card-mark" />
    <div data-slot="agent-card-title" />
    <div data-slot="agent-card-actions" />
  </header>
  <div data-slot="agent-card-content">
    <section data-slot="agent-card-section">
      <p data-slot="agent-card-instructions" />
      <ul data-slot="agent-card-tools">
        <li data-slot="agent-card-tool" />
      </ul>
      <pre data-slot="agent-card-code" />
    </section>
  </div>
</article>`,
    body: [
      "The card is flat, with a hairline, like any container. Tools are set in mono, since they're the names the model calls. `AgentCardCode` shows a string as it is and anything else as JSON, for an output schema or a config.",
    ],
  },
  examples: [
    {
      title: "Header only, with an action",
      body: [
        "For a compact row in a list, leave out the content and drop the header's rule. `AgentCardActions` sits at the header's end.",
      ],
      sample: "agent-card/actions",
    },
  ],
  api: [
    {
      title: "AgentCardTitle",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        ["`children`", "`ReactNode`", "", "The agent's name."],
        ["`model`", "`ReactNode`", "", "The model it runs on, under its name."],
      ],
    },
    {
      title: "AgentCardSection",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        [
          "`title`",
          "`ReactNode`",
          "required",
          'Like "Instructions" or "Tools".',
        ],
      ],
    },
    {
      title: "AgentCardTool",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        ["`icon`", "`IconSvgElement`", "", "A mark before the tool's name."],
      ],
    },
    {
      title: "AgentCardCode",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        [
          "`value`",
          "`unknown`",
          "required",
          "A string shows as it is; anything else as JSON.",
        ],
      ],
      after: [
        "`AgentCard`, `AgentCardHeader`, `AgentCardMark`, `AgentCardActions`, `AgentCardContent`, `AgentCardInstructions` and `AgentCardTools` forward their element's props.",
      ],
    },
  ],
}

export default doc
