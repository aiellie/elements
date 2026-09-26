"use client"

import * as React from "react"

import { ShareDialog } from "@/registry/aiellie/components/share-dialog"

export default function ShareDialogDemo() {
  const [open, setOpen] = React.useState(false)

  return (
    <ShareDialog
      open={open}
      onOpenChange={setOpen}
      title="Share document"
      url="https://example.com/share/8f2k"
      text="Launch checklist"
      preview={
        <div className="rounded-sm border px-3 py-2">
          <p className="text-xs font-medium">Launch checklist</p>
          <p className="text-xs text-muted-foreground">12 items, 9 done</p>
        </div>
      }
    />
  )
}
