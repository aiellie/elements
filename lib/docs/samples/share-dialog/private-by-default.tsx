"use client"

import * as React from "react"

import {
  ShareDialog,
  type ShareVisibility,
} from "@/registry/aiellie/components/share-dialog"

export default function PrivateByDefault() {
  const [open, setOpen] = React.useState(false)
  const [visibility, setVisibility] = React.useState<ShareVisibility>("private")

  return (
    <div className="flex flex-col items-center gap-2">
      <ShareDialog
        open={open}
        onOpenChange={setOpen}
        title="Share chat"
        url="https://example.com/c/3k9x"
        text="Trip to Lisbon"
        defaultVisibility="private"
        onVisibilityChange={setVisibility}
        descriptions={{
          private: "Only you can see this chat.",
          link: "Anyone with the link can read this chat. Messages you send after sharing stay private.",
        }}
      />
      <span className="text-xs text-muted-foreground">
        {visibility === "link" ? "Shared by link" : "Private"}
      </span>
    </div>
  )
}
