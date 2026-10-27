import type { DocContent } from "@/lib/docs"

const doc: DocContent = {
  intro: [
    "Contact Button is who you're talking to, at the top of a chat: their picture with their name in a pill beneath it, which opens more about them. It works for an assistant or a person.",
  ],
  gettingStarted: {
    steps: [
      {
        title: "Open their details",
        body: [
          "It's a button, so wire it to whatever shows their details, and pass `aria-expanded` and `aria-controls` when it opens a panel.",
        ],
        code: {
          title: "components/chat-header.tsx",
          code: `import { ContactButton } from "@/components/aiellie/contact-button"

export function ChatHeader({ open, onOpenChange }: Props) {
  return (
    <ContactButton
      name="Ellie"
      emoji="🐘"
      src="/ellie.png"
      aria-expanded={open}
      aria-controls="info-panel"
      onClick={() => onOpenChange(!open)}
    />
  )
}`,
        },
      },
    ],
  },
  anatomy: {
    code: `<button data-slot="contact-button" aria-label="About Ellie">
  <span data-slot="avatar" />
  <span /> {/* the pill: emoji, name, chevron */}
</button>`,
    body: [
      "The picture overlaps the top of the pill. Focus shows on the pill's edge, and the pill stays filled while `aria-expanded` is true.",
    ],
  },
  examples: [
    {
      title: "Without a picture",
      body: ["Their initials stand in."],
      sample: "contact-button/initials",
    },
  ],
  api: [
    {
      title: "ContactButton",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        ["`name`", "`string`", "required", "Also names the button."],
        ["`src`", "`string`", "", "Their picture."],
        ["`emoji`", "`string`", "", "Set before the name."],
      ],
      after: ["All other `button` props are forwarded."],
    },
  ],
}

export default doc
