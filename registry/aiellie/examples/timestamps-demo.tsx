"use client"

import * as React from "react"

import {
  Message,
  MessageContent,
  MessagePart,
} from "@/registry/aiellie/components/message"
import {
  Timestamp,
  TimestampRow,
} from "@/registry/aiellie/components/timestamps"

const MINUTE = 60_000

// The moment the page first rendered in the browser. The server has no clock
// of the reader's to match.
let firstNow: number | undefined
const readNow = () => (firstNow ??= Date.now())
const subscribe = () => () => {}

export default function TimestampsDemo() {
  const now = React.useSyncExternalStore(subscribe, readNow, () => null)
  if (now === null) return null

  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <Timestamp
        date={now - 26 * 60 * MINUTE}
        format="datetime"
        variant="separator"
      />
      <TimestampRow>
        <Message>
          <MessageContent>
            <MessagePart>Did the build go out?</MessagePart>
          </MessageContent>
        </Message>
        <Timestamp date={now - 26 * 60 * MINUTE} format="time" />
      </TimestampRow>
      <TimestampRow align="end" reveal="hover">
        <Message align="end">
          <MessageContent>
            <MessagePart>Yes, it just went out</MessagePart>
          </MessageContent>
        </Message>
        <Timestamp date={now - 4 * MINUTE} live />
      </TimestampRow>
    </div>
  )
}
