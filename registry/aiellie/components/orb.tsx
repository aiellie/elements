"use client"

import * as React from "react"
import { Warp } from "@paper-design/shaders-react"

import { cn } from "@/lib/utils"

type OrbState = "idle" | "listening" | "thinking" | "speaking" | "asleep"

type OrbColors = [string, string, string]

type OrbShape = "checks" | "stripes" | "edge"

type OrbValues = {
  proportion: number
  softness: number
  distortion: number
  swirl: number
  swirlIterations: number
  shapeScale: number
  speed: number
  scale: number
  rotation: number
  offsetX: number
  offsetY: number
}

type OrbLook = {
  colors: OrbColors
  shape: OrbShape
  values: OrbValues
  grain: number
}

const ORB_PRESETS: Record<string, OrbColors> = {
  aiellie: ["#a5b4fc", "#e0e7ff", "#4f46e5"],
  openai: ["#10a37f", "#d1f5e9", "#0b7a5f"],
  google: ["#4285f4", "#fce8e6", "#ea4335"],
  anthropic: ["#d97757", "#f5efe6", "#8c4a2f"],
  x: ["#71767b", "#e7e9ea", "#0f1419"],
  deepseek: ["#4d6bfe", "#e3e9ff", "#1c2f9e"],
}

const SHAPES: OrbShape[] = ["checks", "stripes", "edge"]

const DEFAULT_VALUES: OrbValues = {
  proportion: 0.35,
  softness: 1,
  distortion: 0.32,
  swirl: 1,
  swirlIterations: 0,
  shapeScale: 0,
  speed: 12.2,
  scale: 0.31,
  rotation: 176,
  offsetX: 0.65,
  offsetY: 0.09,
}

// Narrower than the shader accepts: at the extremes the orb washes out.
const SEED_RANGES: Record<keyof OrbValues, [number, number]> = {
  proportion: [0.2, 0.8],
  softness: [0.3, 1],
  distortion: [0.05, 0.6],
  swirl: [0.2, 1],
  swirlIterations: [0, 6],
  shapeScale: [0, 0.6],
  speed: [4, 18],
  scale: [0.15, 1.2],
  rotation: [0, 360],
  offsetX: [-0.8, 0.8],
  offsetY: [-0.8, 0.8],
}

// A state never changes the look, it only pushes it faster or calmer.
const STATE_SHADER: Record<
  OrbState,
  Partial<Record<keyof OrbValues, number>>
> = {
  idle: { speed: 0.5 },
  listening: { speed: 0.9, distortion: 1.2 },
  thinking: { speed: 2.4, swirl: 1.25, distortion: 1.4 },
  speaking: { speed: 1.7, swirl: 1.1, distortion: 1.25 },
  asleep: { speed: 0.1, swirl: 0.6, distortion: 0.45 },
}

const STATE_MOTION: Record<
  OrbState,
  { keyframes: Keyframe[]; duration: number; easing: string } | null
> = {
  idle: {
    keyframes: [{ scale: 1 }, { scale: 1.03 }, { scale: 1 }],
    duration: 6000,
    easing: "ease-in-out",
  },
  listening: null,
  thinking: {
    keyframes: [
      { scale: 0.95, rotate: "0deg" },
      { scale: 0.95, rotate: "360deg" },
    ],
    duration: 7000,
    easing: "linear",
  },
  speaking: {
    keyframes: [{ scale: 1 }, { scale: 1.05 }, { scale: 1 }],
    duration: 1100,
    easing: "ease-in-out",
  },
  asleep: {
    keyframes: [{ scale: 1 }, { scale: 0.97 }, { scale: 1 }],
    duration: 5000,
    easing: "ease-in-out",
  },
}

const STATE_LABELS: Record<OrbState, string> = {
  idle: "Idle",
  listening: "Listening",
  thinking: "Thinking",
  speaking: "Speaking",
  asleep: "Asleep",
}

const GRAIN = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E`

// FNV-1a, so a name maps to the same look on every machine.
function hashSeed(text: string) {
  let hash = 0x811c9dc5
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i)
    hash = Math.imul(hash, 0x01000193)
  }
  return hash >>> 0
}

// mulberry32
function createRng(seed: number) {
  let state = seed || 1
  return () => {
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function hslToHex(h: number, s: number, l: number) {
  const a = (s / 100) * Math.min(l / 100, 1 - l / 100)
  const channel = (n: number) => {
    const k = (n + h / 30) % 12
    const value = l / 100 - a * Math.max(-1, Math.min(k - 3, 9 - k, 1))
    return Math.round(255 * value)
      .toString(16)
      .padStart(2, "0")
  }
  return `#${channel(0)}${channel(8)}${channel(4)}`
}

function orbLookFromSeed(seed: string): OrbLook {
  const name = seed.trim().toLowerCase()
  if (Object.hasOwn(ORB_PRESETS, name)) {
    return {
      colors: ORB_PRESETS[name],
      shape: "edge",
      values: DEFAULT_VALUES,
      grain: 0,
    }
  }

  const rng = createRng(hashSeed(name))
  const values = {} as OrbValues
  for (const key of Object.keys(DEFAULT_VALUES) as (keyof OrbValues)[]) {
    const [low, high] = SEED_RANGES[key]
    values[key] = low + rng() * (high - low)
  }
  const shape = SHAPES[Math.floor(rng() * SHAPES.length)]
  const hue = Math.floor(rng() * 360)
  const spread = 20 + Math.floor(rng() * 60)
  return {
    values,
    shape,
    colors: [
      hslToHex(hue, 90, 76),
      hslToHex((hue + spread) % 360, 100, 93),
      hslToHex((hue + 360 - spread) % 360, 72, 45),
    ],
    grain: Math.round(rng() * 50) / 100,
  }
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max)

function Orb({
  state = "idle",
  size = 160,
  seed = "aiellie",
  colors,
  level = 0,
  className,
  style,
  ...props
}: Omit<React.ComponentProps<"div">, "children"> & {
  state?: OrbState
  /** The orb's diameter in pixels. */
  size?: number
  /** A preset's name, or any word, which always turns into the same look. */
  seed?: string
  /** Replaces the seed's three colours and keeps the rest of its look. */
  colors?: OrbColors
  /** How loud the voice is, from 0 to 1. Read while listening or speaking. */
  level?: number
}) {
  const body = React.useRef<HTMLDivElement>(null)
  const look = React.useMemo(() => orbLookFromSeed(seed), [seed])

  const values = { ...look.values }
  for (const [key, factor] of Object.entries(STATE_SHADER[state]) as [
    keyof OrbValues,
    number,
  ][]) {
    values[key] = clamp(values[key] * factor, SEED_RANGES[key][0], 30)
  }
  const voiced = state === "listening" || state === "speaking"
  if (voiced) values.distortion = clamp(values.distortion + level * 0.3, 0, 1)

  // Motion that JavaScript runs gets no motion-reduce variant, so it checks here.
  React.useEffect(() => {
    const motion = STATE_MOTION[state]
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
    if (!motion || reduced || !body.current?.animate) return
    const animation = body.current.animate(motion.keyframes, {
      duration: motion.duration,
      easing: motion.easing,
      iterations: Infinity,
    })
    return () => animation.cancel()
  }, [state])

  return (
    <div
      data-slot="orb"
      data-state={state}
      role="img"
      aria-label={`Assistant, ${STATE_LABELS[state].toLowerCase()}`}
      className={cn("relative shrink-0", className)}
      style={{ width: size, height: size, ...style }}
      {...props}
    >
      {/* The voice swells this wrapper, so it never fights the state's own motion on the body. */}
      <div
        className="size-full transition-[scale] duration-80 ease-out motion-reduce:transition-none"
        style={{ scale: voiced ? String(1 + level * 0.18) : "1" }}
      >
        <div
          ref={body}
          className={cn(
            "relative size-full overflow-hidden rounded-full transition-opacity duration-280 motion-reduce:transition-none",
            state === "asleep" && "opacity-50"
          )}
        >
          <Warp
            width={size}
            height={size}
            colors={colors ?? look.colors}
            shape={look.shape}
            {...values}
          />
          {look.grain > 0 ? (
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 mix-blend-overlay"
              style={{
                backgroundImage: `url("${GRAIN}")`,
                backgroundSize: "140px 140px",
                opacity: look.grain,
              }}
            />
          ) : null}
        </div>
      </div>
      <span role="status" className="sr-only">
        {STATE_LABELS[state]}
      </span>
    </div>
  )
}

export { ORB_PRESETS, Orb }
export type { OrbColors, OrbState }
