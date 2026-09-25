"use client"

import * as React from "react"

import { Marker, MarkerContent } from "@/registry/aiellie/ui/marker"

const DAY = 24 * 60 * 60 * 1000

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function isSameDay(a: Date, b: Date) {
  return startOfDay(a).getTime() === startOfDay(b).getTime()
}

// "Today at 5:16 PM", "Yesterday at 5:16 PM", "Sunday, September 6 at 5:16
// PM", with the year added once it isn't this one.
function formatDividerDate(
  date: Date,
  { now = new Date(), locale }: { now?: Date; locale?: string } = {}
) {
  const time = date.toLocaleTimeString(locale, {
    hour: "numeric",
    minute: "2-digit",
  })
  const days = Math.round(
    (startOfDay(now).getTime() - startOfDay(date).getTime()) / DAY
  )
  if (days === 0 || days === 1) {
    const day = new Intl.RelativeTimeFormat(locale, {
      numeric: "auto",
    }).format(-days, "day")
    return `${day.charAt(0).toLocaleUpperCase(locale)}${day.slice(1)} at ${time}`
  }
  const day = date.toLocaleDateString(locale, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: date.getFullYear() === now.getFullYear() ? undefined : "numeric",
  })
  return `${day} at ${time}`
}

const subscribe = () => () => {}

function DateDivider({
  date,
  locale,
  className,
  ...props
}: Omit<React.ComponentProps<typeof Marker>, "children" | "variant"> & {
  date: Date
  locale?: string
}) {
  // Worked out in the browser only: the server doesn't know the reader's day
  // or time zone, and a label that differs between the two breaks hydration.
  const client = React.useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  )

  return (
    <Marker
      data-slot="date-divider"
      variant="separator"
      className={className}
      {...props}
    >
      <MarkerContent className="tabular-nums">
        {client ? (
          <time dateTime={date.toISOString()}>
            {formatDividerDate(date, { locale })}
          </time>
        ) : null}
      </MarkerContent>
    </Marker>
  )
}

export { DateDivider, formatDividerDate, isSameDay }
