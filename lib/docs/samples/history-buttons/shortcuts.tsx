"use client"

import * as React from "react"

import { HistoryButtons } from "@/registry/aiellie/components/history-buttons"

const PAGES = ["Inbox", "Q3 planning", "Launch checklist", "Release notes"]

export default function Shortcuts() {
  const [index, setIndex] = React.useState(PAGES.length - 1)
  const back = React.useCallback(
    () => setIndex((current) => Math.max(0, current - 1)),
    []
  )
  const forward = React.useCallback(
    () => setIndex((current) => Math.min(PAGES.length - 1, current + 1)),
    []
  )

  // The buttons only show the keys, so the page listens for them.
  React.useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (!(event.metaKey || event.ctrlKey)) return
      if (event.key === "[") back()
      if (event.key === "]") forward()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [back, forward])

  return (
    <div className="flex items-center gap-3">
      <HistoryButtons
        canGoBack={index > 0}
        canGoForward={index < PAGES.length - 1}
        onBack={back}
        onForward={forward}
      />
      <span className="text-sm">{PAGES[index]}</span>
    </div>
  )
}
