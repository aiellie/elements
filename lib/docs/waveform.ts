import type { DocContent } from "@/lib/docs"

const doc: DocContent = {
  intro: [
    "Waveform shows that a microphone is hearing something: a row of thin bars that rise with the level of the audio and scroll along as it changes. Give it a `MediaStream`; while there is none, the bars rest low. It is the meter inside the [Dictate button](/components/dictate-button).",
  ],
  gettingStarted: {
    steps: [
      {
        title: "Get a stream",
        body: [
          "Ask for the microphone with `getUserMedia` and keep the stream in state. Stop its tracks when you're done, or the browser keeps showing the microphone in use.",
        ],
        code: {
          title: "components/recorder.tsx",
          code: `"use client"

import * as React from "react"

import { Waveform } from "@/components/aiellie/waveform"

export function Recorder() {
  const [stream, setStream] = React.useState<MediaStream | null>(null)

  React.useEffect(
    () => () => stream?.getTracks().forEach((track) => track.stop()),
    [stream]
  )

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={async () =>
          setStream(await navigator.mediaDevices.getUserMedia({ audio: true }))
        }
      >
        Record
      </button>
      <Waveform stream={stream} />
    </div>
  )
}`,
        },
      },
    ],
  },
  anatomy: {
    code: `<div data-slot="waveform" aria-hidden>
  <span /> {/* one per bar, scaled to the level it heard */}
</div>`,
    body: [
      "The bars are 2px wide and 14px tall at most, in `currentColor`, which is the `live` color unless you set another. Every 50ms the newest level enters at the end and the oldest leaves the start, so the row reads as recent history. It's decorative and hidden from screen readers: say what is happening in words beside it.",
      "With reduced motion the bars stay at rest. Nothing is recorded; the audio only passes through an analyser.",
    ],
  },
  examples: [
    {
      title: "From the microphone",
      body: ["Press Listen and allow the microphone."],
      sample: "waveform/microphone",
    },
    {
      title: "Color and length",
      body: [
        "`bars` sets how many there are, and a text color class recolors them.",
      ],
      code: {
        code: `<Waveform stream={stream} bars={48} className="text-muted-foreground" />`,
      },
    },
  ],
  api: [
    {
      title: "Waveform",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        [
          "`stream`",
          "`MediaStream | null`",
          "required",
          "The audio to follow, usually from `getUserMedia`. The bars rest while it is null.",
        ],
        ["`bars`", "`number`", "`24`", "How many bars to draw."],
        [
          "`className`",
          "`string`",
          "",
          "Merged onto the root. Its text color colors the bars.",
        ],
      ],
      after: ["All other `div` props are forwarded to the root."],
    },
  ],
}

export default doc
