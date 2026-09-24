"use client"

import {
  Meter,
  MeterLabel,
  MeterValue,
} from "@/registry/aiellie/components/meter"

export default function MeterDemo() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-6">
      <Meter
        value={64_000}
        max={200_000}
        format={{ notation: "compact" }}
        getAriaValueText={(tokens) => `${tokens} of 200K tokens`}
      >
        <MeterLabel>Context window</MeterLabel>
        <MeterValue>{(tokens) => `${tokens} / 200K`}</MeterValue>
      </Meter>
      <Meter value={82}>
        <MeterLabel>Monthly credits</MeterLabel>
        <MeterValue />
      </Meter>
      <Meter value={96} tone="destructive">
        <MeterLabel>Storage almost full</MeterLabel>
        <MeterValue />
      </Meter>
    </div>
  )
}
