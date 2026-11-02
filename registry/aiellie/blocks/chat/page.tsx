import { Chat } from "@/registry/aiellie/blocks/chat/components/chat"
import { TooltipProvider } from "@/registry/aiellie/ui/tooltip"

export default function ChatPage() {
  return (
    <TooltipProvider>
      <div className="flex h-dvh">
        <Chat />
      </div>
    </TooltipProvider>
  )
}
