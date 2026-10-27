"use client"

import * as React from "react"

import {
  NeedsYou,
  type WaitingItem,
} from "@/registry/aiellie/components/needs-you"

const ITEMS: WaitingItem[] = [
  {
    id: "1",
    thread: "Migrate billing to Stripe",
    kind: "approval",
    prompt: "Run the migration against staging?",
    detail: "pnpm db:migrate --env staging",
    waitingSeconds: 1420,
  },
  {
    id: "2",
    thread: "Weekly report",
    kind: "question",
    prompt: "Which week should the report cover?",
    options: ["This week", "Last week"],
    waitingSeconds: 340,
  },
  {
    id: "3",
    thread: "Fix flaky checkout test",
    kind: "blocked",
    prompt: "Can't reach the payments sandbox. It needs a new key.",
    waitingSeconds: 95,
  },
]

export default function NeedsYouDemo() {
  const [items, setItems] = React.useState(ITEMS)
  const remove = (id: string) =>
    setItems((current) => current.filter((item) => item.id !== id))

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-3">
      <NeedsYou
        items={items}
        onAnswer={remove}
        onOpen={remove}
        className="max-h-80"
      />
      {items.length === 0 ? (
        <button
          type="button"
          onClick={() => setItems(ITEMS)}
          className="cursor-pointer rounded-sm border border-transparent text-xs text-muted-foreground outline-none hover:text-foreground focus-visible:border-ring"
        >
          Bring them back
        </button>
      ) : null}
    </div>
  )
}
