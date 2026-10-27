import type { DocContent } from "@/lib/docs"

const doc: DocContent = {
  intro: [
    "Prompt Autocomplete is a prompt field that shows a suggested ending in faint text after the caret. Tab takes all of it, Option-Right (Ctrl-Right off a Mac) takes the next word, and Escape dismisses it. Without a suggestion, Tab moves focus as usual.",
    "A suggestion holds while the person types its own characters, and shrinks as they do, so it doesn't flicker between keystrokes. Typing anything else drops it. It only shows with the caret at the end.",
  ],
  gettingStarted: {
    steps: [
      {
        title: "Pass a suggestion",
        body: [
          "`suggestion` is only the text that comes after the value. Fetch it as the value changes; a short debounce keeps requests down.",
        ],
        code: {
          title: "components/prompt.tsx",
          code: `import { PromptAutocomplete } from "@/components/aiellie/prompt-autocomplete"

export function Prompt() {
  const [value, setValue] = useState("")
  const suggestion = useSuggestion(value)

  return (
    <PromptAutocomplete
      value={value}
      onValueChange={setValue}
      suggestion={suggestion}
      onSubmit={(message) => send(message)}
    />
  )
}`,
        },
      },
    ],
  },
  anatomy: {
    code: `<div data-slot="prompt-autocomplete" data-suggesting>
  <div aria-hidden>
    {/* the value, invisible, then the ghost text and a tab key */}
    <span data-slot="prompt-autocomplete-ghost" />
  </div>
  <textarea data-slot="prompt-autocomplete-input" aria-autocomplete="inline" />
  <span data-slot="prompt-autocomplete-hints" />
  <button data-slot="prompt-autocomplete-send" />
</div>`,
    body: [
      "The ghost text is drawn by a copy of the field behind it, wrapped the same way, so it lines up on every line. The tab key at its end can be clicked too.",
      "A new suggestion is read out once, with how to take it. `nextWord` and `remainingCompletion` are exported for building your own.",
    ],
  },
  examples: [
    {
      title: "Accepting and dismissing",
      body: [
        "`onAccept` gets the text put in and whether it was all of it or a word.",
      ],
      sample: "prompt-autocomplete/accept-events",
    },
  ],
  api: [
    {
      title: "PromptAutocomplete",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        ["`value`, `defaultValue`, `onValueChange`", "`string`", '`""`', ""],
        [
          "`suggestion`",
          "`string`",
          "",
          "Only the text that comes after the value.",
        ],
        [
          "`onAccept`",
          '`(accepted: string, mode: "all" | "word") => void`',
          "",
          "",
        ],
        ["`onDismiss`", "`() => void`", "", "Fires on Escape."],
        [
          "`onSubmit`",
          "`(value: string) => void`",
          "",
          "Fires on Enter and from the send button, which it adds.",
        ],
        ["`placeholder`", "`string`", '`"Message"`', ""],
        ["`label`", "`string`", '`"Message"`', "The field's accessible name."],
        ["`disabled`", "`boolean`", "`false`", ""],
        [
          "`showHints`",
          "`boolean`",
          "`true`",
          "Shows the keys while a suggestion shows.",
        ],
      ],
      after: ["All other `div` props are forwarded."],
    },
  ],
}

export default doc
