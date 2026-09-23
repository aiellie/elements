import { BubbleChatSparkIcon } from "@hugeicons/core-free-icons"
import { CategorySection } from "@/components/pages/category-separator"
import { DemoCard } from "@/components/pages/demo-card"
import { InstallCommand } from "@/components/pages/install-command"
import { PageHero } from "@/components/pages/page-hero"
import { cardCount } from "@/lib/categories"
import { PAGES } from "@/lib/constants"
import { Chat } from "@/registry/aiellie/blocks/chat/components/chat"
export default function Page() {
  return (
    <div className="flex flex-col gap-16 py-8 sm:py-12">
      <PageHero
        {...PAGES["/"]}
        count={cardCount("registry:block")}
        actions={<InstallCommand command="npx aiellie init" />}
      />
      <CategorySection category="chat">
        <DemoCard
          href="/elements/chat"
          index={1}
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
