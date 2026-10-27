"use client"

import * as React from "react"
import { Copy01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  AnchoredToaster,
  ToastProvider,
  createToastManager,
} from "@/registry/aiellie/components/toast"
import { Button } from "@/registry/aiellie/ui/button"

export default function Anchored() {
  const [toasts] = React.useState(() => createToastManager())
  const button = React.useRef<HTMLButtonElement>(null)

  return (
    <ToastProvider toastManager={toasts}>
      <Button
        ref={button}
        variant="outline"
        onClick={() =>
          toasts.add({
            description: "Link copied",
            type: "success",
            timeout: 1500,
            positionerProps: { anchor: button.current, side: "top" },
          })
        }
      >
        <HugeiconsIcon aria-hidden icon={Copy01Icon} />
        Copy link
      </Button>
      <AnchoredToaster />
    </ToastProvider>
  )
}
