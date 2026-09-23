import {
  BubbleChatSparkIcon,
  LayoutThreeColumnIcon,
} from "@hugeicons/core-free-icons"
import { CategorySection } from "@/components/pages/category-separator"
import { DemoCard } from "@/components/pages/demo-card"
import { InstallCommand } from "@/components/pages/install-command"
import { Chat } from "@/registry/aiellie/blocks/chat/components/chat"
import { PanelShell } from "@/registry/aiellie/blocks/panels/components/panels-shell"
import PanelsPage from "@/registry/aiellie/blocks/panels/page"
export default function Page() {
  return (
    <div className="flex flex-col gap-16 py-8 sm:py-12">
      <InstallCommand command="npx aiellie init" className="self-start" />
      <CategorySection category="layout">
        <DemoCard
          href="/elements/panels"
          index={1}
          title="Panels"
          icon={LayoutThreeColumnIcon}
          description="An app shell with resizable panels on three sides"
          wide
        >
          {/* The shell fills the window by default; here it fills the card. */}
          <PanelShell className="my-0 h-full overflow-hidden rounded-lg border">
            <PanelsPage />
          </PanelShell>
        </DemoCard>
      </CategorySection>
      <CategorySection category="chat">
        <DemoCard
          href="/elements/chat"
          index={2}
          title="Chat"
          icon={BubbleChatSparkIcon}
          description="A simple chat component"
          wide
        >
          <Chat className="rounded-lg border" />
        </DemoCard>
      </CategorySection>
    </div>
  )
}
