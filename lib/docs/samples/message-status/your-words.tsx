import { MessageStatus } from "@/registry/aiellie/components/message-status"

export default function YourWords() {
  return (
    <div className="flex flex-col items-start gap-2">
      <MessageStatus status="read" showLabel labels={{ read: "Seen by Ada" }} />
      <MessageStatus status="failed" showLabel labels={{ failed: "Offline" }} />
    </div>
  )
}
