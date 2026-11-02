"use client"

import * as React from "react"

import { VoiceStage, type VoiceState } from "@/registry/aiellie/components/voice-orb"

const LABELS: Record<VoiceState, string> = {
  connecting: "Connecting…",
  listening: "Listening",
  speaking: "Speaking",
  muted: "Muted",
  failed: "Couldn't connect",
  ended: "Ended",
}

export default function VoiceOrbDemo() {
  const [state, setState] = React.useState<VoiceState>("listening")
  // A gentle swell, standing in for how loud the voice is.
  const level = React.useCallback(
    () => (Math.sin(Date.now() / 400) + 1) / 4,
    []
  )

  return (
    <VoiceStage
      state={state}
      level={level}
      label={LABELS[state]}
      tooltip={state === "muted" ? "Unmute" : "Mute"}
      onClick={() => setState(state === "muted" ? "listening" : "muted")}
    />
  )
}
