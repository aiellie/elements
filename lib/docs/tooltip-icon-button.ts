import type { DocContent } from "@/lib/docs"

const doc: DocContent = {
  intro: [
    "Tooltip icon button is a small ghost button that carries only an icon and names itself in a tooltip. The name goes into the button as screen-reader text too, so a row of icons stays labelled without any visible words. It is the button behind the menus, toolbars and message actions in this registry.",
  ],
  gettingStarted: {
    steps: [
      {
        title: "Add a button",
        body: [
          "Give it the icon as its child and the label as `tooltip`. It takes every prop `Button` does, so `onClick`, `disabled` and the rest work as usual.",
        ],
        code: {
          title: "components/copy-button.tsx",
          code: `"use client"

import { Copy01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { TooltipIconButton } from "@/components/aiellie/tooltip-icon-button"

export function CopyButton({ text }: { text: string }) {
  return (
    <TooltipIconButton
      tooltip="Copy"
      onClick={() => navigator.clipboard.writeText(text)}
    >
      <HugeiconsIcon aria-hidden icon={Copy01Icon} />
    </TooltipIconButton>
  )
}`,
        },
      },
      {
        title: "Use it as a trigger",
        body: [
          "It forwards its ref, so it can be the `render` of a Base UI trigger. The menu opens from it and the tooltip still shows on hover.",
        ],
        code: {
          code: `<MenuTrigger render={<TooltipIconButton tooltip="More" />}>
  <HugeiconsIcon aria-hidden icon={MoreHorizontalIcon} />
</MenuTrigger>`,
        },
      },
    ],
  },
  anatomy: {
    code: `<button data-slot="button"> {/* the tooltip's trigger */}
  {children} {/* the icon */}
  <span class="sr-only">{tooltip}</span>
</button>

<div data-slot="tooltip-content"> {/* on hover and focus */}
  {tooltip}
  <kbd data-slot="kbd">{shortcut}</kbd> {/* only with \`shortcut\` */}
</div>`,
    body: [
      "The button is 24px square with a 4px pad, so a 16px icon sits centred. The icon rests in `muted-foreground` and takes the foreground color on hover, and the button shrinks a little while pressed. Each button brings its own `TooltipProvider`, so it works without one higher up.",
    ],
  },
  examples: [
    {
      title: "Keyboard shortcut",
      body: [
        "`shortcut` adds the keys that do the same thing after the label, set as a `kbd`.",
      ],
      sample: "tooltip-icon-button/shortcut",
    },
    {
      title: "Tooltip side",
      body: [
        "The tooltip opens below by default. Set `side` where the space is, like `top` for a button at the bottom of the screen.",
      ],
      sample: "tooltip-icon-button/sides",
    },
    {
      title: "Size",
      body: [
        "`className` is merged last, so a larger button is a size class away. Keep the padding in step so the icon stays centred.",
      ],
      code: {
        code: `<TooltipIconButton tooltip="Send" className="size-8 p-2">
  <HugeiconsIcon aria-hidden icon={ArrowUp02Icon} />
</TooltipIconButton>`,
      },
    },
  ],
  api: [
    {
      title: "TooltipIconButton",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        [
          "`tooltip`",
          "`string`",
          "required",
          "The label, shown in the tooltip and read out as the button's name.",
        ],
        [
          "`shortcut`",
          "`string`",
          "",
          "Keys that do the same, shown after the label, like `⌘K`.",
        ],
        [
          "`side`",
          '`"top" | "bottom" | "left" | "right"`',
          '`"bottom"`',
          "Which side of the button the tooltip opens on.",
        ],
        [
          "`variant` / `size`",
          "`Button` variants",
          '`"ghost"` / `"icon"`',
          "Passed to the underlying `Button`.",
        ],
        [
          "`className`",
          "`string`",
          "",
          "Merged onto the button, after its own classes.",
        ],
      ],
      after: [
        "All other `Button` props, and the ref, are forwarded to the button.",
      ],
    },
  ],
}

export default doc
