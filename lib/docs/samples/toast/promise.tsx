"use client"

import * as React from "react"

import {
  ToastProvider,
  Toaster,
  createToastManager,
} from "@/registry/aiellie/ui/toast"
import { Button } from "@/registry/aiellie/ui/button"

export default function PromiseToast() {
  const [toasts] = React.useState(() => createToastManager())

  return (
    <ToastProvider toastManager={toasts}>
      <Button
        variant="outline"
        onClick={() =>
          void toasts.promise(
            new Promise((resolve) => setTimeout(resolve, 1500)),
            {
              loading: {
                title: "Exporting chat",
                description: "Making a PDF.",
              },
              success: {
                title: "Exported",
                description: "Saved to Downloads.",
              },
              error: { title: "Export failed", description: "Try again." },
            }
          )
        }
      >
        Export chat
      </Button>
      <Toaster />
    </ToastProvider>
  )
}
