"use client"

import { useEffect, useState } from "react"

import { Status, StatusIndicator, StatusLabel } from "@/components/aiellie/status"

async function checkStatus() {
  try {
    const res = await fetch(window.location.origin, {
      method: "HEAD",
      cache: "no-store",
    })
    return res.status
  } catch {
    return null
  }
}

export function LoadStatus() {
  const [status, setStatus] = useState<number | null>(null)

  useEffect(() => {
    let active = true

    const check = async () => {
      const code = await checkStatus()
      if (active) setStatus(code)
    }

    check()
    const id = setInterval(check, 5000)

    return () => {
      active = false
      clearInterval(id)
    }
  }, [])

  const ok = status !== null && status >= 200 && status < 400
  const variant = status === null ? "loading" : ok ? "success" : "error"

  return (
    <Status
      variant={variant}
      pulse={status === null || ok}
      aria-label="Load status"
      className="shrink-0 font-mono text-xs font-normal"
    >
      <StatusIndicator />
      <StatusLabel className="tracking-tight tabular-nums">
        {status === null ? "—" : status}
      </StatusLabel>
    </Status>
  )
}