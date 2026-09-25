"use client"

import { useEffect, useState } from "react"

const CITIES = [
  {
    id: "san-francisco",
    timeZone: "America/Los_Angeles",
    label: "San Francisco",
    short: "SF",
  },
  {
    id: "new-york",
    timeZone: "America/New_York",
    label: "New York",
    short: "NY",
  },
] as const

type CityId = (typeof CITIES)[number]["id"]

function formatTime(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).formatToParts(date)

  const get = (type: string) =>
    parts.find((part) => part.type === type)?.value ?? ""

  return `${get("hour")}:${get("minute")}:${get("second")} ${get("dayPeriod")}`
}

export function Clock() {
  const [cityId, setCityId] = useState<CityId>("san-francisco")
  const [now, setNow] = useState(() => new Date())
  const city = CITIES.find((item) => item.id === cityId) ?? CITIES[0]
  const next = CITIES.find((item) => item.id !== city.id) ?? CITIES[1]
  const time = formatTime(now, city.timeZone)

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <button
      type="button"
      onClick={() => setCityId(next.id)}
      className="flex shrink-0 press items-center gap-1.5 rounded-sm border border-transparent text-xs whitespace-nowrap text-muted-foreground outline-none hover:text-foreground focus-visible:border-ring sm:gap-2"
    >
      <span className="sm:hidden">{city.short}</span>
      <span className="hidden sm:inline">{city.label}</span>
      <span
        className="font-mono tracking-tight text-foreground tabular-nums"
        suppressHydrationWarning
      >
        {time}
      </span>
      <span className="sr-only">. Switch to {next.label}</span>
    </button>
  )
}
