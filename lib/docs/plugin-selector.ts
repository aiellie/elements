import type { DocContent } from "@/lib/docs"

const doc: DocContent = {
  intro: [
    "Plugin selector turns on the tools a reply may use, like GitHub or Slack. Several can be on at once: the trigger shows up to three of their marks and a count, and the menu lists them all with a tick each. It comes in three parts, so the same list can go in a menu of its own or show as removable chips in a composer.",
  ],
  gettingStarted: {
    steps: [
      {
        title: "List the plugins",
        body: [
          "Each `PluginOption` needs an `id`, a `name` and a Hugeicons glyph. `value` holds the ids turned on.",
        ],
        code: {
          title: "components/composer-plugins.tsx",
          code: `"use client"

import * as React from "react"
import { Github01Icon, SlackIcon } from "@hugeicons/core-free-icons"

import {
  PluginSelector,
  type PluginOption,
} from "@/components/aiellie/plugin-selector"

const PLUGINS: PluginOption[] = [
  { id: "github", name: "GitHub", icon: Github01Icon },
  { id: "slack", name: "Slack", icon: SlackIcon },
]

export function ComposerPlugins() {
  const [plugins, setPlugins] = React.useState<string[]>([])

  return (
    <PluginSelector
      plugins={PLUGINS}
      value={plugins}
      onValueChange={setPlugins}
    />
  )
}`,
        },
      },
      {
        title: "Give the model those tools",
        body: [
          "Send the ids with the message and pick the matching tools on the server.",
        ],
        code: {
          title: "app/api/chat/route.ts",
          code: `const { messages, plugins } = await req.json()

const result = streamText({
  model,
  messages: await convertToModelMessages(messages),
  tools: Object.fromEntries(
    Object.entries(TOOLS).filter(([id]) => plugins.includes(id))
  ),
})`,
        },
      },
    ],
  },
  anatomy: {
    code: `<button data-slot="plugin-selector"> {/* render, an extra-small outline Button by default */}
  <svg /> {/* up to three marks of plugins turned on, or a puzzle piece */}
  <span class="sr-only">{label}: GitHub, Slack</span>
  <span aria-hidden>2 plugins</span> {/* the one name, a count, or the label */}
  <svg /> {/* a chevron */}
</button>

<div data-slot="menu-content">
  <div data-slot="menu-group">
    <div data-slot="menu-group-label" /> {/* Plugins */}
    <div data-slot="menu-checkbox-item" /> {/* PluginSelectorItems, one per plugin */}
  </div>
  <div data-slot="menu-item" /> {/* Turn off all plugins, once any are on */}
</div>

<div data-slot="plugin-chips">
  <span data-slot="plugin-chip" /> {/* mark, which becomes a remove button on hover, and name */}
</div>`,
    body: [
      "`value` always comes back in the order of `plugins`, whatever order they were ticked in. The menu stays open while ticking, so several can be turned on in one go. A chip's mark turns into a cross on hover or keyboard focus, so the chip removes itself without a second button.",
    ],
  },
  examples: [
    {
      title: "Chips in the composer",
      body: [
        "`PluginChips` shows what's on, each with its own remove button, beside or under the message.",
      ],
      sample: "plugin-selector/chips",
    },
    {
      title: "In a submenu",
      body: [
        "`PluginSelectorItems` is just the rows, for a menu of your own, like a Plugins submenu of the [Add menu](/components/add-menu).",
      ],
      sample: "plugin-selector/submenu",
    },
  ],
  api: [
    {
      title: "PluginSelector",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        [
          "`plugins`",
          "`PluginOption[]`",
          "required",
          "Every plugin, in the order to list them.",
        ],
        [
          "`value`",
          "`string[]`",
          "required",
          "The ids of the plugins turned on.",
        ],
        [
          "`onValueChange`",
          "`(value: string[]) => void`",
          "required",
          "Called with the new ids, in the order of `plugins`.",
        ],
        [
          "`label`",
          "`string`",
          '`"Plugins"`',
          "What is being chosen, read out ahead of the names, and shown while none are on.",
        ],
        [
          "`render`",
          "`ReactElement`",
          '`<Button variant="outline" size="xs" />`',
          "The trigger's element.",
        ],
        [
          "`side` / `align`",
          "`MenuContent` placement",
          "",
          "Where the menu opens.",
        ],
      ],
    },
    {
      title: "PluginSelectorItems and PluginChips",
      body: [
        "Both take `plugins`, `value` and `onValueChange`, the same as `PluginSelector`.",
      ],
      head: ["Export", "Renders", "Notes"],
      rows: [
        [
          "`PluginSelectorItems`",
          "`MenuCheckboxItem`s",
          "The rows alone, for a menu of your own.",
        ],
        [
          "`PluginChips`",
          "`div`",
          "One chip per plugin turned on, or nothing when none are. Takes `className`.",
        ],
      ],
    },
    {
      title: "PluginOption",
      head: ["Field", "Type", "Description"],
      rows: [
        ["`id`", "`string`", "What `value` holds while it is on."],
        ["`name`", "`string`", "Shown in its row, its chip and the trigger."],
        ["`icon`", "`IconSvgElement`", "A Hugeicons glyph."],
      ],
    },
  ],
}

export default doc
