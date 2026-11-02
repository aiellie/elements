import { TypingIndicator } from "@/registry/aiellie/components/typing-indicator"

export default function TypingIndicatorDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-3 px-4 items-center justify-center">
      <TypingIndicator label="Maya is typing" />
    </div>
  )
}
