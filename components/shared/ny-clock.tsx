"use client"

import { useEffect, useState } from "react"

function formatNYTime(date: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(date)

  const get = (type: string) =>
    parts.find((p) => p.type === type)?.value ?? "00"

  return `${get("hour")}:${get("minute")}:${get("second")}`
}

export function NyClock() {
  const [time, setTime] = useState(() => formatNYTime(new Date()))

  useEffect(() => {
    const id = setInterval(() => setTime(formatNYTime(new Date())), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="flex shrink-0 items-center gap-1.5 text-xs whitespace-nowrap text-muted-foreground sm:gap-2">
      <span className="sm:hidden">NY</span>
      <span className="hidden sm:inline">New York</span>
      <span
        className="font-mono tracking-tight text-foreground tabular-nums"
        suppressHydrationWarning
      >
        {time}
      </span>
    </div>
  )
}