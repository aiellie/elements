"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Marker, MarkerContent, MarkerIcon } from "@/registry/aiellie/ui/marker"

const MINUTE = 60_000
const HOUR = 3_600_000
const DAY = 86_400_000

type TimestampFormat = "auto" | "relative" | "time" | "day" | "datetime"

type TimestampOptions = {
  now?: number
  format?: TimestampFormat
  locale?: string
  hour12?: boolean
}

function startOfDay(time: number) {
  const date = new Date(time)
  date.setHours(0, 0, 0, 0)
  return date.getTime()
}

function dayDelta(date: Date, now: number) {
  return Math.round((startOfDay(date.getTime()) - startOfDay(now)) / DAY)
}

function timeOf(date: Date, locale?: string, hour12?: boolean) {
  return new Intl.DateTimeFormat(locale, {
    hour: "numeric",
    minute: "2-digit",
    hour12,
  }).format(date)
}

function dayOf(date: Date, now: number, locale?: string) {
  const delta = dayDelta(date, now)
  if (Math.abs(delta) <= 1) {
    const day = new Intl.RelativeTimeFormat(locale, { numeric: "auto" }).format(
      delta,
      "day"
    )
    return day.charAt(0).toLocaleUpperCase(locale) + day.slice(1)
  }
  if (delta < 0 && delta > -7) {
    return new Intl.DateTimeFormat(locale, { weekday: "long" }).format(date)
  }
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year:
      date.getFullYear() === new Date(now).getFullYear()
        ? undefined
        : "numeric",
  }).format(date)
}

function relativeOf(date: Date, now: number, locale?: string) {
  const difference = date.getTime() - now
  const distance = Math.abs(difference)
  // "In 0 minutes" is worse than saying it plainly.
  if (distance < 45_000) return "Just now"
  const relative = new Intl.RelativeTimeFormat(locale, { numeric: "auto" })
  if (distance < HOUR) {
    return relative.format(Math.round(difference / MINUTE), "minute")
  }
  if (distance < DAY) {
    return relative.format(Math.round(difference / HOUR), "hour")
  }
  const days = dayDelta(date, now)
  if (Math.abs(days) < 7) return relative.format(days, "day")
  return dayOf(date, now, locale)
}

// `auto` gives the gap within the hour, the time later the same day, and the
// day before that.
function formatTimestamp(
  date: Date,
  { now = Date.now(), format = "auto", locale, hour12 }: TimestampOptions = {}
) {
  switch (format) {
    case "relative":
      return relativeOf(date, now, locale)
    case "time":
      return timeOf(date, locale, hour12)
    case "day":
      return dayOf(date, now, locale)
    case "datetime":
      return `${dayOf(date, now, locale)} at ${timeOf(date, locale, hour12)}`
    default:
      if (Math.abs(date.getTime() - now) < HOUR) {
        return relativeOf(date, now, locale)
      }
      return dayDelta(date, now) === 0
        ? timeOf(date, locale, hour12)
        : dayOf(date, now, locale)
  }
}

type Clock = {
  subscribe: (listener: () => void) => () => void
  getSnapshot: () => number
}

const clocks = new Map<number, Clock>()

// One interval per rate, shared by every timestamp that ticks at it.
function clockFor(interval: number): Clock {
  const existing = clocks.get(interval)
  if (existing) return existing

  let now = 0
  let id: ReturnType<typeof setInterval> | undefined
  const listeners = new Set<() => void>()
  const clock: Clock = {
    subscribe(listener) {
      listeners.add(listener)
      now = Date.now()
      if (interval && id === undefined) {
        id = setInterval(() => {
          now = Date.now()
          listeners.forEach((notify) => notify())
        }, interval)
      }
      return () => {
        listeners.delete(listener)
        if (listeners.size === 0 && id !== undefined) {
          clearInterval(id)
          id = undefined
        }
      }
    },
    getSnapshot() {
      if (!now) now = Date.now()
      return now
    },
  }
  clocks.set(interval, clock)
  return clock
}

// Zero on the server, which doesn't know the reader's clock or time zone, so
// the label is only ever worked out in the browser.
function useNow(live: boolean | number) {
  const clock = clockFor(live === true ? MINUTE : live === false ? 0 : live)
  return React.useSyncExternalStore(clock.subscribe, clock.getSnapshot, () => 0)
}

function Timestamp({
  date,
  format = "auto",
  variant = "default",
  locale,
  hour12,
  live = false,
  icon,
  className,
  children,
  ...props
}: Omit<React.ComponentProps<typeof Marker>, "children" | "render"> & {
  date: Date | string | number
  format?: TimestampFormat
  locale?: string
  hour12?: boolean
  /** Keeps a relative label current: `true` ticks every minute, a number every that many milliseconds. */
  live?: boolean | number
  icon?: React.ReactNode
  /** Your own label in place of the formatted one. */
  children?: React.ReactNode
}) {
  const value = date instanceof Date ? date : new Date(date)
  const now = useNow(live)
  if (Number.isNaN(value.getTime())) return null

  return (
    <Marker
      data-slot="timestamp"
      variant={variant}
      className={cn("w-auto", className)}
      render={
        <time
          dateTime={value.toISOString()}
          title={
            now
              ? new Intl.DateTimeFormat(locale, {
                  dateStyle: "full",
                  timeStyle: "short",
                  hour12,
                }).format(value)
              : undefined
          }
        />
      }
      {...props}
    >
      {icon ? <MarkerIcon>{icon}</MarkerIcon> : null}
      <MarkerContent className="tabular-nums">
        {children ??
          (now ? formatTimestamp(value, { now, format, locale, hour12 }) : "")}
      </MarkerContent>
    </Marker>
  )
}

function TimestampRow({
  align = "start",
  reveal = "always",
  className,
  ...props
}: React.ComponentProps<"div"> & {
  /** Which side the message sits on. The timestamp goes beside it. */
  align?: "start" | "end"
  /** `hover` keeps the space but shows the timestamp only on hover or focus. */
  reveal?: "always" | "hover"
}) {
  return (
    <div
      data-slot="timestamp-row"
      data-align={align}
      data-reveal={reveal}
      className={cn(
        "group/timestamp-row flex w-full min-w-0 items-end gap-2 data-[align=end]:flex-row-reverse",
        "[&>[data-slot=message]]:w-auto [&>[data-slot=message]]:max-w-[80%] [&>[data-slot=message]_[data-slot=message-part]]:max-w-full [&>[data-slot=timestamp]]:shrink-0 [&>[data-slot=timestamp]]:whitespace-nowrap",
        "data-[reveal=hover]:[&>[data-slot=timestamp]]:opacity-0 data-[reveal=hover]:[&>[data-slot=timestamp]]:transition-opacity data-[reveal=hover]:[&>[data-slot=timestamp]]:duration-150 motion-reduce:[&>[data-slot=timestamp]]:transition-none",
        "data-[reveal=hover]:focus-within:[&>[data-slot=timestamp]]:opacity-100 data-[reveal=hover]:hover:[&>[data-slot=timestamp]]:opacity-100",
        className
      )}
      {...props}
    />
  )
}

export { Timestamp, TimestampRow, formatTimestamp }
export type { TimestampFormat }
