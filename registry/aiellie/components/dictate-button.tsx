"use client"

import * as React from "react"
import { Mic01Icon, StopIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  TooltipIconButton,
  type TooltipIconButtonProps,
} from "@/registry/aiellie/components/tooltip-icon-button"
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

const subscribe = () => () => {}

function DictateButton({
  value,
  onValueChange,
  lang,
  onError,
  tooltip = "Dictate",
  stopTooltip = "Stop dictating",
  side = "top",
  className,
  ...props
}: Omit<
  TooltipIconButtonProps,
  "tooltip" | "children" | "value" | "onClick"
> & {
  value: string
  /** Called with `value` plus what has been said so far, as it is said. */
  onValueChange: (value: string) => void
  /** Defaults to the page's language. */
  lang?: string
  /** Called with the recognizer's error code, like `not-allowed` when the microphone is blocked. */
  onError?: (error: string) => void
  tooltip?: string
  stopTooltip?: string
}) {
  const supported = React.useSyncExternalStore(
    subscribe,
    () => getRecognition() !== undefined,
    () => false
  )
  const [listening, setListening] = React.useState(false)
  const [stream, setStream] = React.useState<MediaStream | null>(null)
  const recognition = React.useRef<Recognition | null>(null)
  const session = React.useRef<object | null>(null)
  const written = React.useRef(value)
  const callbacks = React.useRef({ onValueChange, onError })

  React.useEffect(() => {
    callbacks.current = { onValueChange, onError }
  })

  // A value this button didn't write means someone typed or the message was
  // sent, so the draft is theirs again.
  React.useEffect(() => {
    if (listening && value !== written.current) recognition.current?.abort()
  }, [value, listening])

  React.useEffect(() => () => recognition.current?.abort(), [])

  React.useEffect(
    () => () => stream?.getTracks().forEach((track) => track.stop()),
    [stream]
  )

  if (!supported) return null

  const start = () => {
    const Recognition = getRecognition()
    if (!Recognition) return

    const base = value
    const separator = base === "" || /\s$/.test(base) ? "" : " "
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
      written.current = base + separator + transcript
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
      tooltip={listening ? stopTooltip : tooltip}
      side={side}
      onClick={() => (listening ? recognition.current?.stop() : start())}
      className={cn(
        "size-7 shrink-0 rounded-full p-1.5 data-listening:w-auto data-listening:gap-1.5 data-listening:px-2.5",
        "data-listening:bg-blue-500/4 data-listening:hover:bg-blue-500/7 data-listening:[&_svg]:text-blue-500 data-listening:hover:[&_svg]:text-blue-500",
        "dark:data-listening:bg-blue-400/4 dark:data-listening:hover:bg-blue-400/7 dark:data-listening:[&_svg]:text-blue-400 dark:data-listening:hover:[&_svg]:text-blue-400",
        className
      )}
      {...props}
    >
      {listening ? (
        <>
          <Waveform stream={stream} bars={16} />
          <HugeiconsIcon
            aria-hidden
            icon={StopIcon}
            className="size-3.5"
          />
        </>
      ) : (
        <HugeiconsIcon aria-hidden icon={Mic01Icon} />
      )}
    </TooltipIconButton>
  )
}

export { DictateButton }
