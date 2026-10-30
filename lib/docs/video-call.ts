import type { DocContent } from "@/lib/docs"

const doc: DocContent = {
  intro: [
    "Video Call is a live call with the assistant, like FaceTime. The assistant fills the stage as an `Orb`, your camera sits in a corner, and you talk in real time. The assistant sees your camera, one frame a second. Mute, camera and hang-up sit under the orb, and a transcript runs beside it.",
    "Calls run on [Gemini Live](https://ai.google.dev/gemini-api/docs/live). The browser talks to Gemini directly over a WebSocket, with a one-use token that your server mints, so your key never reaches the browser. Pass `mock` to fake the assistant with no key and no network, as the demo above does.",
  ],
  gettingStarted: {
    steps: [
      {
        title: "Add the token route",
        body: [
          "`live-token` installs a route at `app/api/live-token/route.ts`. It turns your key into a token that works once, for one minute, and only on the model and settings the route picks. Get a key from [Google AI Studio](https://aistudio.google.com/apikey) and put it in your environment.",
          "Anyone who can reach the route can start a call on your key, so put it behind your own sign-in before you deploy.",
        ],
        code: {
          title: ".env.local",
          code: `GEMINI_API_KEY=your-key`,
        },
      },
      {
        title: "Place the call",
        body: [
          "The call waits for the start button, and asks for the camera and microphone only then.",
        ],
        code: {
          title: "app/call/page.tsx",
          code: `import { VideoCall } from "@/components/aiellie/video-call"

export default function CallPage() {
  return <VideoCall name="Ellie" />
}`,
        },
      },
      {
        title: "Try it without a key",
        code: {
          title: "app/call/page.tsx",
          code: `<VideoCall mock name="Ellie" />`,
        },
      },
    ],
  },
  anatomy: {
    code: `<div data-slot="video-call" data-state="listening">
  <div data-slot="video-call-stage">
    <span role="status" /> {/* the state, the timer and the mic menu */}
    <div data-slot="orb" />
    <div data-slot="video-call-self" /> {/* your camera */}
    <div data-slot="video-call-controls" role="toolbar" />
  </div>
  <div data-slot="video-call-transcript">
    <div data-slot="transcript" />
  </div>
</div>`,
    body: [
      "`data-state` is `idle`, `connecting`, `listening`, `speaking` or `ended`. The orb thinks while connecting and sleeps once the call ends. While listening it swells with your voice, and while speaking with its own.",
      "The microphone goes to Gemini as 16-bit PCM in 100 ms chunks, and the camera as a 640px JPEG once a second, the most Gemini takes. Replies come back as 24 kHz audio and play in order. When you talk over the assistant, Gemini cuts the reply off and the rest of it is dropped.",
      "An audio and video session ends after two minutes unless Gemini compresses its context, so the token turns that on, along with session resumption. Gemini closes a connection after about ten minutes, and the call moves to a new one without dropping.",
      "The assistant's words settle in the transcript when its turn ends. Screen readers hear each line once it settles.",
    ],
  },
  examples: [
    {
      title: "From a call menu",
      body: [
        "Open the call from `CallMenu` in a dialog. `autoStart` places it as soon as it mounts, and `onEnd` closes the dialog.",
      ],
      sample: "video-call/from-call-menu",
    },
    {
      title: "Your own script",
      body: [
        "`mockLive` takes the assistant's lines, the lines it shows you saying when your microphone is off, and a time to hang up after. Pass the result as `transport`. A transport is a function from handlers to a session, so the same prop takes another provider's live API.",
      ],
      sample: "video-call/custom-transport",
    },
    {
      title: "Your own layout",
      body: [
        "`useLiveCall` is the call without the screen: its state, the transcript, the two streams and the controls.",
      ],
      code: {
        title: "components/voice-only.tsx",
        code: `"use client"

import { Orb } from "@/components/aiellie/orb"
import { useLiveCall } from "@/components/aiellie/video-call"
import { geminiLive } from "@/lib/live-call"

export function VoiceOnly() {
  const call = useLiveCall({
    transport: () => geminiLive(),
    defaultCameraOff: true,
  })

  return (
    <button onClick={call.state === "idle" || call.state === "ended" ? call.start : call.end}>
      <Orb state={call.state === "speaking" ? "speaking" : "listening"} />
    </button>
  )
}`,
      },
    },
  ],
  api: [
    {
      title: "VideoCall",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        [
          "`transport`",
          "`LiveTransport`",
          "",
          "Where the assistant's side comes from. Overrides `mock` and `tokenUrl`.",
        ],
        [
          "`mock`",
          "`boolean`",
          "`false`",
          "Fakes the assistant, with no key and no network.",
        ],
        [
          "`tokenUrl`",
          "`string`",
          '`"/api/live-token"`',
          "The route that mints a Gemini Live token.",
        ],
        [
          "`frameInterval`",
          "`number`",
          "`1000`",
          "Milliseconds between camera frames. Anything under 1000 is raised to it.",
        ],
        [
          "`name`",
          "`string`",
          '`"Assistant"`',
          "Who the call is with, for the transcript and labels.",
        ],
        ["`seed`, `colors`", "", "", "Passed to the `Orb`."],
        [
          "`autoStart`",
          "`boolean`",
          "`false`",
          "Starts the call on mount instead of waiting for the button.",
        ],
        ["`defaultMuted`", "`boolean`", "`false`", ""],
        ["`defaultCameraOff`", "`boolean`", "`false`", ""],
        ["`showTranscript`", "`boolean`", "`true`", ""],
        [
          "`onStateChange`",
          '`(state: "idle" | "connecting" | "listening" | "speaking" | "ended") => void`',
          "",
          "",
        ],
        [
          "`onTranscript`",
          "`(segments: CallSegment[]) => void`",
          "",
          "Every settled line so far, each time one settles.",
        ],
        [
          "`onEnd`",
          '`(reason: "hangup" | "error" | "timeout") => void`',
          "",
          "",
        ],
      ],
      after: ["All other `div` props are forwarded to the root."],
    },
    {
      title: "geminiLive",
      head: ["Option", "Type", "Default", "Description"],
      rows: [
        [
          "`tokenUrl`",
          "`string`",
          '`"/api/live-token"`',
          "Answers a `POST` with `{ token, model }`.",
        ],
        ["`frameInterval`", "`number`", "`1000`", ""],
        [
          "`apiVersion`",
          "`string`",
          '`"v1beta"`',
          "The Gemini API version the token was minted for.",
        ],
      ],
    },
    {
      title: "mockLive",
      head: ["Option", "Type", "Default", "Description"],
      rows: [
        ["`replies`", "`string[]`", "", "What the assistant says, in turn."],
        [
          "`prompts`",
          "`string[]`",
          "",
          "What you're shown saying while your microphone is off.",
        ],
        [
          "`hangUpAfter`",
          "`number`",
          "",
          "Ends the call by itself after this many milliseconds.",
        ],
      ],
      after: [
        "With the microphone on, the mock listens to it and answers after you've been quiet for 800 ms. Talking while it speaks cuts it off.",
      ],
    },
  ],
}

export default doc
