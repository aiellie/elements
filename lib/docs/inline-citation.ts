import type { DocContent } from "@/lib/docs"

const doc: DocContent = {
  intro: [
    "Inline Citation is a small numbered mark in a reply's prose. Hovering or focusing it opens a card naming the page it cites, with the site's icon, its host and the title; clicking it opens the page. Its numbers count in the order the reply's `Sources` list them, so the mark and the chip point at the same page.",
  ],
  gettingStarted: {
    steps: [
      {
        title: "Mark a claim",
        code: {
          title: "components/claim.tsx",
          code: `import { InlineCitation } from "@/components/aiellie/inline-citation"

<p>
  Every major browser has shipped container queries since 2023
  <InlineCitation
    index={1}
    href="https://web.dev/blog/cq-stable"
    title="Container queries land in stable browsers"
  />
  .
</p>`,
        },
      },
      {
        title: "Turn a reply's links into citations",
        body: [
          "Models with web search often link the page a sentence came from. Give `Response` an `a` renderer that swaps a link to a listed source for its citation.",
        ],
        code: {
          code: `<Response
  components={{
    a({ href, children }) {
      const index = sources.findIndex((source) => source.url === href)
      return index === -1 ? (
        <a href={href}>{children}</a>
      ) : (
        <InlineCitation index={index + 1} href={href} title={sources[index].title} />
      )
    },
  }}
>
  {text}
</Response>`,
        },
      },
    ],
  },
  anatomy: {
    code: `<a data-slot="inline-citation" target="_blank">1</a> {/* HoverCard trigger */}
<div data-slot="inline-citation-preview" /> {/* HoverCard content, in a portal */}`,
    body: [
      "The mark is set in the sans at 11px on `muted`, raised a little off the baseline rather than set as a superscript, so it doesn't open up the line's leading. It's named \"Source 1: title\" for a screen reader.",
      "The card is the aiellie `HoverCard`, glass with a shadow, opening above. A site without a favicon shows a link glyph.",
    ],
  },
  examples: [
    {
      title: "Not a web page",
      body: [
        "Only `http` and `https` addresses lead anywhere. Anything else keeps its number as plain text.",
      ],
      sample: "inline-citation/not-a-page",
    },
  ],
  api: [
    {
      title: "InlineCitation",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        ["`href`", "`string`", "required", "The page cited."],
        [
          "`index`",
          "`number`",
          "required",
          "The number it shows, counting from 1 in the order the sources are listed.",
        ],
        ["`title`", "`string`", "", "The page's title, shown on its card."],
        ["`description`", "`string`", "", "A line or two under the title."],
      ],
      after: ["All other `a` props but `children` are forwarded."],
    },
  ],
}

export default doc
