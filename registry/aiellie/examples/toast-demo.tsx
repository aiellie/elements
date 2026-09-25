"use client"

import * as React from "react"

import {
  AnchoredToaster,
  ToastProvider,
  Toaster,
  createToastManager,
} from "@/registry/aiellie/components/toast"
import { Button } from "@/registry/aiellie/ui/button"

function StackedToastDemo() {
  const [toastManager] = React.useState(() => createToastManager())

  return (
    <ToastProvider toastManager={toastManager}>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Button
          variant="outline"
          onClick={() => {
            toastManager.add({
              title: "Changes saved",
              description: "Your preferences are up to date.",
              type: "success",
              actionProps: {
                children: "Undo",
                onClick: () => {
                  toastManager.add({
                    title: "Changes undone",
                    description: "Your previous preferences are back.",
                    type: "info",
                  })
                },
              },
            })
          }}
        >
          Success
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            toastManager.add({
              title: "Could not save",
              description: "Check your connection and try again.",
              type: "error",
              priority: "high",
            })
          }}
        >
          Error
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            void toastManager.promise(
              new Promise((resolve) => window.setTimeout(resolve, 1200)),
              {
                loading: {
                  title: "Publishing",
                  description: "Sending your latest changes.",
                },
                success: {
                  title: "Published",
                  description: "Your changes are live.",
                },
                error: {
                  title: "Publish failed",
                  description: "Try again in a moment.",
                  priority: "high",
                },
              }
            )
          }}
        >
          Loading
        </Button>
      </div>
      <Toaster />
    </ToastProvider>
  )
}

function AnchoredToastDemo() {
  const [toastManager] = React.useState(() => createToastManager())
  const anchorRef = React.useRef<HTMLButtonElement>(null)

  return (
    <ToastProvider toastManager={toastManager}>
      <Button
        ref={anchorRef}
        onClick={() => {
          toastManager.add({
            description: "Copied to clipboard",
            type: "success",
            positionerProps: {
              anchor: anchorRef.current,
              side: "top",
              align: "center",
            },
          })
        }}
      >
        Anchored
      </Button>
      <AnchoredToaster />
    </ToastProvider>
  )
}

export default function ToastDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <StackedToastDemo />
      <AnchoredToastDemo />
    </div>
  )
}
