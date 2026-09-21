"use client"

import {
  Status,
  StatusIndicator,
  StatusLabel,
} from "@/registry/aiellie/components/status"

export default function StatusDemo() {
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Status variant="live" pulse>
          <StatusIndicator />
          <StatusLabel>Live</StatusLabel>
        </Status>
        <Status variant="success" pulse>
          <StatusIndicator />
          <StatusLabel>Deploying</StatusLabel>
        </Status>
        <Status variant="destructive" pulse>
          <StatusIndicator />
          <StatusLabel>Degraded</StatusLabel>
        </Status>
      </div>
    </div>
  )
}
