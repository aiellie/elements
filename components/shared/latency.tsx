"use client"

import { useEffect, useState } from "react"

async function measureLatency() {
  const start = performance.now()

  try {
    await fetch(window.location.origin, {
      method: "HEAD",
      cache: "no-store",
    })
    return Math.round(performance.now() - start)
  } catch {
    return null
  }
}

export function Latency() {
  const [latency, setLatency] = useState<number | null>(null)

  useEffect(() => {
    let active = true

    const ping = async () => {
      const ms = await measureLatency()
      if (active) setLatency(ms)
    }

    ping()
    const id = setInterval(ping, 5000)

    return () => {
      active = false
      clearInterval(id)
    }
  }, [])

  return (
    <div
      className="flex shrink-0 items-center gap-1.5 text-xs whitespace-nowrap text-muted-foreground sm:gap-2"
      aria-label="Latency"
    >
      <svg
        viewBox="0 0 8 8"
        className="size-2 shrink-0 fill-current"
        aria-hidden="true"
      >
        <polygon points="4,0 8,8 0,8" />
      </svg>
      <span className="font-mono tracking-tight text-muted-foreground tabular-nums">
        {latency === null ? "—" : `${latency}ms`}
      </span>
    </div>
  )
}