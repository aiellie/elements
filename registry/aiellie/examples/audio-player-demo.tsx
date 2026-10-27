"use client"

import * as React from "react"

import {
  AudioPlayer,
  AudioPlayerButton,
  AudioPlayerTime,
  AudioPlayerWaveform,
} from "@/registry/aiellie/components/audio-player"

const SECONDS = 6
const RATE = 8000

// A few seconds of soft tones, made here so the demo needs no file.
function makeClip() {
  const samples = SECONDS * RATE
  const view = new DataView(new ArrayBuffer(44 + samples * 2))
  const text = (at: number, value: string) =>
    [...value].forEach((char, i) => view.setUint8(at + i, char.charCodeAt(0)))
  text(0, "RIFF")
  view.setUint32(4, 36 + samples * 2, true)
  text(8, "WAVEfmt ")
  view.setUint32(16, 16, true)
  view.setUint16(20, 1, true)
  view.setUint16(22, 1, true)
  view.setUint32(24, RATE, true)
  view.setUint32(28, RATE * 2, true)
  view.setUint16(32, 2, true)
  view.setUint16(34, 16, true)
  text(36, "data")
  view.setUint32(40, samples * 2, true)
  const notes = [392, 440, 494, 523, 494, 440]
  for (let i = 0; i < samples; i++) {
    const t = i / RATE
    const note = notes[Math.floor(t)]
    const envelope = Math.sin(Math.PI * (t % 1)) ** 2
    view.setInt16(
      44 + i * 2,
      Math.sin(2 * Math.PI * note * t) * envelope * 6000,
      true
    )
  }
  return new Blob([view], { type: "audio/wav" })
}

const PEAKS = Array.from({ length: 48 }, (_, i) => {
  const t = (i / 48) * SECONDS
  return 0.2 + 0.8 * Math.sin(Math.PI * (t % 1)) ** 2
})

export default function AudioPlayerDemo() {
  const [src, setSrc] = React.useState<string>()

  React.useEffect(() => {
    const url = URL.createObjectURL(makeClip())
    // The URL only exists in the browser, so it can't be worked out in render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSrc(url)
    return () => URL.revokeObjectURL(url)
  }, [])

  return (
    <AudioPlayer src={src} duration={SECONDS}>
      <AudioPlayerButton />
      <AudioPlayerWaveform peaks={PEAKS} />
      <AudioPlayerTime />
    </AudioPlayer>
  )
}
