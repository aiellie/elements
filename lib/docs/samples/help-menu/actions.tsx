"use client"

import * as React from "react"

import { HelpMenu } from "@/registry/aiellie/components/help-menu"

export default function Actions() {
  const [last, setLast] = React.useState("Nothing yet")

  return (
    <div className="flex items-center gap-3">
      <HelpMenu
        side="bottom"
        onHelp={() => setLast("Help")}
        onShortcuts={() => setLast("Keyboard shortcuts")}
        onWhatsNew={() => setLast("What's new")}
        onPrivacy={() => setLast("Privacy Center")}
      />
      <span className="text-sm text-muted-foreground">Opened: {last}</span>
    </div>
  )
}
