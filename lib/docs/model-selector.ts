import type { DocContent } from "@/lib/docs"

const doc: DocContent = {
  intro: [
    "Model selector picks the model a reply comes from. The trigger shows the chosen model with its vendor's mark; the menu lists every model grouped by vendor, with an optional search for a long list. Models come in as data, the same `ModelOption` list the chat block sends to its route, so the ids it holds are ready to pass to the AI SDK.",
  ],
  gettingStarted: {
    steps: [
      {
        title: "Pass the models and the chosen one",
        body: [
          "`MODELS` from `@/lib/models` is a starting list. Replace it with the models you serve; any Vercel AI Gateway id works.",
        ],
        code: {
          title: "components/composer-model.tsx",
          code: `"use client"

import * as React from "react"

import { ModelSelector } from "@/components/aiellie/model-selector"
import { MODELS } from "@/lib/models"

export function ComposerModel() {
  const [model, setModel] = React.useState(MODELS[0].id)

  return (
    <ModelSelector models={MODELS} value={model} onValueChange={setModel} />
  )
}`,
        },
      },
      {
        title: "Send the choice with each message",
        body: [
          "The value is the gateway id, `vendor/model`, so the route can hand it straight to the gateway.",
        ],
        code: {
          title: "app/api/chat/route.ts",
          code: `import { convertToModelMessages, streamText } from "ai"

export async function POST(req: Request) {
  const { messages, model } = await req.json()

  const result = streamText({
    model,
    messages: await convertToModelMessages(messages),
  })

  return result.toUIMessageStreamResponse()
}`,
        },
      },
    ],
  },
  anatomy: {
    code: `<button aria-expanded> {/* render, a small outline Button by default */}
  <svg /> {/* the vendor's mark */}
  <span class="sr-only">{label}: </span>
  {selected.name} {/* or the placeholder */}
  <svg /> {/* a chevron, turned while open */}
</button>

<div data-slot="menu-content">
  <input /> {/* only with showSearch */}
  <div data-slot="menu-radio-group"> {/* one per vendor, in the order they first appear */}
    <div data-slot="menu-group-label" /> {/* Anthropic, OpenAI, … */}
    <div data-slot="menu-radio-item" /> {/* one per model */}
  </div>
  <div data-slot="menu-separator" /> {/* between vendors */}
</div>`,
    body: [
      "Groups keep the order their first model has in the list, so there's nothing to sort. Choosing a model closes the menu, unlike Menu's own radio rows, since a model is chosen once. A `disabled` model is listed but can't be chosen, for one the current plan doesn't include. The search takes focus as the menu opens, so it's off by default and only pays off in a long list.",
    ],
  },
  examples: [
    {
      title: "Models a plan doesn't include",
      body: [
        "Claude Opus 5.5 is `disabled` here: it shows in the list, but choosing it does nothing.",
      ],
      sample: "model-selector/availability",
    },
    {
      title: "Placeholder and trigger",
      body: [
        "While `value` matches no model the trigger shows `placeholder`. `render` swaps the trigger's button, here for a ghost one in a composer's tray.",
      ],
      sample: "model-selector/ghost",
    },
    {
      title: "Search a long list",
      body: ["`showSearch` adds a search box that matches model names."],
      code: {
        code: `<ModelSelector models={MODELS} value={model} onValueChange={setModel} showSearch />`,
      },
    },
  ],
  api: [
    {
      title: "ModelSelector",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        [
          "`models`",
          "`ModelOption[]`",
          "required",
          "The models to list, grouped by vendor in the order given.",
        ],
        ["`value`", "`string`", "required", "The chosen model's `id`."],
        [
          "`onValueChange`",
          "`(value: string) => void`",
          "required",
          "Called with the `id` chosen.",
        ],
        [
          "`label`",
          "`string`",
          '`"Model"`',
          "What is being chosen, read out ahead of the model's name.",
        ],
        [
          "`placeholder`",
          "`string`",
          '`"Select a model"`',
          "Stands in the trigger while `value` matches none of `models`.",
        ],
        [
          "`showSearch`",
          "`boolean`",
          "`false`",
          "Adds a search box above the list.",
        ],
        [
          "`render`",
          "`ReactElement`",
          '`<Button variant="outline" size="sm" />`',
          "The trigger's element.",
        ],
        [
          "`side` / `align`",
          "`MenuContent` placement",
          "",
          "Where the menu opens.",
        ],
      ],
      after: ["All other `MenuTrigger` props are forwarded to the trigger."],
    },
    {
      title: "ModelOption",
      head: ["Field", "Type", "Description"],
      rows: [
        [
          "`id`",
          "`string`",
          "Its Vercel AI Gateway id, `vendor/model`. What `value` holds while it is chosen.",
        ],
        ["`name`", "`string`", "What the row and the trigger say."],
        [
          "`vendor`",
          '`"claude" | "openai" | "gemini" | "grok" | "deepseek" | "mistral" | "v0"`',
          "Which mark it wears and which group it goes in.",
        ],
        [
          "`vendorId`",
          "`string`",
          "Its id at the vendor's own API, where that isn't the part of `id` after the slash.",
        ],
        ["`disabled`", "`boolean`", "Listed, but can't be chosen."],
      ],
    },
  ],
}

export default doc
