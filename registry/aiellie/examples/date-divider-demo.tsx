"use client"

import { DateDivider } from "@/registry/aiellie/components/date-divider"

const now = Date.now()
const HOUR = 60 * 60 * 1000

const DATES = [
  new Date(now - 30 * 24 * HOUR),
  new Date(now - 24 * HOUR),
  new Date(now - 5 * 60 * 1000),
]

export default function DateDividerDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      {DATES.map((date) => (
        <DateDivider key={date.getTime()} date={date} />
      ))}
    </div>
  )
}
