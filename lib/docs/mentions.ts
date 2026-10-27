import type { DocContent } from "@/lib/docs"

const doc: DocContent = {
  intro: [
    "Mentions lists the people and agents a message can name when an at sign is typed in the composer, anywhere in the text. It filters by what follows the at sign, moves with the arrow keys and picks with Enter or Tab, writing `@Name ` in place and leaving the caret after it.",
  ],
  gettingStarted: {
    steps: [
      {
        title: "Wrap the input",
        body: [
          "Like `SlashMenu`, it goes inside `Composer`, around `ComposerInput`.",
        ],
        code: {
          title: "components/chat-input.tsx",
          code: `import {
  Composer,
  ComposerFooter,
  ComposerInput,
  ComposerSubmit,
} from "@/components/aiellie/composer"
import { Mentions, type MentionOption } from "@/components/aiellie/mentions"

const OPTIONS: MentionOption[] = [
  { id: "researcher", name: "Researcher", kind: "agent" },
  { id: "ada", name: "Ada", description: "Design" },
]

export function ChatInput({ onSend }: { onSend: (text: string) => void }) {
  return (
    <Composer onSubmit={onSend}>
      <Mentions options={OPTIONS}>
        <ComposerInput />
      </Mentions>
      <ComposerFooter>
        <ComposerSubmit />
      </ComposerFooter>
    </Composer>
  )
}`,
        },
      },
    ],
  },
  anatomy: {
    code: `<div data-slot="mentions">
  <textarea data-slot="composer-input" aria-autocomplete="list" aria-expanded aria-activedescendant />
  <div role="listbox"> {/* above the field, while open */}
    <div role="option" aria-selected data-highlighted /> {/* picture, name, description */}
  </div>
</div>`,
    body: [
      "An option shows its `avatar`, or a sparkle for an agent and a silhouette for a person. Escape closes the list until the text changes.",
      "Focus stays in the field, and the keys the list answers are caught before the field sees them.",
    ],
  },
  examples: [
    {
      title: "Know who was named",
      body: [
        "`onMention` is called with each option picked, for a message that should notify them.",
      ],
      sample: "mentions/who-was-named",
    },
  ],
  api: [
    {
      title: "Mentions",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        [
          "`options`",
          "`MentionOption[]`",
          "required",
          "The people and agents a message can name.",
        ],
        [
          "`onMention`",
          "`(option: MentionOption) => void`",
          "",
          "Called with whoever was picked.",
        ],
        ["`emptyMessage`", "`string`", '`"No one matches"`', ""],
      ],
      after: ["All other `div` props are forwarded."],
    },
    {
      title: "MentionOption",
      head: ["Field", "Type", "Default", "Description"],
      rows: [
        ["`id`", "`string`", "required", ""],
        [
          "`name`",
          "`string`",
          "required",
          "Written into the message as `@name`.",
        ],
        ["`description`", "`string`", "", "Shown at the end of the row."],
        ["`avatar`", "`string`", "", "A picture's address."],
        [
          "`kind`",
          '`"person" | "agent"`',
          '`"person"`',
          "Picks the glyph when there's no picture.",
        ],
      ],
    },
  ],
}

export default doc
