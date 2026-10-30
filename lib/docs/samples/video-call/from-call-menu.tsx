"use client"

import * as React from "react"

import { CallMenu } from "@/registry/aiellie/components/call-menu"
import { VideoCall } from "@/registry/aiellie/components/video-call"
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/registry/aiellie/ui/dialog"

export default function FromCallMenu() {
  const [open, setOpen] = React.useState(false)

  return (
    <>
      <CallMenu name="Ellie" onVideoCall={() => setOpen(true)} />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogTitle>Call with Ellie</DialogTitle>
          <VideoCall mock autoStart name="Ellie" onEnd={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  )
}
