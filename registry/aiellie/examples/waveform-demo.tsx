"use client"

import * as React from "react"

import { Waveform } from "@/registry/aiellie/components/waveform"
import { Button } from "@/registry/aiellie/ui/button"

export default function WaveformDemo() {
  const [stream, setStream] = React.useState<MediaStream | null>(null)
  const [blocked, setBlocked] = React.useState(false)

  React.useEffect(
    () => () => stream?.getTracks().forEach((track) => track.stop()),
    [stream]
  )

  const toggle = () => {
    if (stream) return setStream(null)
    navigator.mediaDevices
      ?.getUserMedia({ audio: true })
      .then((audio) => {
        setBlocked(false)
        setStream(audio)
      })
      .catch(() => setBlocked(true))
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <Waveform stream={stream} bars={32} className="h-6" />
      <Button variant="outline" onClick={toggle}>
        {stream ? "Stop microphone" : "Start microphone"}
      </Button>
      {blocked ? (
        <p className="text-xs text-muted-foreground">
          The microphone is blocked for this site.
        </p>
      ) : null}
    </div>
  )
}
