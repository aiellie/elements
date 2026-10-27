"use client"

import * as React from "react"

import { StreamText } from "@/registry/aiellie/components/stream-text"

const REPLY =
  "While the stream runs, the newest words hold the live ink and fade to the text color as more arrive behind them."

export default function FreshWords() {
  const [length, setLength] = React.useState(0)

  React.useEffect(() => {
    if (length >= REPLY.length) {
      const restart = setTimeout(() => setLength(0), 2000)
      return () => clearTimeout(restart)
    }
    const next = setTimeout(() => setLength(length + 7), 120)
    return () => clearTimeout(next)
  }, [length])

  return (
    <p className="max-w-sm text-sm leading-6">
      <StreamText
        text={REPLY.slice(0, length)}
        streaming={length < REPLY.length}
        freshWords={6}
      />
    </p>
  )
}
