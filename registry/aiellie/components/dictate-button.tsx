"use client"

import * as React from "react"
import { Mic01Icon, StopIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  TooltipIconButton,
  type TooltipIconButtonProps,
} from "@/registry/aiellie/ui/tooltip-icon-button"
import { Status, StatusIndicator } from "@/registry/aiellie/ui/status"
import { Waveform } from "@/registry/aiellie/components/waveform"
import { cn } from "@/lib/utils"

// TypeScript's DOM types don't include the recognizer itself yet, only its
// results, so this is the part of it used here.
type Recognition = {
  lang: string
  continuous: boolean
  interimResults: boolean
  onresult: ((event: { results: SpeechRecognitionResultList }) => void) | null
  onerror: ((event: { error: string }) => void) | null
  onend: (() => void) | null
  start: () => void
  stop: () => void
  abort: () => void
}

type RecognitionConstructor = new () => Recognition

function getRecognition(): RecognitionConstructor | undefined {
  if (typeof window === "undefined") return undefined
  const speech = window as unknown as {
    SpeechRecognition?: RecognitionConstructor
    webkitSpeechRecognition?: RecognitionConstructor
  }
  return speech.SpeechRecognition ?? speech.webkitSpeechRecognition
}

function canRecord() {
  return (
    typeof window !== "undefined" &&
    typeof window.MediaRecorder !== "undefined" &&
    !!navigator.mediaDevices?.getUserMedia
  )
}

function joinDraft(base: string, text: string) {
  const separator = base === "" || /\s$/.test(base) ? "" : " "
  return base + separator + text
}

const subscribe = () => () => {}

function DictateButton({
  value,
  onValueChange,
  lang,
  onError,
  transcribe,
  tooltip = "Dictate",
  stopTooltip = "Stop dictating",
  side = "top",
  disabled,
  className,
  ...props
}: Omit<
  TooltipIconButtonProps,
  "tooltip" | "children" | "value" | "onClick" | "onError"
> & {
  value: string
  /** Called with `value` plus what has been said so far, as it is said. */
  onValueChange: (value: string) => void
  /** Defaults to the page's language. */
  lang?: string
  /** Called with the recognizer's error code, like `not-allowed` when the microphone is blocked. */
  onError?: (error: string) => void
  /** Turns recorded audio into text, for browsers without speech recognition, like Firefox. Left out, the button hides there. */
  transcribe?: (audio: Blob) => Promise<string>
  tooltip?: string
  stopTooltip?: string
}) {
  const recognizes = React.useSyncExternalStore(
    subscribe,
    () => getRecognition() !== undefined,
    () => false
  )
  const records = React.useSyncExternalStore(subscribe, canRecord, () => false)
  const fallback = !recognizes && records && transcribe !== undefined
  const [listening, setListening] = React.useState(false)
  const [transcribing, setTranscribing] = React.useState(false)
  const recorder = React.useRef<MediaRecorder | null>(null)
  const [stream, setStream] = React.useState<MediaStream | null>(null)
  const recognition = React.useRef<Recognition | null>(null)
  const session = React.useRef<object | null>(null)
  const written = React.useRef(value)
  const callbacks = React.useRef({ onValueChange, onError, transcribe })

  React.useEffect(() => {
    callbacks.current = { onValueChange, onError, transcribe }
  })

  // A value this button didn't write means someone typed or the message was
  // sent, so the draft is theirs again.
  React.useEffect(() => {
    if (listening && value !== written.current) recognition.current?.abort()
  }, [value, listening])

  React.useEffect(
    () => () => {
      recognition.current?.abort()
      if (recorder.current) {
        recorder.current.ondataavailable = null
        recorder.current.onstop = null
        if (recorder.current.state !== "inactive") recorder.current.stop()
      }
    },
    []
  )

  React.useEffect(
    () => () => stream?.getTracks().forEach((track) => track.stop()),
    [stream]
  )

  if (!recognizes && !fallback) return null

  // Without a recognizer, the whole take is recorded and turned into text
  // once it stops, so nothing is written while speaking.
  const record = () => {
    const current = {}
    session.current = current
    setListening(true)
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((audio) => {
        if (session.current !== current) {
          audio.getTracks().forEach((track) => track.stop())
          return
        }
        const chunks: Blob[] = []
        const next = new MediaRecorder(audio)
        next.ondataavailable = (event) => {
          if (event.data.size > 0) chunks.push(event.data)
        }
        next.onstop = () => {
          recorder.current = null
          session.current = null
          setListening(false)
          setStream(null)
          const audioBlob = new Blob(chunks, { type: next.mimeType })
          const send = callbacks.current.transcribe
          if (!send || audioBlob.size === 0) return
          setTranscribing(true)
          send(audioBlob)
            .then((text) => {
              const trimmed = text.trim()
              if (!trimmed) return
              written.current = joinDraft(written.current, trimmed)
              callbacks.current.onValueChange(written.current)
            })
            .catch(() => callbacks.current.onError?.("transcribe-failed"))
            .finally(() => setTranscribing(false))
        }
        recorder.current = next
        written.current = value
        next.start()
        setStream(audio)
      })
      .catch(() => {
        session.current = null
        setListening(false)
        callbacks.current.onError?.("not-allowed")
      })
  }

  const start = () => {
    const Recognition = getRecognition()
    if (!Recognition) return

    const base = value
    written.current = base

    const next = new Recognition()
    next.lang = lang || document.documentElement.lang || navigator.language
    next.continuous = true
    next.interimResults = true
    next.onresult = (event) => {
      let transcript = ""
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript
      }
      transcript = transcript.trim()
      if (!transcript) return
      written.current = joinDraft(base, transcript)
      callbacks.current.onValueChange(written.current)
    }
    next.onerror = (event) => {
      if (event.error === "aborted" || event.error === "no-speech") return
      callbacks.current.onError?.(event.error)
    }
    next.onend = () => {
      recognition.current = null
      session.current = null
      setListening(false)
      setStream(null)
    }

    recognition.current = next
    next.start()
    setListening(true)

    // The recognizer keeps its audio to itself, so the waveform listens on a
    // stream of its own. Without one it still shows, resting.
    const current = {}
    session.current = current
    navigator.mediaDevices
      ?.getUserMedia({ audio: true })
      .then((audio) => {
        if (session.current === current) setStream(audio)
        else audio.getTracks().forEach((track) => track.stop())
      })
      .catch(() => {})
  }

  return (
    <TooltipIconButton
      data-slot="dictate-button"
      data-listening={listening ? "" : undefined}
      data-transcribing={transcribing ? "" : undefined}
      tooltip={
        transcribing ? "Transcribing" : listening ? stopTooltip : tooltip
      }
      side={side}
      disabled={transcribing || disabled}
      aria-busy={transcribing || undefined}
      onClick={() => {
        if (!listening) return fallback ? record() : start()
        if (fallback) {
          if (recorder.current?.state === "recording") recorder.current.stop()
          else {
            // Stopped before the microphone was granted.
            session.current = null
            setListening(false)
          }
        } else recognition.current?.stop()
      }}
      className={cn(
        "size-7 shrink-0 rounded-full p-1.5 data-listening:w-auto data-listening:gap-1.5 data-listening:px-2.5",
        "data-listening:bg-live/4 data-listening:hover:bg-live/7 data-listening:[&_svg]:text-live data-listening:hover:[&_svg]:text-live",
        className
      )}
      {...props}
    >
      {transcribing ? (
        <Status
          variant="live"
          pulse
          className="border-0 bg-transparent p-0 dark:bg-transparent"
        >
          <StatusIndicator />
        </Status>
      ) : listening ? (
        <>
          <Waveform stream={stream} bars={16} />
          <HugeiconsIcon aria-hidden icon={StopIcon} className="size-3.5" />
        </>
      ) : (
        <HugeiconsIcon aria-hidden icon={Mic01Icon} />
      )}
    </TooltipIconButton>
  )
}

export { DictateButton }
