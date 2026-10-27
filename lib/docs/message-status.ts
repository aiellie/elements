import type { DocContent } from "@/lib/docs"

const doc: DocContent = {
  intro: [
    'Message Status shows how far a message has got: a clock while sending, a tick once sent, a double tick when delivered, the same double tick in the live ink once read, and a warning when it couldn\'t be sent. A failed message can offer "Try again".',
    "It's an icon with its name kept for screen readers, or shown with `showLabel`.",
  ],
  gettingStarted: {
    steps: [
      {
        title: "Put it under the message",
        code: {
          title: "components/sent-message.tsx",
          code: `import {
  Message,
  MessageContent,
  MessageFooter,
  MessagePart,
} from "@/components/aiellie/message"
import {
  MessageStatus,
  type MessageStatusValue,
} from "@/components/aiellie/message-status"

export function SentMessage({
  text,
  status,
  onRetry,
}: {
  text: string
  status: MessageStatusValue
  onRetry: () => void
}) {
  return (
    <Message align="end">
      <MessageContent>
        <MessagePart>{text}</MessagePart>
        <MessageFooter>
          <MessageStatus status={status} onRetry={onRetry} />
        </MessageFooter>
      </MessageContent>
    </Message>
  )
}`,
        },
      },
    ],
  },
  anatomy: {
    code: `<span data-slot="message-status" data-status="read" role="status">
  <svg />
  <span /> {/* the label, screen readers only unless showLabel */}
  <button /> {/* Try again, when failed */}
</span>`,
    body: [
      "It's a status region, so the new state is read out without interrupting. The clock pulses while sending, except under reduced motion.",
    ],
  },
  examples: [
    {
      title: "Your words",
      body: ["`labels` renames any of the states."],
      sample: "message-status/your-words",
    },
  ],
  api: [
    {
      title: "MessageStatus",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        [
          "`status`",
          '`"sending" | "sent" | "delivered" | "read" | "failed"`',
          "required",
          "",
        ],
        [
          "`showLabel`",
          "`boolean`",
          "`false`",
          "Shows the name beside the icon.",
        ],
        [
          "`labels`",
          "`Partial<Record<status, string>>`",
          "",
          "Your own names.",
        ],
        ["`onRetry`", "`() => void`", "", 'Adds "Try again" when failed.'],
      ],
      after: ["All other `span` props are forwarded."],
    },
  ],
}

export default doc
