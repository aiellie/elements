import type { DocContent } from "@/lib/docs"

const doc: DocContent = {
  intro: [
    "Audio Player plays a clip where it stands, like a voice note or a spoken reply: a play button that becomes pause, the clip's shape to scrub through, and the time. An `audio` element underneath does the playing, and the parts read its state.",
    "It's built from parts, so a player without the waveform, or with something else in the middle, is the same pieces arranged differently.",
  ],
  gettingStarted: {
    steps: [
      {
        title: "Lay out the parts",
        body: [
          "`peaks` is the clip's loudness along its length, each from 0 to 1. Work it out once when the clip is made and keep it with the message.",
        ],
        code: {
          title: "components/voice-note.tsx",
          code: `import {
  AudioPlayer,
  AudioPlayerButton,
  AudioPlayerTime,
  AudioPlayerWaveform,
} from "@/components/aiellie/audio-player"

export function VoiceNote({ src, peaks }: { src: string; peaks: number[] }) {
  return (
    <AudioPlayer src={src}>
      <AudioPlayerButton />
      <AudioPlayerWaveform peaks={peaks} />
      <AudioPlayerTime />
    </AudioPlayer>
  )
}`,
        },
      },
    ],
  },
  anatomy: {
    code: `<div data-slot="audio-player" data-playing>
  <audio />
  <button data-slot="audio-player-button" />
  <div data-slot="audio-player-waveform">
    {/* a bar per peak */}
    <input type="range" /> {/* invisible, over the bars */}
  </div>
  <span data-slot="audio-player-time" />
</div>`,
    body: [
      "Seeking is a range input laid over the bars, so a press lands where it lands and the arrow keys step through the clip.",
      "The time uses tabular figures, so the digits don't shift the row as they tick. A blob URL reports its length late, so pass `duration` to show it straight away.",
    ],
  },
  examples: [
    {
      title: "Without the waveform",
      body: [
        "Leave a part out, or read the state yourself with `useAudioPlayer` inside the player.",
      ],
      code: {
        title: "components/voice-note.tsx",
        code: `<AudioPlayer src={src} className="w-fit">
  <AudioPlayerButton />
  <AudioPlayerTime />
</AudioPlayer>`,
      },
    },
  ],
  api: [
    {
      title: "AudioPlayer",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        ["`src`", "`string`", "required", "The clip."],
        [
          "`duration`",
          "`number`",
          "",
          "Its length in seconds, shown until the file says.",
        ],
      ],
      after: ["All other `div` props are forwarded."],
    },
    {
      title: "AudioPlayerWaveform",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        [
          "`peaks`",
          "`number[]`",
          "required",
          "The loudness along the clip, from 0 to 1.",
        ],
        ["`label`", "`string`", '`"Seek"`', "Names the slider."],
      ],
    },
    {
      title: "useAudioPlayer",
      head: ["Field", "Type", "Default", "Description"],
      rows: [
        ["`playing`", "`boolean`", "", ""],
        ["`time`", "`number`", "", "Seconds played."],
        ["`duration`", "`number`", "", "Seconds in all."],
        ["`toggle`", "`() => void`", "", "Plays or pauses."],
        [
          "`seek`",
          "`(fraction: number) => void`",
          "",
          "Jumps to a point, from 0 to 1.",
        ],
      ],
      after: [
        "`AudioPlayerButton` takes the props of `TooltipIconButton`, and `AudioPlayerTime` those of a `span`.",
      ],
    },
  ],
}

export default doc
