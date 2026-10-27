import type { DocContent } from "@/lib/docs"

const doc: DocContent = {
  intro: [
    "Panels lays a page out like an editor: the main content in the middle, with optional panels on the left, the right and along the bottom. Each one resizes by dragging its edge, opens and closes from a toggle in a header or with ⌘B, ⌘I and ⌘J, and animates as it goes. On a phone the side panels become sheets, and the bottom one stays a panel.",
  ],
  gettingStarted: {
    steps: [
      {
        title: "Give it a height and its panels",
        body: [
          "Pass each panel as a prop and the main content as children. A panel left out gets no toggle and no shortcut. It fills its parent, so the parent needs a height.",
        ],
        code: {
          title: "app/workspace/page.tsx",
          code: `import { Panels } from "@/components/aiellie/panels"

export default function Workspace() {
  return (
    <Panels
      className="h-svh"
      left={<ChatList />}
      right={<Details />}
      bottom={<Terminal />}
      defaultOpen={{ left: true }}
    >
      <Thread />
    </Panels>
  )
}`,
        },
      },
      {
        title: "Open a panel from inside",
        body: [
          "`usePanels` reaches the layout from anything rendered in it: whether a panel is open, a toggle, and a way to close the sheet on a phone after choosing something in it.",
        ],
        code: {
          code: `const { isOpen, toggle, closeSheet } = usePanels()

<Button onClick={() => toggle("right")}>Details</Button>`,
        },
      },
    ],
  },
  anatomy: {
    code: `<div data-slot="resizable-panel-group"> {/* a row: left, the middle column, right */}
  <div data-slot="resizable-panel"> {/* left */}
    <header /> {/* its header: name or headers.left, and its toggle */}
    {left}
  </div>
  <div data-slot="resizable-handle" />
  <div data-slot="resizable-panel-group"> {/* a column: main over bottom */}
    <div data-slot="resizable-panel">
      <header /> {/* headers.main, with the toggles of closed panels */}
      {children}
    </div>
    <div data-slot="resizable-handle" />
    <div data-slot="resizable-panel"> {/* bottom */}
      <header />
      {bottom}
    </div>
  </div>
  <div data-slot="resizable-handle" />
  <div data-slot="resizable-panel"> {/* right */}
    <header />
    {right}
  </div>
</div>`,
    body: [
      "Every header is 40px with a rule under it. A panel's toggle sits in its own header while it's open, and moves to the main header while it's closed, so there is always a way back. The left panel starts at 18rem (12rem to 28rem), the right at 24rem (16rem to 42rem), and the bottom at 16rem (8rem to 70%).",
      "A closed panel collapses rather than unmounting, so its contents keep their state and the other panels keep their sizes. The shortcuts are ⌘ or Ctrl with B, I and J, and only bind for the panels you passed.",
    ],
  },
  examples: [
    {
      title: "Toggle from the content",
      body: [
        "A button in the main content opens the right panel through `usePanels`.",
      ],
      sample: "panels/use-panels",
    },
    {
      title: "Custom headers",
      body: [
        "`headers` replaces a header's name with anything, `headerBorder` drops the rule under one, and `toggleAt` moves a panel's toggle to the start of its header.",
      ],
      sample: "panels/headers",
    },
    {
      title: "Content under a glass header",
      body: [
        "`glassHeader` lays the main header over the content, so it scrolls under it. The content then pads its own top by 40px.",
      ],
      code: {
        code: `<Panels glassHeader left={<ChatList />}>
  <div className="h-full overflow-y-auto pt-10">{messages}</div>
</Panels>`,
      },
    },
  ],
  api: [
    {
      title: "Panels",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        ["`children`", "`ReactNode`", "required", "The main content."],
        [
          "`left` / `right` / `bottom`",
          "`ReactNode`",
          "",
          "Each panel's content. A panel left out isn't rendered and has no toggle.",
        ],
        [
          "`defaultOpen`",
          "`{ left?, right?, bottom?: boolean }`",
          "`{ left: true }`",
          "Which panels start open.",
        ],
        [
          "`headers`",
          "`{ left?, right?, bottom?, main?: ReactNode }`",
          "",
          "What each header shows in place of the panel's name.",
        ],
        [
          "`headerBorder`",
          "`{ left?, right?, bottom?, main?: boolean }`",
          "all `true`",
          "Which headers keep the rule under them.",
        ],
        [
          "`glassHeader`",
          "`boolean`",
          "`false`",
          "Lays the main header over its content, which must pad its own top 40px.",
        ],
        [
          "`toggleAt`",
          '`{ left?, right?, bottom?: "start" | "end" }`',
          'all `"end"`',
          "Which end of its header a panel's toggle sits at.",
        ],
        ["`className`", "`string`", "", "Merged onto the outer group."],
      ],
    },
    {
      title: "usePanels",
      head: ["Field", "Type", "Description"],
      rows: [
        [
          "`isOpen`",
          '`(side: "left" | "right" | "bottom") => boolean`',
          "Whether a panel is open, or on a phone, whether its sheet is up.",
        ],
        ["`toggle`", "`(side) => void`", "Opens or closes a panel."],
        [
          "`closeSheet`",
          "`() => void`",
          "Closes a side panel's sheet on a phone. Does nothing on a wide screen.",
        ],
      ],
      after: ["It throws outside `Panels`."],
    },
  ],
}

export default doc
