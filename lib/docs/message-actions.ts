import type { DocContent } from "@/lib/docs"

const doc: DocContent = {
  intro: [
    "Message Actions are the controls a message's footer usually carries, ready to drop into `MessageActions`: copy, which turns to a tick once copied, retry, edit, a thumbs up or down, and a menu for everything else. Each is a `MessageAction`, an icon button with its name on a tooltip.",
  ],
  gettingStarted: {
    steps: [
      {
        title: "Install the message too",
        body: [
          "They sit in the footer of a `Message`, which installs with them.",
        ],
      },
      {
        title: "Add them to a reply",
        code: {
          title: "components/reply-footer.tsx",
          code: `import { MenuItem } from "@/components/aiellie/menu"
import { MessageActions, MessageFooter } from "@/components/aiellie/message"
import {
  MessageCopyAction,
  MessageFeedback,
  MessageMoreActions,
  MessageRetryAction,
  type Feedback,
} from "@/components/aiellie/message-actions"

export function ReplyFooter({
  text,
  feedback,
  onFeedback,
  onRetry,
}: {
  text: string
  feedback: Feedback | null
  onFeedback: (value: Feedback | null) => void
  onRetry: () => void
}) {
  return (
    <MessageFooter>
      <MessageActions>
        <MessageCopyAction text={text} />
        <MessageFeedback value={feedback} onValueChange={onFeedback} />
        <MessageRetryAction onClick={onRetry} />
        <MessageMoreActions>
          <MenuItem>Read aloud</MenuItem>
        </MessageMoreActions>
      </MessageActions>
    </MessageFooter>
  )
}`,
        },
      },
    ],
  },
  anatomy: {
    code: `<div data-slot="message-actions"> {/* from message */}
  <button data-slot="message-copy-action" />
  <div data-slot="message-feedback" role="group">
    <button aria-pressed /> <button aria-pressed />
  </div>
  <button data-slot="message-retry-action" />
  <button data-slot="message-edit-action" />
  <button data-slot="message-more-actions" /> {/* opens a menu */}
</div>`,
    body: [
      '`MessageActions` shows its row on hover and focus where there\'s a pointer, and always on touch. Pass `reveal="always"` to keep it shown.',
      "The thumbs are toggle buttons: the chosen one is pressed, and pressing it again takes the rating back.",
    ],
  },
  examples: [
    {
      title: "On your own turn",
      body: [
        "A person's message usually carries copy and edit rather than retry.",
      ],
      sample: "message-actions/your-turn",
    },
  ],
  api: [
    {
      title: "MessageCopyAction",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        ["`text`", "`string`", "required", "What goes on the clipboard."],
        ["`onCopy`", "`() => void`", "", "Called once it's copied."],
        ["`tooltip`", "`string`", '`"Copy"`', ""],
      ],
      after: ["All other `MessageAction` props are forwarded."],
    },
    {
      title: "MessageRetryAction, MessageEditAction",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        ["`tooltip`", "`string`", '`"Retry"`, `"Edit"`', ""],
        ["`onClick`", "`() => void`", "", ""],
      ],
      after: ["All other `MessageAction` props are forwarded."],
    },
    {
      title: "MessageFeedback",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        ["`value`", '`"up" | "down" | null`', "required", "The rating given."],
        [
          "`onValueChange`",
          "`(value: Feedback | null) => void`",
          "required",
          "Called with the new rating, or null when it's taken back.",
        ],
      ],
    },
    {
      title: "MessageMoreActions",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        [
          "`children`",
          "`ReactNode`",
          "required",
          "Menu rows, like `MenuItem`s.",
        ],
        ["`tooltip`", "`string`", '`"More"`', ""],
        [
          "`side`, `align`",
          "",
          '`"bottom"`, `"start"`',
          "Where the menu opens.",
        ],
      ],
    },
  ],
}

export default doc
