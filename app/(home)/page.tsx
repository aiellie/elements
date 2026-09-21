import { BubbleChatSparkIcon } from "@hugeicons/core-free-icons"
import { CategorySection } from "@/components/pages/category-separator"
import { DemoCard } from "@/components/pages/demo-card"
import { ChatPage } from "@/registry/aiellie/blocks/chat/page"
export default function Page() {
  return (
    <div className="flex flex-col gap-16 py-8 sm:py-12">
      <CategorySection category="chat">
        <DemoCard
          href="/elements/chat"
          index={1}
          title="Chat"
          icon={BubbleChatSparkIcon}
          description="A simple chat component"
          wide
        >
          <ChatPage />
        </DemoCard>
      </CategorySection>
    </div>
  )
}
