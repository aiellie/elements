"use client"

import * as React from "react"

import { HistoryButtons } from "@/registry/aiellie/components/history-buttons"

const PAGES = ["Inbox", "Q3 planning", "Launch checklist", "Release notes"]

export default function HistoryButtonsDemo() {
  const [index, setIndex] = React.useState(PAGES.length - 1)

  return (
    <div className="flex items-center gap-3">
      <HistoryButtons
        canGoBack={index > 0}
        canGoForward={index < PAGES.length - 1}
        onBack={() => setIndex((current) => current - 1)}
        onForward={() => setIndex((current) => current + 1)}
      />
      <span className="text-sm">{PAGES[index]}</span>
    </div>
  )
}
