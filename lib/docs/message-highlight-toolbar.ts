import type { DocContent } from "@/lib/docs"

const doc: DocContent = {
  intro: [
    "Message Highlight Toolbar floats a small toolbar over text someone selects in a thread, with actions that get the selected words: quote them into a reply, ask what they mean, copy them. It appears just above the selection, kept inside the thread's sides, and goes away on a press anywhere else or on Escape.",
  ],
  gettingStarted: {
    steps: [
      {
        title: "Wrap the thread",
        body: [
          "`MessageHighlight` is the region selections are read in. Put the toolbar inside it, with an action for each thing to do with the words.",
        ],
        code: {
          title: "components/thread-with-quotes.tsx",
          code: `import { QuoteDownIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  MessageHighlight,
  MessageHighlightAction,
  MessageHighlightToolbar,
} from "@/components/aiellie/message-highlight-toolbar"

export function ThreadWithQuotes({
  children,
  onQuote,
}: {
  children: React.ReactNode
  onQuote: (text: string) => void
}) {
  return (
    <MessageHighlight>
      {children}
      <MessageHighlightToolbar>
        <MessageHighlightAction tooltip="Quote" onAction={onQuote}>
          <HugeiconsIcon aria-hidden icon={QuoteDownIcon} />
        </MessageHighlightAction>
      </MessageHighlightToolbar>
    </MessageHighlight>
  )
}`,
        },
      },
    ],
  },
  anatomy: {
    code: `<div data-slot="message-highlight" data-highlighted>
  {/* the thread */}
  <div data-slot="message-highlight-toolbar" role="toolbar"> {/* while text is selected */}
    <button data-slot="message-highlight-action" />
  </div>
</div>`,
    body: [
      "The toolbar is the aiellie `Toolbar` floated as glass with a shadow, so its buttons are walked with the arrow keys and each names itself on a tooltip. It reads the selection when the pointer or a key lets go, and keeps the words, since pressing a button clears the selection before the button runs.",
      "`useMessageHighlight` gives anything inside the region the selected words and a way to clear them, for an action of your own.",
    ],
  },
  examples: [
    {
      title: "Ask about a phrase",
      body: ["An action can fill the composer with the words as a quote."],
      sample: "message-highlight-toolbar/ask-about",
    },
  ],
  api: [
    {
      title: "MessageHighlightAction",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        ["`tooltip`", "`ReactNode`", "required", "The button's name."],
        [
          "`onAction`",
          "`(text: string) => void`",
          "",
          "Called with the selected words, after which the toolbar closes.",
        ],
      ],
      after: ["All other `ToolbarButton` props are forwarded."],
    },
    {
      title: "MessageHighlightToolbar",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [["`className`", "`string`", "", "Merged onto the toolbar."]],
      after: ["All other `Toolbar` props are forwarded."],
    },
    {
      title: "useMessageHighlight",
      head: ["Field", "Type", "Default", "Description"],
      rows: [
        [
          "`highlight`",
          "`{ text: string; x: number; y: number } | null`",
          "",
          "The selected words and where the toolbar sits.",
        ],
        [
          "`clear`",
          "`() => void`",
          "",
          "Closes the toolbar and the selection.",
        ],
      ],
    },
  ],
}

export default doc
