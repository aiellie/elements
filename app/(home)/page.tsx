import { DemoCard } from "@/components/pages/demo-card"
import { ChatPage } from "@/registry/aiellie/blocks/chat/page"
export default function Page() {
  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-10 py-8 sm:py-12 md:grid-cols-2 xl:grid-cols-3">
      <DemoCard
        href="/elements/chat"
        index={1}
        title="Chat"
        description="A simple chat component"
        wide
      >
        <ChatPage />
      </DemoCard>
    </div>
        
  )
}
