import type { DocContent } from "@/lib/docs"

const doc: DocContent = {
  intro: [
    "Nav bars is a quiet table of contents for a long page or thread: a column of short ticks beside the content, one per section, the ones in view drawn darker. Hovering shows the sections' names, in one of three ways: a card with the whole list, a card for the one tick under the pointer, or the rail growing into a panel.",
  ],
  gettingStarted: {
    steps: [
      {
        title: "List the sections",
        body: [
          "Each item's `id` should be the `id` of the element it stands for, so the same list can scroll to it and watch it.",
        ],
        code: {
          title: "components/page-nav.tsx",
          code: `"use client"

import {
  NavBars,
  useNavBarsInView,
  type NavBarsItem,
} from "@/components/aiellie/nav-bars"

export function PageNav({ items }: { items: NavBarsItem[] }) {
  const active = useNavBarsInView(items.map((item) => item.id))

  return (
    <NavBars
      items={items}
      active={active}
      onSelect={(id) =>
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
      }
      className="fixed end-4 top-1/2 -translate-y-1/2"
    />
  )
}`,
        },
      },
      {
        title: "Watch a scroll container",
        body: [
          "`useNavBarsInView` watches the window by default. Pass a ref to the element that scrolls when that's something else, like a thread.",
        ],
        code: {
          code: `const scroller = React.useRef<HTMLDivElement>(null)
const active = useNavBarsInView(ids, scroller)

<div ref={scroller} className="overflow-y-auto">{sections}</div>`,
        },
      },
    ],
  },
  anatomy: {
    code: `<nav data-slot="nav-bars" data-variant="list" aria-label="On this page">
  <button data-slot="nav-bars-tick" aria-label aria-current="location" data-active /> {/* one per item */}
</nav>

{/* list: one card with every item */}
<div data-slot="hover-card-content">
  <button data-slot="nav-bars-row" /> {/* a dot for the active ones, and the label */}
</div>

{/* peek: one card that follows the tick under the pointer */}
<div data-slot="hover-card-content">{label}{description}</div>

{/* expand: the rail itself widens, each row a tick and a label */}`,
    body: [
      "Ticks are 12px wide and 2px tall, in a 28 by 10px button, so they're easy to hit while staying slight. Active ones take the foreground color and get `aria-current=\"location\"`. Cards open after 150ms, so passing the pointer over the rail doesn't flash them.",
      "In `expand` the nav keeps the rail's width and the panel grows over what's beside it, rather than pushing the content along. It opens on keyboard focus too. `side` sets which way a card opens, or the rail grows.",
    ],
  },
  examples: [
    {
      title: "Peek",
      body: [
        '`variant="peek"` shows one card for the tick under the pointer, with its `description` under the label. The card moves from tick to tick rather than closing and opening.',
      ],
      sample: "nav-bars/peek",
    },
    {
      title: "Expand",
      body: [
        '`variant="expand"` widens the rail into a panel of labels, over the content beside it.',
      ],
      sample: "nav-bars/expand",
    },
    {
      title: "On the other side",
      body: ["For a rail at the start of the page, open toward the end."],
      code: {
        code: `<NavBars side="inline-start" items={items} onSelect={scrollTo} />`,
      },
    },
  ],
  api: [
    {
      title: "NavBars",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        [
          "`items`",
          "`NavBarsItem[]`",
          "required",
          "The sections, in page order.",
        ],
        [
          "`onSelect`",
          "`(id: string) => void`",
          "required",
          "Called with an item's `id` when its tick or row is pressed.",
        ],
        ["`active`", "`string[]`", "`[]`", "The ids of the items in view."],
        [
          "`variant`",
          '`"list" | "peek" | "expand"`',
          '`"list"`',
          "How the names show on hover.",
        ],
        [
          "`side`",
          '`"inline-start" | "inline-end"`',
          '`"inline-end"`',
          "Which way the card opens, or the rail grows.",
        ],
        ["`aria-label`", "`string`", '`"On this page"`', "The nav's name."],
        ["`className`", "`string`", "", "Merged onto the nav."],
      ],
    },
    {
      title: "NavBarsItem",
      head: ["Field", "Type", "Description"],
      rows: [
        ["`id`", "`string`", "The section's element `id`."],
        [
          "`label`",
          "`string`",
          "Its name, read out on the tick and shown on hover.",
        ],
        [
          "`description`",
          "`string`",
          "A line or two under the label, in the `peek` card.",
        ],
      ],
    },
    {
      title: "useNavBarsInView",
      head: ["Export", "Type", "Description"],
      rows: [
        [
          "`useNavBarsInView(ids, root?)`",
          "`(ids: string[], root?: RefObject<Element>) => string[]`",
          "The ids of the elements on screen, in the order given. `root` is the scroll container, or the window if left out.",
        ],
      ],
    },
  ],
}

export default doc
