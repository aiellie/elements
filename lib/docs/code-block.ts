import type { DocContent } from "@/lib/docs"

const doc: DocContent = {
  intro: [
    "Code Block shows code as a thing on the page rather than a thing inside prose. Its header names the file, with a mark for its language, and carries copy and download. The code itself is coloured by Shiki in GitHub's light and dark themes, can number its lines and mark the ones being talked about, and shows a caret after the last line while more is coming.",
    "Shiki loads the first time a block needs colour, so a page that shows no code never downloads it. Until it arrives, and for any language it doesn't know, the code shows plain.",
  ],
  gettingStarted: {
    steps: [
      {
        title: "Lay out the block",
        body: [
          "A block is its parts: a header with a title and actions, then the content. A title that's a file name or a language gets its mark on its own.",
        ],
        code: {
          title: "components/snippet.tsx",
          code: `import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopy,
  CodeBlockHeader,
  CodeBlockTitle,
} from "@/components/aiellie/code-block"

export function Snippet({ file, code }: { file: string; code: string }) {
  return (
    <CodeBlock>
      <CodeBlockHeader>
        <CodeBlockTitle>{file}</CodeBlockTitle>
        <CodeBlockActions>
          <CodeBlockCopy code={code} />
        </CodeBlockActions>
      </CodeBlockHeader>
      <CodeBlockContent code={code} language="tsx" />
    </CodeBlock>
  )
}`,
        },
      },
      {
        title: "Point at lines",
        body: [
          "`lineNumbers` adds a gutter that stays put while long lines scroll, and is left out of a copy. `highlightLines` marks lines by number, counting from 1.",
        ],
        code: {
          code: `<CodeBlockContent code={code} language="ts" lineNumbers highlightLines={[4, 5]} />`,
        },
      },
    ],
  },
  anatomy: {
    code: `<figure data-slot="code-block">
  <figcaption data-slot="code-block-header">
    <span data-slot="code-block-title" /> {/* mark and name */}
    <div data-slot="code-block-actions">
      <button data-slot="code-block-download" />
      <button data-slot="code-block-copy" />
    </div>
  </figcaption>
  <pre data-slot="code-block-content" dir="ltr">
    <span data-slot="code-block-line" data-highlighted />
  </pre>
</figure>`,
    body: [
      "The content is always left to right, even on a right-to-left page, since brackets in code reorder otherwise. It scrolls sideways rather than wrapping, and can be reached with Tab so the keyboard can scroll it too. Pass `wrap` for a narrow column.",
      "`useHighlightedLines` and `CodeTokens` are exported too, so other code views, like `code-diff` and `terminal`, colour code the same way.",
    ],
  },
  examples: [
    {
      title: "While it streams",
      body: [
        "Pass the code so far with `streaming` and a caret blinks after the last line. Lines already coloured keep their colours while the new ones are highlighted.",
      ],
      sample: "code-block/streaming",
    },
    {
      title: "Download as a file",
      body: [
        "`CodeBlockDownload` saves the code under `filename`, so the name in the header is the name on disk.",
      ],
      code: {
        code: `<CodeBlockActions>
  <CodeBlockDownload code={code} filename="route.ts" />
  <CodeBlockCopy code={code} />
</CodeBlockActions>`,
      },
    },
    {
      title: "A taller file",
      body: ["Cap the height with a class and the block scrolls both ways."],
      code: {
        code: `<CodeBlockContent code={code} language="tsx" className="max-h-80" />`,
      },
    },
  ],
  api: [
    {
      title: "CodeBlockContent",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        ["`code`", "`string`", "required", "The code to show."],
        [
          "`language`",
          "`string`",
          "",
          "Any language Shiki knows, like `tsx` or `bash`. Left out, the code stays plain.",
        ],
        ["`lineNumbers`", "`boolean`", "`false`", "Numbers each line."],
        [
          "`highlightLines`",
          "`number[]`",
          "",
          "Lines to mark, counting from 1.",
        ],
        [
          "`wrap`",
          "`boolean`",
          "`false`",
          "Wraps long lines instead of scrolling them.",
        ],
        [
          "`streaming`",
          "`boolean`",
          "`false`",
          "Shows a caret after the last line.",
        ],
      ],
      after: ["All other `pre` props are forwarded."],
    },
    {
      title: "CodeBlockTitle",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        [
          "`icon`",
          "`ReactNode`",
          "",
          "A mark of your own, or `null` for none. Left out, it's read off a title that's a file name or language.",
        ],
      ],
      after: ["All other `span` props are forwarded."],
    },
    {
      title: "CodeBlockCopy",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        ["`code`", "`string`", "required", "What goes on the clipboard."],
        ["`tooltip`", "`string`", '`"Copy"`', "Its name, until it's copied."],
      ],
      after: ["All other `TooltipIconButton` props are forwarded."],
    },
    {
      title: "CodeBlockDownload",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        ["`code`", "`string`", "required", "What goes in the file."],
        [
          "`filename`",
          "`string`",
          '`"snippet.txt"`',
          "The name it's saved as.",
        ],
        ["`tooltip`", "`string`", '`"Download"`', "Its name."],
      ],
      after: ["All other `TooltipIconButton` props are forwarded."],
    },
    {
      title: "useHighlightedLines",
      head: ["Argument", "Type", "Default", "Description"],
      rows: [
        ["`code`", "`string`", "required", "The code to colour."],
        ["`language`", "`string`", "", "Shiki's name for its language."],
      ],
      after: [
        "Returns each line's tokens, plain until Shiki has coloured them. Render a line with `CodeTokens`.",
      ],
    },
  ],
}

export default doc
