"use client"

import * as React from "react"

import { DateDivider } from "@/registry/aiellie/components/date-divider"

const DAY = 24 * 60 * 60 * 1000

export default function DateDividerDemo() {
  const [now] = React.useState(() => Date.now())

  return (
    <div className="flex w-full max-w-md flex-col gap-6 px-4">
      {[now - 400 * DAY, now - 9 * DAY, now - 3 * DAY, now - DAY, now].map(
        (at) => (
          <DateDivider key={at} at={at} />
        )
      )}
    </div>
  )
}
