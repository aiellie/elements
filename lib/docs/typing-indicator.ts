import type { DocContent } from "@/lib/docs"

const doc: DocContent = {
  intro: [
    "Typing Indicator is three dots that bounce in turn while someone writes a reply. Use it for a person or an agent composing a message. For a model working before its first word, use Thinking Indicator, which says what it's doing.",
    "The bubble sits in a thread like a message, in the same fill and with the same tail. The bare variant is the dots alone, for a row of your own.",
  ],
  gettingStarted: {
    steps: [
      {
        title: "Show it while they type",
        body: [
          "Put it where their next message will land, and take it away when the message arrives.",
        ],
        code: {
          title: "components/thread.tsx",
          code: `import { TypingIndicator } from "@/components/aiellie/typing-indicator"

{typing ? <TypingIndicator label={\`\${name} is typing\`} /> : null}`,
        },
      },
    ],
  },
  anatomy: {
    code: `<div data-slot="typing-indicator" data-variant="bubble" role="status" aria-label="Typing">
  <span /> <span /> <span />
</div>`,
    body: [
      "It's a status, so a screen reader announces `label` when it appears. The dots are hidden from it. Under reduced motion they hold still.",
    ],
  },
  examples: [
    {
      title: "In a thread",
      body: [
        "Inside a `Message`, it takes the message's place beside an avatar.",
      ],
      sample: "typing-indicator/in-a-thread",
    },
  ],
  api: [
    {
      title: "TypingIndicator",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        ["`variant`", '`"bubble" | "bare"`', '`"bubble"`', ""],
        [
          "`label`",
          "`string`",
          '`"Typing"`',
          'What a screen reader hears, like "Maya is typing".',
        ],
      ],
      after: ["All other `div` props are forwarded."],
    },
  ],
}

export default doc
