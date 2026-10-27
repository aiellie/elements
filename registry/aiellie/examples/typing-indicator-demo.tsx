import { TypingIndicator } from "@/registry/aiellie/components/typing-indicator"
import { Message, MessageContent } from "@/registry/aiellie/components/message"

export default function TypingIndicatorDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-3 px-4">
      <Message align="end">
        <MessageContent>Is the 3pm still on?</MessageContent>
      </Message>
      <TypingIndicator label="Maya is typing" />
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <TypingIndicator variant="bare" label="Maya is typing" />
        Maya is typing
      </div>
    </div>
  )
}
