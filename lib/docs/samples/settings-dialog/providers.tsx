"use client"

import * as React from "react"

import {
  SettingsDialog,
  type SettingsValues,
} from "@/registry/aiellie/components/settings-dialog"
import { PROVIDERS } from "@/registry/aiellie/lib/models"
import { Button } from "@/registry/aiellie/ui/button"

export default function Providers() {
  const [open, setOpen] = React.useState(false)
  const [saved, setSaved] = React.useState<SettingsValues | null>(null)
  const keys = Object.keys(saved?.providerKeys ?? {})

  return (
    <div className="flex flex-col items-center gap-2">
      <Button variant="outline" onClick={() => setOpen(true)}>
        Add a provider key
      </Button>
      <p className="text-xs text-muted-foreground">
        {keys.length ? `Keys saved for ${keys.join(", ")}` : "No keys saved"}
      </p>
      <SettingsDialog
        open={open}
        onOpenChange={setOpen}
        user={{ name: "AI Ellie" }}
        providers={PROVIDERS}
        providerKeys={saved?.providerKeys}
        defaultSection="providers"
        onSave={setSaved}
      />
    </div>
  )
}
