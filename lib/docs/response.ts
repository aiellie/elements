import type { DocContent } from "@/lib/docs"

const doc: DocContent = {
  intro: [
    "Response renders a reply written in Markdown and sets it as prose: headings, lists, quotes, links, tables and inline code, with GitHub's extensions like tables and strikethrough. Fenced code becomes a `CodeBlock`, named by its language and copyable. While the reply streams, each word fades in as it arrives and a caret follows the last one.",
  ],
  gettingStarted: {
    steps: [
      {
        title: "Render the reply",
        body: ["Pass the Markdown as the child."],
        code: {
          title: "components/reply.tsx",
          code: `import { Response } from "@/components/aiellie/response"

export function Reply({ text }: { text: string }) {
  return <Response>{text}</Response>
}`,
        },
      },
      {
        title: "Stream it from the AI SDK",
        body: [
          "Join the message's text parts and set `streaming` while the reply is still coming. Only the words that just arrived fade in, so the text already on screen holds still.",
        ],
        code: {
          title: "components/reply.tsx",
          code: `import type { UIMessage } from "ai"

import { Response } from "@/components/aiellie/response"

export function Reply({
  message,
  streaming,
}: {
  message: UIMessage
  streaming: boolean
}) {
  const text = message.parts
    .map((part) => (part.type === "text" ? part.text : ""))
    .join("")

  return <Response streaming={streaming}>{text}</Response>
}`,
        },
      },
    ],
  },
  anatomy: {
    code: `<div data-slot="response" data-streaming>
  <p /> <h2 /> <ul /> <blockquote /> {/* the reply's own elements */}
  <figure data-slot="response-code-block" /> {/* fenced code */}
  <div data-slot="response-table"><table /></div>
  <span data-slot="response-caret" /> {/* while streaming, after the last word */}
</div>`,
    body: [
      "The styles live on the root and reach the elements the Markdown makes, so it needs no typography plugin. Blocks sit 16px apart, the reply's type is 14px on 24px leading, nothing is heavier than medium, and a table scrolls in its own box rather than widening the page.",
      "Links open in a new tab and rest in the ink around them, underlining on hover.",
    ],
  },
  examples: [
    {
      title: "Cite sources inline",
      body: [
        "`components` replaces how any element renders. Here a link to a listed source becomes an `InlineCitation` with its number.",
      ],
      sample: "response/citations",
    },
    {
      title: "Without the fade",
      body: [
        "Leave `streaming` off and the reply renders as plain elements, which is also how a finished reply renders.",
      ],
      code: {
        code: `<Response>{text}</Response>`,
      },
    },
  ],
  api: [
    {
      title: "Response",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        ["`children`", "`string`", "required", "The reply, as Markdown."],
        [
          "`streaming`",
          "`boolean`",
          "`false`",
          "Fades in each word as it arrives, with a caret after the last.",
        ],
        [
          "`components`",
          "`Components`",
          "",
          "react-markdown renderers of your own, merged over the defaults.",
        ],
        ["`className`", "`string`", "", "Merged onto the root."],
      ],
      after: ["All other `div` props are forwarded."],
    },
  ],
}

export default doc
