import type { DocContent } from "@/lib/docs"

const doc: DocContent = {
  intro: [
    "Dictate button turns speech into text in a field you already have. Press it and talk: what is said is added to the field's value as it is said, with a live [Waveform](/components/waveform) in the button while it listens. It uses the browser's own speech recognition, so there is no service to set up, and it renders nothing in a browser without one.",
  ],
  gettingStarted: {
    steps: [
      {
        title: "Put it beside the field",
        body: [
          "Share the field's value and setter with it. It writes `value` plus what has been said so far, so anything typed before stays.",
        ],
        code: {
          title: "components/message-field.tsx",
          code: `"use client"

import * as React from "react"

import { DictateButton } from "@/components/aiellie/dictate-button"
import { Input } from "@/components/ui/input"

export function MessageField() {
  const [value, setValue] = React.useState("")

  return (
    <div className="flex items-center gap-2">
      <Input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        aria-label="Message"
      />
      <DictateButton value={value} onValueChange={setValue} />
    </div>
  )
}`,
        },
      },
      {
        title: "Say when it can't listen",
        body: [
          "`onError` gets the recognizer's error code. `not-allowed` means the microphone is blocked; the others are rarer. Stopping and silence aren't errors and never reach it.",
        ],
        code: {
          code: `<DictateButton
  value={value}
  onValueChange={setValue}
  onError={(code) => toast.add({ title: "Dictation stopped", description: code })}
/>`,
        },
      },
    ],
  },
  anatomy: {
    code: `<button data-slot="dictate-button" data-listening> {/* a TooltipIconButton */}
  <svg /> {/* a mic while idle */}
  {/* while listening: */}
  <div data-slot="waveform" />
  <svg /> {/* stop */}
</button>`,
    body: [
      "Idle, it is a 28px round icon button. While listening it widens into a pill in the `live` color, with a 16-bar waveform and a stop glyph, and its tooltip names the next press. The waveform asks for the microphone itself, since the recognizer keeps its audio to itself; without that permission it still shows, resting.",
      "If the value changes to something it didn't write, because someone typed or the message was sent, it stops listening, so the draft is theirs again. The language comes from `lang`, then the page's `lang` attribute, then the browser's.",
    ],
  },
  examples: [
    {
      title: "In a message box, with errors",
      body: [
        "Try it with the microphone blocked to see the error come through.",
      ],
      sample: "dictate-button/errors",
    },
    {
      title: "Another language",
      body: ["Set `lang` to a BCP 47 tag to listen for that language."],
      code: {
        code: `<DictateButton lang="fr-FR" value={value} onValueChange={setValue} />`,
      },
    },
  ],
  api: [
    {
      title: "DictateButton",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        [
          "`value`",
          "`string`",
          "required",
          "The field's current text. What is said is added after it.",
        ],
        [
          "`onValueChange`",
          "`(value: string) => void`",
          "required",
          "Called with `value` plus what has been said so far, as it is said.",
        ],
        [
          "`lang`",
          "`string`",
          "the page's language",
          "The language to listen for.",
        ],
        [
          "`onError`",
          "`(error: string) => void`",
          "",
          "Called with the recognizer's error code, like `not-allowed`.",
        ],
        ["`tooltip`", "`string`", '`"Dictate"`', "The label while idle."],
        [
          "`stopTooltip`",
          "`string`",
          '`"Stop dictating"`',
          "The label while listening.",
        ],
        [
          "`side`",
          '`"top" | "bottom" | "left" | "right"`',
          '`"top"`',
          "Where the tooltip opens.",
        ],
        ["`className`", "`string`", "", "Merged onto the button."],
      ],
      after: [
        "All other `TooltipIconButton` props are forwarded, except `onClick`, which it sets itself.",
      ],
    },
  ],
}

export default doc
