import {
  AiBrain01Icon,
  CodeIcon,
  Globe02Icon,
  Search01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  AgentCard,
  AgentCardCode,
  AgentCardContent,
  AgentCardHeader,
  AgentCardInstructions,
  AgentCardMark,
  AgentCardSection,
  AgentCardTitle,
  AgentCardTool,
  AgentCardTools,
} from "@/registry/aiellie/components/agent-card"

export default function AgentCardDemo() {
  return (
    <div className="w-full max-w-sm px-4">
      <AgentCard>
        <AgentCardHeader>
          <AgentCardMark>
            <HugeiconsIcon icon={AiBrain01Icon} />
          </AgentCardMark>
          <AgentCardTitle model="Claude Sonnet 5">Researcher</AgentCardTitle>
        </AgentCardHeader>
        <AgentCardContent>
          <AgentCardSection title="Instructions">
            <AgentCardInstructions>
              Find three recent sources on the question and summarise what they
              agree on.
            </AgentCardInstructions>
          </AgentCardSection>
          <AgentCardSection title="Tools">
            <AgentCardTools>
              <AgentCardTool icon={Globe02Icon}>web_search</AgentCardTool>
              <AgentCardTool icon={Search01Icon}>fetch_page</AgentCardTool>
              <AgentCardTool icon={CodeIcon}>run_code</AgentCardTool>
            </AgentCardTools>
          </AgentCardSection>
          <AgentCardSection title="Returns">
            <AgentCardCode value={{ summary: "string", sources: "url[]" }} />
          </AgentCardSection>
        </AgentCardContent>
      </AgentCard>
    </div>
  )
}
