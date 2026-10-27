import type { DocContent } from "@/lib/docs"

const doc: DocContent = {
  intro: [
    "Effort Menu sets how hard the model thinks, from the composer. The button shows the level as a few rising bars and its name; it opens a slider of six named levels, Off, Minimal, Low, Medium, High and Max, saying what the chosen one is for. The ids are the AI SDK's own reasoning levels, so the value goes straight to `streamText`.",
  ],
  gettingStarted: {
    steps: [
      {
        title: "Put it in the composer",
        code: {
          title: "components/chat-input.tsx",
          code: `"use client"

import * as React from "react"

import {
  Composer,
  ComposerFooter,
  ComposerInput,
  ComposerSubmit,
} from "@/components/aiellie/composer"
import { EffortMenu } from "@/components/aiellie/effort-menu"

export function ChatInput({ onSend }: { onSend: (text: string, effort: string) => void }) {
  const [effort, setEffort] = React.useState("medium")

  return (
    <Composer onSubmit={(text) => onSend(text, effort)}>
      <ComposerInput />
      <ComposerFooter>
        <EffortMenu value={effort} onValueChange={setEffort} className="me-auto" />
        <ComposerSubmit />
      </ComposerFooter>
    </Composer>
  )
}`,
        },
      },
      {
        title: "Hand it to the model",
        body: [
          "Send the level with the request and pass it as `reasoning`. Providers that can't think at a level ignore it.",
        ],
        code: {
          title: "app/api/chat/route.ts",
          code: `const { messages, effort } = await request.json()

const result = streamText({
  model,
  messages: await convertToModelMessages(messages),
  reasoning: effort,
})`,
        },
      },
    ],
  },
  anatomy: {
    code: `<button data-slot="effort-menu"> {/* popover trigger */}
  <span data-slot="effort-bars" />
  Medium
</button>
<div data-slot="effort-menu-content"> {/* popover, in a portal */}
  {/* label and level, the slider, what the level is for */}
</div>`,
    body: [
      "The slider is Base UI's, so arrow keys, Home and End move it, and it reads out the level's name rather than its number. Each stop is a dot on the track.",
      "It opens above the button by default, since it usually sits at the bottom of the page.",
    ],
  },
  examples: [
    {
      title: "In the composer's footer",
      sample: "effort-menu/in-composer",
    },
    {
      title: "Your own levels",
      body: [
        "`options` replaces the six. Their ids are whatever your route expects.",
      ],
      code: {
        code: `<EffortMenu
  options={[
    { id: "fast", name: "Fast", description: "Answers at once." },
    { id: "deep", name: "Deep", description: "Thinks it through first." },
  ]}
  value={effort}
  onValueChange={setEffort}
/>`,
      },
    },
  ],
  api: [
    {
      title: "EffortMenu",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        ["`value`", "`string`", "required", "The chosen level's id."],
        ["`onValueChange`", "`(value: string) => void`", "required", ""],
        [
          "`options`",
          "`EffortOption[]`",
          "`EFFORT_OPTIONS`",
          "The levels, lowest first.",
        ],
        [
          "`label`",
          "`string`",
          '`"Effort"`',
          "What is being chosen, shown in the panel and read out on the button.",
        ],
        ["`side`, `align`", "", '`"top"`, `"start"`', "Where the panel opens."],
        [
          "`render`",
          "`ReactElement`",
          "a small ghost `Button`",
          "The button it renders as.",
        ],
      ],
      after: ["All other popover trigger props are forwarded."],
    },
    {
      title: "EffortOption",
      head: ["Field", "Type", "Default", "Description"],
      rows: [
        ["`id`", "`string`", "required", ""],
        ["`name`", "`string`", "required", ""],
        [
          "`description`",
          "`string`",
          "required",
          "What the level is for, shown while it's chosen.",
        ],
      ],
    },
  ],
}

export default doc
