import type { DocContent } from "@/lib/docs"

const doc: DocContent = {
  intro: [
    "Help menu is the question-mark button that opens the places someone goes when they're stuck: help, keyboard shortcuts, what's new and the privacy center. The rows are fixed; you decide what each one opens by passing its handler.",
  ],
  gettingStarted: {
    steps: [
      {
        title: "Add the menu",
        body: [
          "Pass a handler for each row you use. A row without one still shows and does nothing when chosen.",
        ],
        code: {
          title: "components/app-footer.tsx",
          code: `"use client"

import { useRouter } from "next/navigation"

import { HelpMenu } from "@/components/aiellie/help-menu"

export function AppFooter({ onShortcuts }: { onShortcuts: () => void }) {
  const router = useRouter()

  return (
    <HelpMenu
      onHelp={() => window.open("https://help.example.com")}
      onShortcuts={onShortcuts}
      onWhatsNew={() => router.push("/changelog")}
      onPrivacy={() => router.push("/privacy")}
    />
  )
}`,
        },
      },
    ],
  },
  anatomy: {
    code: `<button data-slot="help-menu"> {/* a ghost icon button, the menu's and the tooltip's trigger */}
  <svg /> {/* the question mark */}
  <span class="sr-only">Help</span>
</button>

<div data-slot="menu-content">
  <div data-slot="menu-item" /> {/* Help */}
  <div data-slot="menu-item" /> {/* Keyboard shortcuts */}
  <div data-slot="menu-item" /> {/* What's new */}
  <div data-slot="menu-separator" />
  <div data-slot="menu-item" /> {/* Privacy Center */}
</div>`,
    body: [
      "The button rests in `muted-foreground` and stays in the foreground color while its menu is open. The menu aligns to the button's end, so it opens inward from a corner, and both it and the tooltip open on `side`.",
    ],
  },
  examples: [
    {
      title: "Handle each row",
      body: ["Each handler runs when its row is chosen and the menu closes."],
      sample: "help-menu/actions",
    },
    {
      title: "Open downward",
      body: [
        'It opens upward by default, for a button at the foot of a sidebar. Set `side="bottom"` in a header.',
      ],
      code: { code: `<HelpMenu side="bottom" />` },
    },
  ],
  api: [
    {
      title: "HelpMenu",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        ["`onHelp`", "`() => void`", "", "Runs when Help is chosen."],
        [
          "`onShortcuts`",
          "`() => void`",
          "",
          "Runs when Keyboard shortcuts is chosen.",
        ],
        ["`onWhatsNew`", "`() => void`", "", "Runs when What's new is chosen."],
        [
          "`onPrivacy`",
          "`() => void`",
          "",
          "Runs when Privacy Center is chosen.",
        ],
        [
          "`side`",
          '`"top" | "bottom"`',
          '`"top"`',
          "Where the menu and the tooltip open.",
        ],
      ],
    },
  ],
}

export default doc
