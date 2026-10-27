import type { DocContent } from "@/lib/docs"

const doc: DocContent = {
  intro: [
    "Sources lists the pages a reply drew on, as a row of chips that each show a site's icon and address. Hovering one opens a card with the page's title, description and preview image. Past four, the rest fold into a \"+N\" chip that shows them all. Only web pages count, so a link a search hands back that isn't `http` or `https` never shows.",
  ],
  gettingStarted: {
    steps: [
      {
        title: "List the pages",
        body: [
          "A `Source` needs only its `href`. Give it whatever else the search returned, like a `title`, and its card shows that.",
        ],
        code: {
          title: "components/reply-sources.tsx",
          code: `import { Source, Sources } from "@/components/aiellie/sources"

export function ReplySources({
  sources,
}: {
  sources: { url: string; title?: string }[]
}) {
  return (
    <Sources>
      {sources.map((source) => (
        <Source key={source.url} href={source.url} title={source.title} />
      ))}
    </Sources>
  )
}`,
        },
      },
      {
        title: "Read the pages for their cards",
        body: [
          "To fill a card from the page itself, install the `link-preview` route and hand `Sources` a `loadPreview` that calls it. Each page is asked for once, the first time its card opens, however many chips show it.",
        ],
        code: {
          code: `npx shadcn@latest add "@aiellie/link-preview"`,
          lang: "bash",
        },
      },
      {
        title: "Pass the loader",
        code: {
          title: "components/reply-sources.tsx",
          code: `import {
  Source,
  Sources,
  type SourcePreview,
} from "@/components/aiellie/sources"

async function loadPreview(href: string): Promise<SourcePreview | null> {
  const response = await fetch(
    \`/api/link-preview?url=\${encodeURIComponent(href)}\`
  )
  return response.ok ? response.json() : null
}

<Sources loadPreview={loadPreview}>{/* … */}</Sources>`,
        },
        after: [
          "The route only fetches public web addresses, checks every redirect, and gives up after five seconds. What a source was given wins over what the page says.",
        ],
      },
    ],
  },
  anatomy: {
    code: `<div data-slot="sources" role="group" aria-label="Sources">
  <a data-slot="source" target="_blank"> {/* HoverCard trigger */}
    <img /> {/* favicon, or a link glyph */}
    <span /> {/* host */}
  </a>
  <button data-slot="sources-more" /> {/* "+N", past max */}
</div>
<div data-slot="source-preview" /> {/* HoverCard content, in a portal */}`,
    body: [
      "A chip's icon tries the `icon` it was given, then the site's `/favicon.ico`, then the one the preview found, and falls back to a link glyph, so a site without one never shows a broken image. If the site has none where browsers look, the chip reads the page early to find it. Images load with no referrer.",
      "The card is the aiellie `HoverCard`, a floating layer with glass and a shadow, opening above the chip. While the page is read it shows skeleton lines.",
    ],
  },
  examples: [
    {
      title: "With what the search returned",
      body: [
        "Without `loadPreview`, each card shows what its source was given, and the address where there's no title.",
      ],
      sample: "sources/given",
    },
    {
      title: "From the AI SDK",
      body: [
        "Models with web search send `source-url` parts. Collect them from the message and list them under the reply.",
      ],
      code: {
        code: `const sources = message.parts.filter((part) => part.type === "source-url")

{sources.length ? (
  <Sources loadPreview={loadPreview}>
    {sources.map((source) => (
      <Source key={source.sourceId} href={source.url} title={source.title} />
    ))}
  </Sources>
) : null}`,
      },
    },
    {
      title: "Show more before folding",
      body: ['`max` sets how many chips show before the "+N".'],
      code: {
        code: `<Sources max={6}>{/* … */}</Sources>`,
      },
    },
  ],
  api: [
    {
      title: "Sources",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        [
          "`max`",
          "`number`",
          "`4`",
          'How many show before the rest fold into a "+N" chip.',
        ],
        [
          "`loadPreview`",
          "`(href: string) => Promise<SourcePreview | null>`",
          "",
          "Fetches a page's title, description, image and icon for its card. Without it, the card shows what each source was given.",
        ],
        ["`className`", "`string`", "", "Merged onto the row."],
      ],
      after: ["All other `div` props are forwarded."],
    },
    {
      title: "Source",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        [
          "`href`",
          "`string`",
          "required",
          "The page. Anything but `http` or `https` shows nothing.",
        ],
        ["`title`", "`string`", "", "The page's title."],
        ["`description`", "`string`", "", "A line or two about it."],
        [
          "`image`",
          "`string`",
          "",
          "The page's own preview image, like its `og:image`.",
        ],
        ["`icon`", "`string`", "", "The site's icon, tried first."],
        [
          "`siteName`",
          "`string`",
          "",
          "The site's own name, shown on the card over its host.",
        ],
        ["`className`", "`string`", "", "Merged onto the chip."],
      ],
      after: [
        "All other `a` props but `children` are forwarded. It opens in a new tab.",
      ],
    },
    {
      title: "SourcePreview",
      head: ["Field", "Type", "Default", "Description"],
      rows: [
        ["`title`", "`string`", "", "The page's title."],
        ["`description`", "`string`", "", "Its description."],
        ["`image`", "`string`", "", "Its preview image."],
        ["`icon`", "`string`", "", "Its icon."],
        ["`siteName`", "`string`", "", "The site's own name, over its host."],
      ],
      after: [
        "What `loadPreview` resolves to, and what `link-preview` returns.",
      ],
    },
  ],
}

export default doc
