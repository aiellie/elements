"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

const REST = 0.15
const STEP_MS = 50

function Waveform({
  stream,
  bars = 24,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  /** The audio to follow, usually from `getUserMedia`. The bars rest while it is null. */
  stream: MediaStream | null
  bars?: number
}) {
  const container = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const spans = Array.from(container.current?.children ?? []) as HTMLElement[]
    const draw = (levels: number[]) =>
      spans.forEach((span, i) => {
        span.style.transform = `scaleY(${Math.max(REST, levels[i] ?? 0)})`
      })

    // JavaScript-driven motion gets no motion-reduce variant, so it checks here.
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
    if (!stream || reduced || typeof AudioContext === "undefined") return

    const context = new AudioContext()
    const source = context.createMediaStreamSource(stream)
    const analyser = context.createAnalyser()
    analyser.fftSize = 512
    source.connect(analyser)

    const samples = new Uint8Array(analyser.fftSize)
    const levels = new Array<number>(spans.length).fill(0)
    let frame = 0
    let last = 0

    const tick = (time: number) => {
      frame = requestAnimationFrame(tick)
      if (time - last < STEP_MS) return
      last = time

      analyser.getByteTimeDomainData(samples)
      let sum = 0
      for (const sample of samples) {
        const x = (sample - 128) / 128
        sum += x * x
      }
      // Speech sits low on a linear scale, so the square root lifts it into view.
      const level = Math.min(
        1,
        Math.sqrt(Math.sqrt(sum / samples.length)) * 1.6
      )

      levels.shift()
      levels.push(level)
      draw(levels)
    }
    frame = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(frame)
      source.disconnect()
      void context.close()
      draw([])
    }
  }, [stream, bars])

  return (
    <div
      ref={container}
      aria-hidden
      data-slot="waveform"
      className={cn(
        "flex h-3.5 shrink-0 items-center gap-0.5 text-live",
        className
      )}
      {...props}
    >
      {Array.from({ length: bars }, (_, i) => (
        <span
          key={i}
          className="h-full w-0.5 rounded-full bg-current transition-transform duration-80 ease-out motion-reduce:transition-none"
          style={{ transform: `scaleY(${REST})` }}
        />
      ))}
    </div>
  )
}

export { Waveform }
