import type { DocContent } from "@/lib/docs"

const doc: DocContent = {
  intro: [
    "History buttons are the back and forward pair for moving through what someone has opened, the way a browser does. They show whether each way is open and the keys that do the same; the history itself, and listening for those keys, stays with you.",
  ],
  gettingStarted: {
    steps: [
      {
        title: "Wire them to the router",
        body: [
          "In Next.js the router already keeps the history. Track how far back you are to know when each button is open.",
        ],
        code: {
          title: "components/app-header.tsx",
          code: `"use client"

import { useRouter } from "next/navigation"

import { HistoryButtons } from "@/components/aiellie/history-buttons"

export function AppHeader({
  canGoBack,
  canGoForward,
}: {
  canGoBack: boolean
  canGoForward: boolean
}) {
  const router = useRouter()

  return (
    <HistoryButtons
      canGoBack={canGoBack}
      canGoForward={canGoForward}
      onBack={() => router.back()}
      onForward={() => router.forward()}
    />
  )
}`,
        },
      },
      {
        title: "Listen for the keys",
        body: [
          "The tooltips show `⌘[` and `⌘]`, but the buttons don't bind them. Add the listener where the history lives, so the keys work wherever focus is.",
        ],
        code: {
          code: `React.useEffect(() => {
  const onKey = (event: KeyboardEvent) => {
    if (!(event.metaKey || event.ctrlKey)) return
    if (event.key === "[") router.back()
    if (event.key === "]") router.forward()
  }
  window.addEventListener("keydown", onKey)
  return () => window.removeEventListener("keydown", onKey)
}, [router])`,
        },
      },
    ],
  },
  anatomy: {
    code: `<div data-slot="history-buttons">
  <button /> {/* Back, a TooltipIconButton, disabled without canGoBack */}
  <button /> {/* Forward, disabled without canGoForward */}
</div>`,
    body: [
      "Each button is a 28px `TooltipIconButton` whose tooltip carries its shortcut. The arrows flip in a right-to-left layout, where back points right.",
    ],
  },
  examples: [
    {
      title: "With the keys bound",
      body: ["Press ⌘[ or ⌘] with the preview in focus, or use the buttons."],
      sample: "history-buttons/shortcuts",
    },
    {
      title: "Other shortcuts",
      body: [
        "Change what the tooltips show with `backShortcut` and `forwardShortcut`, to match whatever you listen for.",
      ],
      code: {
        code: `<HistoryButtons backShortcut="Alt ←" forwardShortcut="Alt →" {...history} />`,
      },
    },
  ],
  api: [
    {
      title: "HistoryButtons",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        [
          "`canGoBack`",
          "`boolean`",
          "required",
          "Whether Back is open. It is disabled when not.",
        ],
        ["`canGoForward`", "`boolean`", "required", "Whether Forward is open."],
        ["`onBack`", "`() => void`", "required", "Runs when Back is pressed."],
        [
          "`onForward`",
          "`() => void`",
          "required",
          "Runs when Forward is pressed.",
        ],
        [
          "`backShortcut`",
          "`string`",
          '`"⌘["`',
          "Shown in Back's tooltip. The keys themselves are yours to listen for.",
        ],
        [
          "`forwardShortcut`",
          "`string`",
          '`"⌘]"`',
          "Shown in Forward's tooltip.",
        ],
        ["`className`", "`string`", "", "Merged onto the root."],
      ],
      after: ["All other `div` props are forwarded to the root."],
    },
  ],
}

export default doc
