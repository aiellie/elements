"use client"

import * as React from "react"
import {
  CallEnd01Icon,
  CallIcon,
  Mic01Icon,
  MicOff01Icon,
  Video01Icon,
  VideoOffIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { cn } from "@/lib/utils"
import {
  geminiLive,
  mockLive,
  type LiveCallEndReason,
  type LiveCallSession,
  type LiveTransport,
} from "@/registry/aiellie/lib/live-call"
import { Button } from "@/registry/aiellie/ui/button"
import { Status, StatusIndicator } from "@/registry/aiellie/ui/status"
import { TooltipIconButton } from "@/registry/aiellie/ui/tooltip-icon-button"
import { MicMenu } from "@/registry/aiellie/components/mic-menu"
import {
  Orb,
  type OrbColors,
  type OrbState,
} from "@/registry/aiellie/components/orb"
import {
  Transcript,
  TranscriptSegment,
} from "@/registry/aiellie/components/transcript"
import { Waveform } from "@/registry/aiellie/components/waveform"

type CallState = "idle" | "connecting" | "listening" | "speaking" | "ended"

type CallSegment = {
  id: number
  speaker: "user" | "assistant"
  text: string
  /** False while the words may still change. */
  final: boolean
}

type UseLiveCallOptions = {
  transport: () => LiveTransport
  defaultMuted?: boolean
  defaultCameraOff?: boolean
  onStateChange?: (state: CallState) => void
  onTranscript?: (segments: CallSegment[]) => void
  onEnd?: (reason: LiveCallEndReason) => void
}

const ORB_STATES: Record<CallState, OrbState> = {
  idle: "idle",
  connecting: "thinking",
  listening: "listening",
  speaking: "speaking",
  ended: "asleep",
}

function stopStream(stream: MediaStream | null) {
  stream?.getTracks().forEach((track) => track.stop())
}

async function getStream(constraints: MediaStreamConstraints) {
  try {
    return await navigator.mediaDevices.getUserMedia(constraints)
  } catch {
    return null
  }
}

const audioConstraints = (deviceId: string): MediaTrackConstraints => ({
  deviceId: deviceId ? { exact: deviceId } : undefined,
  echoCancellation: true,
  noiseSuppression: true,
})

const VIDEO: MediaTrackConstraints = {
  facingMode: "user",
  width: { ideal: 640 },
  height: { ideal: 480 },
}

function useLiveCall({
  transport,
  defaultMuted = false,
  defaultCameraOff = false,
  onStateChange,
  onTranscript,
  onEnd,
}: UseLiveCallOptions) {
  const [state, setState] = React.useState<CallState>("idle")
  const [segments, setSegments] = React.useState<CallSegment[]>([])
  const [error, setError] = React.useState<string>()
  const [muted, setMutedState] = React.useState(defaultMuted)
  const [cameraOff, setCameraOffState] = React.useState(defaultCameraOff)
  const [micId, setMicIdState] = React.useState("")
  const [mic, setMic] = React.useState<MediaStream | null>(null)
  const [camera, setCamera] = React.useState<MediaStream | null>(null)
  const [startedAt, setStartedAt] = React.useState<number>()
  const [endedAt, setEndedAt] = React.useState<number>()

  const session = React.useRef<LiveCallSession | null>(null)
  const nextId = React.useRef(0)
  const streams = React.useRef({ mic, camera })
  React.useEffect(() => {
    streams.current = { mic, camera }
  }, [mic, camera])
  const callbacks = React.useRef({
    transport,
    onStateChange,
    onTranscript,
    onEnd,
  })
  React.useEffect(() => {
    callbacks.current = { transport, onStateChange, onTranscript, onEnd }
  })

  React.useEffect(() => {
    callbacks.current.onStateChange?.(state)
  }, [state])

  const settled = React.useMemo(
    () => segments.filter((segment) => segment.final),
    [segments]
  )
  React.useEffect(() => {
    callbacks.current.onTranscript?.(settled)
  }, [settled])

  // Adds words to the speaker's open line, or opens a new one, and settles
  // the other speaker's line, since a reply means the turn has changed.
  const append = React.useCallback(
    (speaker: CallSegment["speaker"], text: string) =>
      setSegments((current) => {
        const last = current.at(-1)
        if (last && last.speaker === speaker && !last.final) {
          return [...current.slice(0, -1), { ...last, text: last.text + text }]
        }
        const closed = current.map((segment) =>
          segment.final ? segment : { ...segment, final: true }
        )
        return [
          ...closed,
          {
            id: nextId.current++,
            speaker,
            text: text.trimStart(),
            final: false,
          },
        ]
      }),
    []
  )

  const settle = React.useCallback(
    () =>
      setSegments((current) =>
        current.some((segment) => !segment.final)
          ? current.map((segment) => ({ ...segment, final: true }))
          : current
      ),
    []
  )

  const release = React.useCallback(() => {
    stopStream(streams.current.mic)
    stopStream(streams.current.camera)
    setMic(null)
    setCamera(null)
  }, [])

  const start = React.useCallback(async () => {
    if (session.current) return
    setError(undefined)
    setSegments([])
    setStartedAt(undefined)
    setEndedAt(undefined)
    setState("connecting")

    const [audio, video] = await Promise.all([
      getStream({ audio: audioConstraints(micId) }),
      cameraOff ? null : getStream({ video: VIDEO }),
    ])
    setMic(audio)
    setCamera(video)
    if (!video) setCameraOffState(true)

    const live = callbacks.current.transport()({
      onOpen: () => {
        setStartedAt(Date.now())
        setState("listening")
      },
      onUserText: (text) => append("user", text),
      onAssistantText: (text) => append("assistant", text),
      onSpeaking: (speaking) =>
        setState((current) =>
          current === "listening" || current === "speaking"
            ? speaking
              ? "speaking"
              : "listening"
            : current
        ),
      onTurnEnd: settle,
      onInterrupted: settle,
      onClose: (reason, message) => {
        session.current = null
        settle()
        release()
        setEndedAt(Date.now())
        if (reason === "error")
          setError(message ?? "The call ended unexpectedly.")
        setState("ended")
        callbacks.current.onEnd?.(reason)
      },
    })
    session.current = live
    live.setMic(muted ? null : audio)
    live.setCamera(video)
  }, [append, cameraOff, micId, muted, release, settle])

  const end = React.useCallback(() => session.current?.close(), [])

  React.useEffect(
    () => () => {
      session.current?.close()
      release()
    },
    [release]
  )

  const setMuted = React.useCallback(
    (next: boolean) => {
      setMutedState(next)
      mic?.getAudioTracks().forEach((track) => (track.enabled = !next))
      session.current?.setMic(next ? null : mic)
    },
    [mic]
  )

  // Turning the camera off stops the track, so its light goes out too.
  const setCameraOff = React.useCallback(async (next: boolean) => {
    setCameraOffState(next)
    if (!session.current) return
    stopStream(streams.current.camera)
    const video = next ? null : await getStream({ video: VIDEO })
    if (!next && !video) setCameraOffState(true)
    setCamera(video)
    session.current?.setCamera(video)
  }, [])

  const setMicId = React.useCallback(
    async (deviceId: string) => {
      setMicIdState(deviceId)
      if (!session.current) return
      const audio = await getStream({ audio: audioConstraints(deviceId) })
      if (!audio) return
      stopStream(streams.current.mic)
      audio.getAudioTracks().forEach((track) => (track.enabled = !muted))
      setMic(audio)
      session.current?.setMic(muted ? null : audio)
    },
    [muted]
  )

  const level = React.useCallback(() => session.current?.level() ?? 0, [])

  return {
    state,
    segments,
    error,
    muted,
    cameraOff,
    micId,
    mic: muted ? null : mic,
    camera,
    startedAt,
    endedAt,
    start,
    end,
    setMuted,
    setCameraOff,
    setMicId,
    level,
  }
}

function useStreamLevel(stream: MediaStream | null) {
  const level = React.useRef(0)
  React.useEffect(() => {
    level.current = 0
    if (!stream || typeof AudioContext === "undefined") return
    const context = new AudioContext()
    const analyser = context.createAnalyser()
    analyser.fftSize = 512
    context.createMediaStreamSource(stream).connect(analyser)
    const buffer = new Uint8Array(analyser.fftSize)
    let frame = requestAnimationFrame(function read() {
      analyser.getByteTimeDomainData(buffer)
      let sum = 0
      for (const sample of buffer) sum += ((sample - 128) / 128) ** 2
      level.current = Math.min(1, Math.sqrt(sum / buffer.length) * 4)
      frame = requestAnimationFrame(read)
    })
    return () => {
      cancelAnimationFrame(frame)
      void context.close()
    }
  }, [stream])
  return level
}

function CallOrb({
  state,
  speakingLevel,
  mic,
  seed,
  colors,
  size,
}: {
  state: CallState
  speakingLevel: () => number
  mic: MediaStream | null
  seed?: string
  colors?: OrbColors
  size: number
}) {
  const micLevel = useStreamLevel(state === "listening" ? mic : null)
  const [level, setLevel] = React.useState(0)

  // Motion that JavaScript runs gets no motion-reduce variant, so it checks here.
  React.useEffect(() => {
    setLevel(0)
    const voiced = state === "listening" || state === "speaking"
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
    if (!voiced || reduced) return
    let frame = requestAnimationFrame(function read() {
      setLevel(state === "speaking" ? speakingLevel() : micLevel.current)
      frame = requestAnimationFrame(read)
    })
    return () => cancelAnimationFrame(frame)
  }, [state, speakingLevel, micLevel])

  return (
    <Orb
      aria-hidden
      state={ORB_STATES[state]}
      level={level}
      seed={seed}
      colors={colors}
      size={size}
    />
  )
}

function formatDuration(ms: number) {
  const seconds = Math.max(0, Math.floor(ms / 1000))
  const minutes = Math.floor(seconds / 60)
  return `${minutes}:${String(seconds % 60).padStart(2, "0")}`
}

function CallTimer({ startedAt }: { startedAt: number }) {
  const [now, setNow] = React.useState(() => Date.now())
  React.useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [])
  return (
    <span className="text-xs text-muted-foreground tabular-nums">
      {formatDuration(now - startedAt)}
    </span>
  )
}

function SelfView({
  camera,
  mic,
  className,
}: {
  camera: MediaStream | null
  mic: MediaStream | null
  className?: string
}) {
  const video = React.useRef<HTMLVideoElement>(null)
  React.useEffect(() => {
    if (video.current) video.current.srcObject = camera
  }, [camera])

  return (
    <div
      data-slot="video-call-self"
      className={cn(
        "aspect-4/3 w-24 overflow-hidden rounded-lg border border-border/60 bg-muted sm:w-36",
        className
      )}
    >
      {camera ? (
        <video
          ref={video}
          aria-label="Your camera"
          autoPlay
          muted
          playsInline
          className="size-full -scale-x-100 object-cover"
        />
      ) : (
        <div className="grid size-full place-items-center">
          <HugeiconsIcon
            aria-hidden
            icon={VideoOffIcon}
            className="size-4 text-muted-foreground"
          />
          <span className="sr-only">Your camera is off</span>
        </div>
      )}
      {mic ? (
        <div className="absolute start-1.5 bottom-1.5 rounded-full bg-background/80 px-1.5 py-1 backdrop-blur-xs">
          <Waveform stream={mic} bars={10} className="h-2.5" />
        </div>
      ) : null}
    </div>
  )
}

const controlButton =
  "size-8 rounded-full border border-border/60 bg-background focus-visible:border-ring aria-pressed:bg-muted [&_svg]:size-4"

function VideoCall({
  transport,
  mock = false,
  tokenUrl = "/api/live-token",
  frameInterval = 1000,
  name = "Assistant",
  seed,
  colors,
  autoStart = false,
  defaultMuted = false,
  defaultCameraOff = false,
  showTranscript = true,
  onStateChange,
  onTranscript,
  onEnd,
  className,
  ...props
}: Omit<React.ComponentProps<"div">, "children"> & {
  /** Where the assistant's side comes from. Overrides `mock` and `tokenUrl`. */
  transport?: LiveTransport
  /** Fakes the assistant's side, with no key and no network. */
  mock?: boolean
  /** The route that mints a Gemini Live token. */
  tokenUrl?: string
  /** Milliseconds between camera frames. Gemini takes at most one a second. */
  frameInterval?: number
  /** Who the call is with, for the transcript and labels. */
  name?: string
  /** Passed to the orb. */
  seed?: string
  colors?: OrbColors
  /** Starts the call on mount, instead of waiting for the start button. */
  autoStart?: boolean
  defaultMuted?: boolean
  defaultCameraOff?: boolean
  showTranscript?: boolean
  onStateChange?: (state: CallState) => void
  /** Every settled line so far, each time one settles. */
  onTranscript?: (segments: CallSegment[]) => void
  onEnd?: (reason: LiveCallEndReason) => void
}) {
  const call = useLiveCall({
    transport: () =>
      transport ??
      (mock ? mockLive() : geminiLive({ tokenUrl, frameInterval })),
    defaultMuted,
    defaultCameraOff,
    onStateChange,
    onTranscript,
    onEnd,
  })
  const { state, start } = call
  const live =
    state === "connecting" || state === "listening" || state === "speaking"

  const autoStarted = React.useRef(false)
  React.useEffect(() => {
    if (!autoStart || autoStarted.current) return
    autoStarted.current = true
    void start()
  }, [autoStart, start])

  const label = {
    idle: `Call ${name}`,
    connecting: "Connecting",
    listening: "Listening",
    speaking: `${name} is speaking`,
    ended: call.error ? "Call failed" : "Call ended",
  }[state]

  return (
    <div
      data-slot="video-call"
      data-state={state}
      className={cn("flex w-full flex-wrap gap-3", className)}
      {...props}
    >
      <div
        data-slot="video-call-stage"
        className="relative flex min-h-80 min-w-0 flex-[2_1_20rem] flex-col gap-3 overflow-hidden rounded-xl border border-border bg-card p-3"
      >
        <div className="flex h-7 items-center justify-between gap-2">
          <span role="status">
            {live ? (
              <Status
                variant="live"
                pulse={state !== "listening"}
                className="text-foreground"
              >
                <StatusIndicator className="text-live" />
                {label}
              </Status>
            ) : (
              <span className="sr-only">{label}</span>
            )}
          </span>
          <div className="flex items-center gap-2">
            {call.startedAt && live ? (
              <CallTimer startedAt={call.startedAt} />
            ) : null}
            {live ? (
              <MicMenu
                value={call.micId}
                onValueChange={(deviceId) => void call.setMicId(deviceId)}
                side="bottom"
                align="end"
              />
            ) : null}
          </div>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center gap-4">
          <CallOrb
            state={state}
            speakingLevel={call.level}
            mic={call.mic}
            seed={seed}
            colors={colors}
            size={128}
          />

          {state === "idle" ? (
            <Button size="default" onClick={() => void start()}>
              <HugeiconsIcon aria-hidden icon={CallIcon} />
              Start call
            </Button>
          ) : null}

          {state === "ended" ? (
            <div className="flex flex-col items-center gap-3 text-center">
              <p className="text-sm">
                {call.error ? (
                  <span className="text-destructive">{call.error}</span>
                ) : (
                  <>
                    Call ended
                    {call.startedAt && call.endedAt ? (
                      <span className="text-muted-foreground tabular-nums">
                        {" · "}
                        {formatDuration(call.endedAt - call.startedAt)}
                      </span>
                    ) : null}
                  </>
                )}
              </p>
              <Button
                variant="outline"
                size="default"
                onClick={() => void start()}
              >
                <HugeiconsIcon aria-hidden icon={CallIcon} />
                Call again
              </Button>
            </div>
          ) : null}
        </div>

        {live ? (
          <SelfView
            camera={call.camera}
            mic={call.mic}
            className="absolute end-3 top-13"
          />
        ) : null}

        <div className="flex h-8 justify-center">
          {live ? (
            <div
              data-slot="video-call-controls"
              role="toolbar"
              aria-label="Call controls"
              className="flex items-center gap-2"
            >
              <TooltipIconButton
                tooltip={call.muted ? "Unmute" : "Mute"}
                side="top"
                aria-pressed={call.muted}
                onClick={() => call.setMuted(!call.muted)}
                className={controlButton}
              >
                <HugeiconsIcon
                  aria-hidden
                  icon={call.muted ? MicOff01Icon : Mic01Icon}
                />
              </TooltipIconButton>
              <TooltipIconButton
                tooltip={call.cameraOff ? "Turn camera on" : "Turn camera off"}
                side="top"
                aria-pressed={call.cameraOff}
                onClick={() => void call.setCameraOff(!call.cameraOff)}
                className={controlButton}
              >
                <HugeiconsIcon
                  aria-hidden
                  icon={call.cameraOff ? VideoOffIcon : Video01Icon}
                />
              </TooltipIconButton>
              <TooltipIconButton
                tooltip="End call"
                side="top"
                variant="destructive"
                onClick={call.end}
                className="size-8 rounded-full bg-destructive/4 hover:bg-destructive/7 [&_svg]:size-4 [&_svg]:text-destructive hover:[&_svg]:text-destructive"
              >
                <HugeiconsIcon aria-hidden icon={CallEnd01Icon} />
              </TooltipIconButton>
            </div>
          ) : null}
        </div>
      </div>

      {showTranscript ? (
        <div
          data-slot="video-call-transcript"
          className="flex min-h-0 min-w-0 flex-[1_1_15rem] flex-col gap-2 rounded-xl border border-border bg-card p-3"
        >
          <p className="text-xs font-medium text-muted-foreground">
            Transcript
          </p>
          {call.segments.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {state === "idle"
                ? "What you both say shows up here."
                : "Waiting for someone to speak…"}
            </p>
          ) : (
            <Transcript aria-label="Call transcript" className="max-h-72">
              {call.segments.map((segment) => (
                <TranscriptSegment
                  key={segment.id}
                  speaker={segment.speaker === "user" ? "You" : name}
                  interim={!segment.final}
                >
                  {segment.text}
                </TranscriptSegment>
              ))}
            </Transcript>
          )}
        </div>
      ) : null}
    </div>
  )
}

export { useLiveCall, VideoCall }
export type { CallSegment, CallState, UseLiveCallOptions }
