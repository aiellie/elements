import type { DocContent } from "@/lib/docs"

const doc: DocContent = {
  intro: [
    "Transcript shows speech as it becomes text. Each `TranscriptSegment` is a line, with the speaker's name before it. A line the recogniser is still guessing at is `interim`: it shimmers in muted ink until it settles, and screen readers skip it until then, so they never read out words that change.",
    "The log keeps the newest line in view while you're at the bottom, and stays where you are once you scroll up to reread.",
  ],
  gettingStarted: {
    steps: [
      {
        title: "Render the lines",
        body: [
          "Mark the line still being heard as `interim`, and drop the mark when the recogniser commits to it.",
        ],
        code: {
          title: "components/call-transcript.tsx",
          code: `import {
  Transcript,
  TranscriptSegment,
} from "@/components/aiellie/transcript"

type Line = { id: string; speaker: string; text: string; final: boolean }

export function CallTranscript({ lines }: { lines: Line[] }) {
  return (
    <Transcript>
      {lines.map((line) => (
        <TranscriptSegment
          key={line.id}
          speaker={line.speaker}
          interim={!line.final}
        >
          {line.text}
        </TranscriptSegment>
      ))}
    </Transcript>
  )
}`,
        },
      },
    ],
  },
  anatomy: {
    code: `<div data-slot="transcript" role="log" aria-live="polite">
  <p data-slot="transcript-segment" data-interim>
    <span data-slot="transcript-speaker" />
    <span /> {/* the words */}
  </p>
</div>`,
    body: [
      "It's a polite live region, so finished lines are read out without interrupting. It's 256px tall at most and scrolls inside itself. Set your own height with `className`.",
      "The shimmer comes from shadcn's `tailwind.css`, and stops under reduced motion.",
    ],
  },
  examples: [
    {
      title: "Dictation",
      body: ["Leave out `speaker` for a single voice."],
      sample: "transcript/dictation",
    },
  ],
  api: [
    {
      title: "Transcript",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [["`children`", "`ReactNode`", "", "The segments."]],
      after: ["All other `div` props are forwarded."],
    },
    {
      title: "TranscriptSegment",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        ["`speaker`", "`string`", "", "Who said it."],
        [
          "`interim`",
          "`boolean`",
          "`false`",
          "Still a guess: it shimmers, and screen readers skip it.",
        ],
      ],
      after: ["All other `p` props are forwarded."],
    },
  ],
}

export default doc
