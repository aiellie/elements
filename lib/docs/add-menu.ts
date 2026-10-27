import type { DocContent } from "@/lib/docs"

const doc: DocContent = {
  intro: [
    "Add menu is the round plus button at the start of a composer, and the menu it opens: uploads, photos, connected sources, anything that adds to the message. The plus turns into a cross while the menu is open. You bring the rows, built from `MenuItem` and the other parts of [Menu](/components/menu).",
  ],
  gettingStarted: {
    steps: [
      {
        title: "Add the trigger and its rows",
        body: [
          "Children are the menu's rows. Each `MenuItem` takes an `onClick` for what it does.",
        ],
        code: {
          title: "components/composer-add.tsx",
          code: `"use client"

import { Attachment01Icon, Image01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { AddMenu } from "@/components/aiellie/add-menu"
import { MenuItem } from "@/components/aiellie/menu"

export function ComposerAdd({ onUpload }: { onUpload: () => void }) {
  return (
    <AddMenu>
      <MenuItem onClick={onUpload}>
        <HugeiconsIcon aria-hidden icon={Attachment01Icon} />
        Upload files
      </MenuItem>
      <MenuItem>
        <HugeiconsIcon aria-hidden icon={Image01Icon} />
        Add photos
      </MenuItem>
    </AddMenu>
  )
}`,
        },
      },
      {
        title: "Open a file picker from a row",
        body: [
          'Keep a hidden `input type="file"` beside the menu and click it from the row. The files come back on its `change` event, ready for [Attachments](/components/attachments).',
        ],
        code: {
          code: `const input = React.useRef<HTMLInputElement>(null)

<input ref={input} type="file" multiple hidden onChange={onFiles} />
<AddMenu>
  <MenuItem onClick={() => input.current?.click()}>Upload files</MenuItem>
</AddMenu>`,
        },
      },
    ],
  },
  anatomy: {
    code: `<button data-slot="add-menu" aria-expanded> {/* a TooltipIconButton */}
  <svg /> {/* the plus, turned 45° while open */}
</button>

<div data-slot="menu-content"> {/* MenuContent, on the same side as the tooltip */}
  {children}
</div>`,
    body: [
      "The trigger is a 28px round `TooltipIconButton` with the label in its tooltip. While the menu is open it takes the `accent` fill and its icon the foreground color. The menu and the tooltip open on the same `side`, top by default, since the button usually sits at the bottom of the screen.",
    ],
  },
  examples: [
    {
      title: "Groups and separators",
      body: [
        "Rows can be any of Menu's parts. Group the sources you connect under a label and set them apart with a separator.",
      ],
      sample: "add-menu/groups",
    },
    {
      title: "Placement",
      body: [
        "`side` and `align` place the menu. In a composer at the top of the page, open it below.",
      ],
      code: {
        code: `<AddMenu side="bottom" align="start">{rows}</AddMenu>`,
      },
    },
  ],
  api: [
    {
      title: "AddMenu",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        [
          "`children`",
          "`ReactNode`",
          "required",
          "The menu's rows: `MenuItem`, `MenuGroup`, `MenuSeparator` and the rest.",
        ],
        [
          "`tooltip`",
          "`string`",
          '`"Add"`',
          "The trigger's label, in its tooltip and for screen readers.",
        ],
        [
          "`side`",
          '`"top" | "bottom" | "left" | "right"`',
          '`"top"`',
          "Where both the menu and the tooltip open.",
        ],
        [
          "`align`",
          '`"start" | "center" | "end"`',
          '`"start"`',
          "How the menu lines up with the trigger.",
        ],
        ["`className`", "`string`", "", "Merged onto the trigger."],
      ],
      after: ["All other `MenuTrigger` props are forwarded to the trigger."],
    },
  ],
}

export default doc
