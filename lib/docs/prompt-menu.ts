import type { DocContent } from "@/lib/docs"

const doc: DocContent = {
  intro: [
    "Prompt Menu picks the preset instructions the assistant answers under, like Concise or Code reviewer, from beside the composer. Each prompt says under its name how it changes the answer, and they're grouped under headings.",
    "None is the first row, because answering with no preset is the usual case. The button shows the chosen prompt's name, and darkens while one is set.",
  ],
  gettingStarted: {
    steps: [
      {
        title: "Keep the choice",
        code: {
          title: "components/composer-prompt.tsx",
          code: `"use client"

import * as React from "react"

import { PromptMenu } from "@/components/aiellie/prompt-menu"

export function ComposerPrompt() {
  const [prompt, setPrompt] = React.useState("")
  return <PromptMenu value={prompt} onValueChange={setPrompt} />
}`,
        },
      },
      {
        title: "Send the instructions",
        body: [
          "Each prompt carries its text in `prompt`. Add it to the system message in your route.",
        ],
        code: {
          title: "lib/system.ts",
          code: `import { PROMPTS } from "@/components/aiellie/prompt-menu"

export function systemFor(id: string) {
  return PROMPTS.find((prompt) => prompt.id === id)?.prompt
}`,
        },
      },
    ],
  },
  anatomy: {
    code: `<button data-slot="prompt-menu" data-active /> {/* menu trigger */}
<div data-slot="menu-content"> {/* in a portal */}
  <div data-slot="menu-radio-group">
    {/* None */}
    {/* per group: a rule, a heading, then a row per prompt */}
  </div>
</div>`,
    body: [
      "It's the aiellie `Menu` with radio rows, so one prompt is chosen at a time, and the menu closes when you pick one. A long list scrolls inside the menu.",
    ],
  },
  examples: [
    {
      title: "Your own prompts",
      body: [
        "`prompts` and `groups` replace the presets, which are sample data to start from.",
      ],
      sample: "prompt-menu/your-prompts",
    },
  ],
  api: [
    {
      title: "PromptMenu",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        [
          "`value`",
          "`string`",
          "required",
          'The chosen prompt\'s id, or `""` for none.',
        ],
        ["`onValueChange`", "`(value: string) => void`", "required", ""],
        ["`prompts`", "`Prompt[]`", "`PROMPTS`", ""],
        [
          "`groups`",
          "`PromptGroup[]`",
          "`PROMPT_GROUPS`",
          "The headings, in order.",
        ],
        [
          "`label`",
          "`string`",
          '`"Prompt"`',
          "Shown while no prompt is chosen.",
        ],
        ["`side`, `align`", "", "", "Where the menu opens."],
        [
          "`render`",
          "`ReactElement`",
          "a small ghost `Button`",
          "The button it renders as.",
        ],
      ],
      after: ["All other menu trigger props are forwarded."],
    },
    {
      title: "Prompt",
      head: ["Field", "Type", "Default", "Description"],
      rows: [
        ["`id`", "`string`", "required", ""],
        ["`name`", "`string`", "required", ""],
        [
          "`group`",
          "`string`",
          "required",
          "The id of the group it goes under.",
        ],
        ["`description`", "`string`", "required", "How the answer changes."],
        ["`prompt`", "`string`", "required", "The instructions to send."],
        ["`icon`", "`IconSvgElement`", "required", "A Hugeicons glyph."],
      ],
      after: ["A `PromptGroup` is `{ id, name, icon }`."],
    },
  ],
}

export default doc
