import type { DocContent } from "@/lib/docs"

const doc: DocContent = {
  intro: [
    "Quoted Message keeps the words a reply is about above it: a short excerpt behind a rule on the start side, with who said them. Above a message it can lead back to the original; in a composer it says what the message being written answers, and can be taken off again.",
  ],
  gettingStarted: {
    steps: [
      {
        title: "Quote above a message",
        body: [
          "Render the content as a button or link when it should lead back to what it quotes.",
        ],
        code: {
          title: "components/reply-with-quote.tsx",
          code: `import {
  QuotedMessage,
  QuotedMessageContent,
  QuotedMessageText,
} from "@/components/aiellie/quoted-message"

export function ReplyQuote({ text, onJump }: { text: string; onJump: () => void }) {
  return (
    <QuotedMessage>
      <QuotedMessageContent render={<button type="button" onClick={onJump} />} lines={1}>
        <QuotedMessageText>{text}</QuotedMessageText>
      </QuotedMessageContent>
    </QuotedMessage>
  )
}`,
        },
      },
    ],
  },
  anatomy: {
    code: `<div data-slot="quoted-message">
  <div data-slot="quoted-message-content"> {/* or a button or link */}
    <span data-slot="quoted-message-author" />
    <span data-slot="quoted-message-text" />
  </div>
  <button data-slot="quoted-message-dismiss" />
</div>`,
    body: [
      "The excerpt is cut after `lines` lines, two by default, so a long quote never pushes the reply down. The quote is in `muted-foreground`, set apart from the words that answer it by the rule and the ink rather than by a box.",
      "Content rendered as a button or link takes the ring colour on its border when focused, and foreground on hover.",
    ],
  },
  examples: [
    {
      title: "In the composer",
      body: [
        "Put the quote at the top of the composer with a way to take it off, and clear it once the message is sent.",
      ],
      sample: "quoted-message/in-composer",
    },
  ],
  api: [
    {
      title: "QuotedMessageContent",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        [
          "`lines`",
          "`1 | 2 | 3`",
          "`2`",
          "How many lines of the excerpt show before it's cut.",
        ],
        [
          "`render`",
          "`ReactElement`",
          "",
          "Renders it as another element, like a button or link.",
        ],
      ],
      after: ["All other `div` props are forwarded."],
    },
    {
      title: "QuotedMessageDismiss",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [["`tooltip`", "`string`", '`"Remove quote"`', "Its name."]],
      after: ["All other `TooltipIconButton` props are forwarded."],
    },
    {
      title: "QuotedMessage, QuotedMessageAuthor, QuotedMessageText",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [["`className`", "`string`", "", "Merged onto the element."]],
      after: ["All other props of their element are forwarded."],
    },
  ],
}

export default doc
