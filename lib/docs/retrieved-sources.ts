import type { DocContent } from "@/lib/docs"

const doc: DocContent = {
  intro: [
    "Retrieved Sources lists the passages a reply was built from when it searched your own documents. Each row names the document, where in it the passage sits, and how relevant it scored, and opens to show the passage itself.",
    "With a `threshold`, passages that scored under it are muted, so it's clear which ones the model was given. For pages from the web, use [Sources](/components/sources).",
  ],
  gettingStarted: {
    steps: [
      {
        title: "List what was retrieved",
        body: ["Scores run from 0 to 1, as most vector stores return them."],
        code: {
          title: "components/reply-sources.tsx",
          code: `import {
  RetrievedSource,
  RetrievedSources,
} from "@/components/aiellie/retrieved-sources"

export function ReplySources({ chunks }: { chunks: Chunk[] }) {
  return (
    <RetrievedSources threshold={0.5}>
      {chunks.map((chunk) => (
        <RetrievedSource
          key={chunk.id}
          title={chunk.document}
          location={\`p. \${chunk.page}\`}
          score={chunk.score}
        >
          {chunk.text}
        </RetrievedSource>
      ))}
    </RetrievedSources>
  )
}`,
        },
      },
    ],
  },
  anatomy: {
    code: `<ol data-slot="retrieved-sources">
  <li data-slot="retrieved-source" data-below-threshold>
    <button /> {/* icon, title, location, score, chevron */}
    <blockquote /> {/* the passage, when opened */}
  </li>
</ol>`,
    body: [
      "Each row is a Base UI `Collapsible`. A row with no passage doesn't open and shows no chevron. The score is drawn as a short bar and printed to two places, and read out as its relevance.",
    ],
  },
  examples: [
    {
      title: "Without scores",
      body: [
        "Leave `score` out for search that doesn't rank, and pass your own `icon`.",
      ],
      sample: "retrieved-sources/no-scores",
    },
  ],
  api: [
    {
      title: "RetrievedSources",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        [
          "`threshold`",
          "`number`",
          "",
          "Passages scoring under it are muted as not used.",
        ],
      ],
      after: ["All other `ol` props are forwarded."],
    },
    {
      title: "RetrievedSource",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        ["`title`", "`ReactNode`", "required", "The document."],
        ["`location`", "`ReactNode`", "", 'Where in it, like "p. 4".'],
        ["`score`", "`number`", "", "Relevance, from 0 to 1."],
        ["`icon`", "`IconSvgElement`", "a file", ""],
        ["`children`", "`ReactNode`", "", "The passage, shown when opened."],
        [
          "`open`, `defaultOpen`, `onOpenChange`",
          "",
          "",
          "As on `Collapsible.Root`.",
        ],
      ],
    },
  ],
}

export default doc
