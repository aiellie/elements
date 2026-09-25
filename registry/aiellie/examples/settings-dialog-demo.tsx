"use client"

import * as React from "react"
import { Settings01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { SettingsDialog } from "@/registry/aiellie/components/settings-dialog"
import { PROVIDERS } from "@/registry/aiellie/lib/models"
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
        apiKeys={[
          {
            id: "key_production",
            name: "Production",
            secret: "sk-live-7f2a9c1e4b80",
            createdAt: "2026-03-12",
          },
          {
            id: "key_local",
            name: "Local",
            secret: "sk-test-91c4e0aa33d1",
            createdAt: "2026-08-02",
          },
        ]}
        providers={PROVIDERS}
      />
    </>
  )
}
