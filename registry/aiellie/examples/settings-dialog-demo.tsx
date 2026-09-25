"use client"

import * as React from "react"
import { Settings01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { SettingsDialog } from "@/registry/aiellie/components/settings-dialog"
import { Button } from "@/registry/aiellie/ui/button"

export default function SettingsDialogDemo() {
  const [open, setOpen] = React.useState(false)

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        <HugeiconsIcon icon={Settings01Icon} aria-hidden />
        Settings
      </Button>
      <SettingsDialog
        open={open}
        onOpenChange={setOpen}
        user={{ name: "AI Ellie", email: "ellie@example.com" }}
      />
    </>
  )
}
