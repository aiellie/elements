"use client"

import * as React from "react"
import { PauseIcon, PlayIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { cn } from "@/lib/utils"
import { TooltipIconButton } from "@/registry/aiellie/ui/tooltip-icon-button"

type AudioPlayerState = {
  playing: boolean
  time: number
  duration: number
  toggle: () => void
  seek: (fraction: number) => void
}

const AudioPlayerContext = React.createContext<AudioPlayerState | null>(null)

function useAudioPlayer() {
  const context = React.useContext(AudioPlayerContext)
  if (!context) throw new Error("useAudioPlayer must be used in AudioPlayer.")
  return context
}

function formatAudioTime(seconds: number) {
  const whole = Math.max(0, Math.floor(seconds))
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, "0")}`
}

function AudioPlayer({
  src,
  duration: knownDuration,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  /** The clip. Leave it out while it's still being made. */
  src?: string
  /** The length in seconds, shown until the file says, since a blob URL reports it late. */
  duration?: number
}) {
  const audio = React.useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = React.useState(false)
  const [time, setTime] = React.useState(0)
  const [loadedDuration, setLoadedDuration] = React.useState(0)
  const duration = loadedDuration || knownDuration || 0

  const toggle = React.useCallback(() => {
    const element = audio.current
    if (!element) return
    if (element.paused) void element.play().catch(() => {})
    else element.pause()
  }, [])

  const seek = React.useCallback(
    (fraction: number) => {
      const element = audio.current
      if (!element || !duration) return
      element.currentTime = fraction * duration
      setTime(element.currentTime)
    },
    [duration]
  )

  const state = React.useMemo(
    () => ({ playing, time, duration, toggle, seek }),
    [playing, time, duration, toggle, seek]
  )

  return (
    <AudioPlayerContext.Provider value={state}>
      <div
        data-slot="audio-player"
        data-playing={playing || undefined}
        className={cn(
          "flex w-full max-w-sm min-w-0 items-center gap-3 rounded-2xl border border-border/60 bg-background p-1.5 pe-3",
          className
        )}
        {...props}
      >
        <audio
          ref={audio}
          src={src}
          preload="metadata"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => setPlaying(false)}
          onTimeUpdate={(event) => setTime(event.currentTarget.currentTime)}
          onLoadedMetadata={(event) => {
            const value = event.currentTarget.duration
            if (Number.isFinite(value)) setLoadedDuration(value)
          }}
        />
        {children}
      </div>
    </AudioPlayerContext.Provider>
  )
}

function AudioPlayerButton({
  className,
  ...props
}: Omit<
  React.ComponentProps<typeof TooltipIconButton>,
  "tooltip" | "children"
>) {
  const { playing, toggle } = useAudioPlayer()

  return (
    <TooltipIconButton
      data-slot="audio-player-button"
      variant="default"
      tooltip={playing ? "Pause" : "Play"}
      onClick={toggle}
      className={cn(
        "size-8 shrink-0 rounded-full [&_svg]:text-primary-foreground hover:[&_svg]:text-primary-foreground",
        className
      )}
      {...props}
    >
      <HugeiconsIcon aria-hidden icon={playing ? PauseIcon : PlayIcon} />
    </TooltipIconButton>
  )
}

function AudioPlayerWaveform({
  peaks,
  label = "Seek",
  className,
  ...props
}: Omit<React.ComponentProps<"div">, "children"> & {
  /** The clip's loudness along its length, each from 0 to 1. */
  peaks: readonly number[]
  label?: string
}) {
  const { time, duration, seek } = useAudioPlayer()
  const progress = duration ? time / duration : 0
  const played = Math.round(progress * peaks.length)

  return (
    <div
      data-slot="audio-player-waveform"
      className={cn(
        "relative h-8 min-w-0 flex-1 rounded-md border border-transparent has-focus-visible:border-ring",
        className
      )}
      {...props}
    >
      <div aria-hidden className="flex size-full items-center gap-px">
        {peaks.map((peak, index) => (
          <span
            key={index}
            className={cn(
              "min-h-1 flex-1 rounded-full transition-colors duration-150 motion-reduce:transition-none",
              index < played ? "bg-foreground" : "bg-foreground/20"
            )}
            style={{ height: `${Math.round(peak * 100)}%` }}
          />
        ))}
      </div>
      {/* Invisible, and over the whole strip, so a press lands where it lands. */}
      <input
        type="range"
        min={0}
        max={1000}
        step={1}
        value={Math.round(progress * 1000)}
        aria-label={label}
        aria-valuetext={`${formatAudioTime(time)} of ${formatAudioTime(duration)}`}
        onChange={(event) => seek(Number(event.target.value) / 1000)}
        className="absolute inset-0 size-full cursor-pointer appearance-none opacity-0"
      />
    </div>
  )
}

function AudioPlayerTime({
  className,
  ...props
}: Omit<React.ComponentProps<"span">, "children">) {
  const { time, duration } = useAudioPlayer()

  return (
    <span
      data-slot="audio-player-time"
      className={cn(
        "shrink-0 text-xs text-muted-foreground tabular-nums",
        className
      )}
      {...props}
    >
      {formatAudioTime(time)}
      <span className="text-muted-foreground/60">
        {" / "}
        {formatAudioTime(duration)}
      </span>
    </span>
  )
}

export {
  AudioPlayer,
  AudioPlayerButton,
  AudioPlayerTime,
  AudioPlayerWaveform,
  formatAudioTime,
  useAudioPlayer,
}
