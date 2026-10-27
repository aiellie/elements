"use client"

import * as React from "react"

import { Waveform } from "@/registry/aiellie/components/waveform"
import { Button } from "@/registry/aiellie/ui/button"

export default function Microphone() {
  const [stream, setStream] = React.useState<MediaStream | null>(null)

  React.useEffect(
    () => () => stream?.getTracks().forEach((track) => track.stop()),
    [stream]
  )

  return (
    <div className="flex items-center gap-4">
      <Button
        variant="outline"
        size="sm"
        onClick={async () => {
          if (stream) return setStream(null)
          try {
            setStream(
              await navigator.mediaDevices.getUserMedia({ audio: true })
            )
          } catch {}
        }}
      >
        {stream ? "Stop listening" : "Listen"}
      </Button>
      <Waveform stream={stream} bars={32} />
    </div>
  )
}
