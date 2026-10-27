import type { DocContent } from "@/lib/docs"

const doc: DocContent = {
  intro: [
    "Orb is the assistant as a sphere of moving colour, for a voice screen where there are no words to look at. It has five states, `idle`, `listening`, `thinking`, `speaking` and `asleep`, and each one moves differently: a slow breath at rest, a spin while thinking, a pulse while speaking. While listening or speaking it swells with `level`, the loudness of the voice.",
    "The look comes from `seed`. A preset's name, like `aiellie` or `openai`, gives that preset, and any other word turns into a look of its own that's the same on every machine, so a product can theme its orb with one word.",
  ],
  gettingStarted: {
    steps: [
      {
        title: "Show the assistant's state",
        code: {
          title: "components/voice-call.tsx",
          code: `import { Orb, type OrbState } from "@/components/aiellie/orb"

export function VoiceCall({ state }: { state: OrbState }) {
  return <Orb state={state} size={160} />
}`,
        },
      },
      {
        title: "Follow the voice",
        body: [
          "Pass `level`, from 0 to 1, as often as you measure it. An analyser on the microphone stream, or on the reply's playback, gives you the number.",
        ],
        code: {
          title: "components/voice-call.tsx",
          code: `<Orb state="listening" level={level} />`,
        },
      },
    ],
  },
  anatomy: {
    code: `<div data-slot="orb" data-state="speaking" role="img">
  <div> {/* swells with level */}
    <div> {/* the state's motion */}
      <canvas /> {/* the shader */}
    </div>
  </div>
  <span role="status" /> {/* the state, read out when it changes */}
</div>`,
    body: [
      "The surface is the `Warp` shader from `@paper-design/shaders-react`, drawn with WebGL. The motion stops under reduced motion and the colours keep moving slowly.",
      "Screen readers hear it as an image named by its state, and hear the new state when it changes.",
    ],
  },
  examples: [
    {
      title: "Seeds",
      body: [
        "Presets keep the house tuning. Any other word sets the colours, the shape and how fast it moves.",
      ],
      sample: "orb/seeds",
    },
  ],
  api: [
    {
      title: "Orb",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        [
          "`state`",
          '`"idle" | "listening" | "thinking" | "speaking" | "asleep"`',
          '`"idle"`',
          "",
        ],
        ["`size`", "`number`", "`160`", "The diameter in pixels."],
        [
          "`seed`",
          "`string`",
          '`"aiellie"`',
          "A preset's name, or any word for a look of its own.",
        ],
        [
          "`colors`",
          "`[string, string, string]`",
          "",
          "Replaces the seed's colours and keeps the rest of its look.",
        ],
        [
          "`level`",
          "`number`",
          "`0`",
          "How loud the voice is, from 0 to 1. Read while listening or speaking.",
        ],
      ],
      after: [
        "All other `div` props are forwarded. `ORB_PRESETS` lists the presets: `aiellie`, `openai`, `google`, `anthropic`, `x` and `deepseek`.",
      ],
    },
  ],
}

export default doc
