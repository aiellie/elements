import { PencilEdit02Icon, RoboticIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  AgentCard,
  AgentCardActions,
  AgentCardHeader,
  AgentCardMark,
  AgentCardTitle,
} from "@/registry/aiellie/components/agent-card"
import { TooltipIconButton } from "@/registry/aiellie/components/tooltip-icon-button"

export default function Actions() {
  return (
    <div className="w-full max-w-sm">
      <AgentCard>
        <AgentCardHeader className="border-b-0">
          <AgentCardMark>
            <HugeiconsIcon icon={RoboticIcon} />
          </AgentCardMark>
          <AgentCardTitle model="GPT-6 Sol">Triage</AgentCardTitle>
          <AgentCardActions>
            <TooltipIconButton tooltip="Edit agent">
              <HugeiconsIcon aria-hidden icon={PencilEdit02Icon} />
            </TooltipIconButton>
          </AgentCardActions>
        </AgentCardHeader>
      </AgentCard>
    </div>
  )
}
