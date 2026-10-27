"use client"

import * as React from "react"

import {
  Timestamp,
  type TimestampFormat,
} from "@/registry/aiellie/components/timestamps"

const FORMATS: TimestampFormat[] = [
  "auto",
  "relative",
  "time",
  "day",
  "datetime",
]

// The moment the page first rendered in the browser. The server has no clock
// of the reader's to match.
let firstNow: number | undefined
const readNow = () => (firstNow ??= Date.now())
const subscribe = () => () => {}

export default function Formats() {
  const now = React.useSyncExternalStore(subscribe, readNow, () => null)
  if (now === null) return null
  const date = new Date(now - 3 * 3_600_000)

  return (
    <dl className="grid grid-cols-[auto_1fr] items-center gap-x-6 gap-y-2 text-xs">
      {FORMATS.map((format) => (
        <React.Fragment key={format}>
          <dt className="font-mono text-muted-foreground">{format}</dt>
          <dd>
            <Timestamp date={date} format={format} />
          </dd>
        </React.Fragment>
      ))}
    </dl>
  )
}
