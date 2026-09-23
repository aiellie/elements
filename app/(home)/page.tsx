import {
  BubbleChatSparkIcon,
  LayoutThreeColumnIcon,
} from "@hugeicons/core-free-icons"
import { CategorySection } from "@/components/pages/category-separator"
import { DemoCard } from "@/components/pages/demo-card"
import { InstallCommand } from "@/components/pages/install-command"
import { Chat } from "@/registry/aiellie/blocks/chat/components/chat"
import { Panels } from "@/registry/aiellie/blocks/panels/components/panels"
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
          <Panels className="h-full overflow-hidden rounded-lg border">
            <div className="flex h-full items-center justify-center p-6 text-sm text-muted-foreground">
              Your page goes here.
            </div>
          </Panels>
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
