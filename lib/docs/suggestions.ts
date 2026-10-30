import type { DocContent } from "@/lib/docs"

const doc: DocContent = {
  intro: [
    "Suggestions is a row of prompts someone can pick instead of typing, like the starters on an empty chat or the follow-ups after a reply. The set arrives together, each one a beat after the one before, and each is an outline `Button`, so a pick can send at once or fill the composer.",
  ],
  gettingStarted: {
    steps: [
      {
        title: "Offer a few prompts",
        body: [
          "`Suggestion` is a `Button`, so `onClick` does whatever a pick should.",
        ],
        code: {
          title: "components/starters.tsx",
          code: `import { Suggestion, Suggestions } from "@/components/aiellie/suggestions"

const PROMPTS = ["Explain a concept simply", "Draft a short email"]

export function Starters({ onPick }: { onPick: (prompt: string) => void }) {
  return (
    <Suggestions>
      {PROMPTS.map((prompt) => (
        <Suggestion key={prompt} onClick={() => onPick(prompt)}>
          {prompt}
        </Suggestion>
      ))}
    </Suggestions>
  )
}`,
        },
        after: [
          "Show them while the chat is empty, and swap them for the composer's own text once someone starts typing.",
        ],
      },
    ],
  },
  anatomy: {
    code: `<div data-slot="suggestions">
  <button data-slot="suggestion" /> {/* Button, outline, sm */}
</div>`,
    body: [
      "The row wraps, or with `scroll` stays on one line and scrolls sideways, fading an edge while more of the set is hidden past it. Each child fades and rises in 70ms after the one before it, up to the sixth, from `tw-animate-css`; with reduced motion they're simply there.",
    ],
  },
  examples: [
    {
      title: "Fill the composer",
      body: [
        "Hold the composer's text yourself and a pick can set it, so someone can change the prompt before it goes.",
      ],
      sample: "suggestions/fill-composer",
    },
    {
      title: "Replay with a fresh set",
      body: [
        "The row only animates as it mounts. Key it to the set, like the reply it follows, so new follow-ups arrive the same way.",
      ],
      code: {
        code: `<Suggestions key={reply.id}>
  {reply.followUps.map((followUp) => (
    <Suggestion key={followUp} onClick={() => send(followUp)}>
      {followUp}
    </Suggestion>
  ))}
</Suggestions>`,
      },
    },
    {
      title: "One row over the composer",
      body: [
        "Starters sit right above the composer, so a pick is next to where the prompt goes. `scroll` keeps them to one line on a phone rather than wrapping the composer upwards, and `justify-center-safe` centres them only while they fit.",
      ],
      code: {
        code: `<Suggestions scroll className="justify-center-safe pb-2">
  {PROMPTS.map((prompt) => (
    <Suggestion key={prompt} onClick={() => send(prompt)}>
      {prompt}
    </Suggestion>
  ))}
</Suggestions>
<Composer />`,
      },
    },
    {
      title: "A quieter look",
      body: [
        "`variant` and `size` are the `Button`'s, so a row under a reply can be `ghost`.",
      ],
      code: {
        code: `<Suggestion variant="ghost" size="xs">Shorter</Suggestion>`,
      },
    },
  ],
  api: [
    {
      title: "Suggestions",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        [
          "`scroll`",
          "`boolean`",
          "`false`",
          "Keeps the set on one line, scrolling sideways instead of wrapping.",
        ],
        ["`className`", "`string`", "", "Merged onto the row."],
      ],
      after: ["All other `div` props are forwarded."],
    },
    {
      title: "Suggestion",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        [
          "`variant`",
          "`Button` variant",
          '`"outline"`',
          "Any of the `Button`'s variants.",
        ],
        ["`size`", "`Button` size", '`"sm"`', "Any of the `Button`'s sizes."],
      ],
      after: ["All other `Button` props are forwarded."],
    },
  ],
}

export default doc
