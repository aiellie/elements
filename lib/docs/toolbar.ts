import type { DocContent } from "@/lib/docs"

const doc: DocContent = {
  intro: [
    "Toolbar is a row of compact controls that works as one stop on the keyboard: Tab moves into it once, the arrow keys move between its buttons. It is Base UI's toolbar with this registry's surface on it, plus a `tooltip` on each button so an icon is never left to explain itself.",
  ],
  gettingStarted: {
    steps: [
      {
        title: "Lay out the controls",
        body: [
          "Give the toolbar and each group an `aria-label`. Buttons that switch something on take `aria-pressed`, which also gives them the pressed fill.",
        ],
        code: {
          title: "components/format-bar.tsx",
          code: `"use client"

import * as React from "react"
import { TextBoldIcon, TextItalicIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  Toolbar,
  ToolbarButton,
  ToolbarGroup,
} from "@/components/aiellie/toolbar"

export function FormatBar() {
  const [bold, setBold] = React.useState(false)
  const [italic, setItalic] = React.useState(false)

  return (
    <Toolbar aria-label="Formatting">
      <ToolbarGroup aria-label="Text style">
        <ToolbarButton
          aria-label="Bold"
          tooltip="Bold"
          aria-pressed={bold}
          onClick={() => setBold(!bold)}
        >
          <HugeiconsIcon aria-hidden icon={TextBoldIcon} />
        </ToolbarButton>
        <ToolbarButton
          aria-label="Italic"
          tooltip="Italic"
          aria-pressed={italic}
          onClick={() => setItalic(!italic)}
        >
          <HugeiconsIcon aria-hidden icon={TextItalicIcon} />
        </ToolbarButton>
      </ToolbarGroup>
    </Toolbar>
  )
}`,
        },
      },
      {
        title: "Open a menu from it",
        body: [
          "Make the `ToolbarButton` the menu's trigger, rather than wrapping it in one, so the arrow keys still reach it.",
        ],
        code: {
          code: `<Menu>
  <MenuTrigger render={<ToolbarButton aria-label="More" />}>
    <HugeiconsIcon aria-hidden icon={MoreHorizontalIcon} />
  </MenuTrigger>
  <MenuContent side="bottom" align="end">{rows}</MenuContent>
</Menu>`,
        },
      },
    ],
  },
  anatomy: {
    code: `<div data-slot="toolbar" role="toolbar" data-orientation>
  <div data-slot="toolbar-group" role="group">
    <button data-slot="toolbar-button" aria-pressed /> {/* with a tooltip when given one */}
  </div>
  <div data-slot="toolbar-separator" role="separator" />
  <input data-slot="toolbar-input" />
  <a data-slot="toolbar-link" />
</div>`,
    body: [
      "The toolbar is a bordered, slightly translucent tray with a 4px pad. Buttons are 28px with 14px icons; they rest at 55% ink, fill on hover and while pressed, and shrink a little under the pointer. A vertical separator is 16px tall and centred on the buttons beside it. `toolbarButton` is exported too, for a control you build yourself that should look the same.",
      "`ToolbarLink` is the same control as a real anchor, so a modified click still opens a new tab. A tooltip goes on the button itself, never on a wrapper, which would sit between the row and the control the arrow keys walk to.",
    ],
  },
  examples: [
    {
      title: "Vertical",
      body: [
        'Set `orientation="vertical"` on the toolbar; its groups and separators follow it. So do the arrow keys, moving up and down, and the tooltips are best opened to the side.',
      ],
      sample: "toolbar/vertical",
    },
    {
      title: "Without the tray",
      body: [
        "For actions under a message, drop the border and fill with `className` and keep the keyboard behaviour.",
      ],
      sample: "toolbar/message-actions",
    },
  ],
  api: [
    {
      title: "Toolbar",
      body: ["Base UI's `Toolbar.Root`. Takes all its props."],
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        [
          "`orientation`",
          '`"horizontal" | "vertical"`',
          '`"horizontal"`',
          "Lays the controls out in a row or a column, and which arrow keys move between them.",
        ],
        [
          "`loop`",
          "`boolean`",
          "`true`",
          "Whether focus wraps from the last control to the first.",
        ],
        ["`className`", "`string`", "", "Merged onto the root."],
      ],
    },
    {
      title: "ToolbarButton",
      body: ["Base UI's `Toolbar.Button`, plus a tooltip."],
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        [
          "`tooltip`",
          "`ReactNode`",
          "",
          "The button's name, shown on hover and focus.",
        ],
        [
          "`tooltipSide`",
          '`"top" | "bottom" | "left" | "right"`',
          '`"top"`',
          "Where the tooltip opens.",
        ],
        [
          "`aria-pressed`",
          "`boolean`",
          "",
          "Marks a toggle as on, and gives it the pressed fill.",
        ],
        [
          "`disabled`",
          "`boolean`",
          "`false`",
          "Dims the button. It stays focusable, as Base UI's toolbar keeps it.",
        ],
      ],
    },
    {
      title: "Other parts",
      head: ["Export", "Renders", "Notes"],
      rows: [
        [
          "`ToolbarGroup`",
          "`div`",
          "Groups related controls. Give it an `aria-label`. It takes the toolbar's orientation.",
        ],
        [
          "`ToolbarSeparator`",
          "`div`",
          "A hairline between groups, vertical in a row and horizontal in a column.",
        ],
        [
          "`ToolbarInput`",
          "`input`",
          "A compact 28px field that takes part in arrow-key movement.",
        ],
        ["`ToolbarLink`", "`a`", "Looks like a button, behaves like a link."],
        [
          "`toolbarButton`",
          "`string`",
          "The button's class string, for controls you build yourself.",
        ],
      ],
    },
  ],
}

export default doc
