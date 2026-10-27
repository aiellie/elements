import type { DocContent } from "@/lib/docs"

const doc: DocContent = {
  intro: [
    "Slash Menu lists the commands a composer can run when a message starts with a slash. It filters as the name is typed, moves with the arrow keys, and picks with Enter or Tab, so Enter runs a command instead of sending. Escape closes it until the text changes.",
  ],
  gettingStarted: {
    steps: [
      {
        title: "Wrap the input",
        body: [
          "It goes inside `Composer`, around `ComposerInput`, and reads the text from the composer.",
        ],
        code: {
          title: "components/chat-input.tsx",
          code: `import {
  Composer,
  ComposerFooter,
  ComposerInput,
  ComposerSubmit,
} from "@/components/aiellie/composer"
import { SlashMenu, type SlashCommand } from "@/components/aiellie/slash-menu"

const COMMANDS: SlashCommand[] = [
  { id: "summarize", description: "Sum up the thread so far" },
  { id: "explain", description: "Explain the last reply simply" },
]

export function ChatInput({ onSend }: { onSend: (text: string) => void }) {
  return (
    <Composer onSubmit={onSend}>
      <SlashMenu commands={COMMANDS}>
        <ComposerInput />
      </SlashMenu>
      <ComposerFooter>
        <ComposerSubmit />
      </ComposerFooter>
    </Composer>
  )
}`,
        },
        after: [
          "Picking a command writes `/summarize ` into the field, ready for the rest of the message.",
        ],
      },
    ],
  },
  anatomy: {
    code: `<div data-slot="slash-menu">
  <textarea data-slot="composer-input" aria-autocomplete="list" aria-expanded aria-activedescendant />
  <div role="listbox"> {/* above the field, while open */}
    <div role="option" aria-selected data-highlighted />
  </div>
</div>`,
    body: [
      "Focus stays in the field the whole time. The list is announced through `aria-activedescendant`, and the keys it answers are caught before the field sees them.",
      "The list floats above the field as glass with a shadow, and scrolls past six or so commands.",
    ],
  },
  examples: [
    {
      title: "Run a command at once",
      body: [
        "`onSelect` takes over from writing the command into the field, for commands that act straight away.",
      ],
      sample: "slash-menu/run-a-command",
    },
  ],
  api: [
    {
      title: "SlashMenu",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        ["`commands`", "`SlashCommand[]`", "required", ""],
        [
          "`onSelect`",
          "`(command: SlashCommand) => void`",
          "",
          "Called with the command picked. Left out, the field becomes `/<id> `.",
        ],
        ["`emptyMessage`", "`string`", '`"No commands match"`', ""],
      ],
      after: ["All other `div` props are forwarded."],
    },
    {
      title: "SlashCommand",
      head: ["Field", "Type", "Default", "Description"],
      rows: [
        ["`id`", "`string`", "required", "What's typed after the slash."],
        ["`description`", "`string`", "", ""],
        ["`icon`", "`IconSvgElement`", "", "A Hugeicons glyph."],
      ],
    },
  ],
}

export default doc
