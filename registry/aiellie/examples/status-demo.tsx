"use client"

import {
  Status,
  StatusIndicator,
  StatusLabel,
} from "@/registry/aiellie/ui/status"

export default function StatusDemo() {
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Status variant="live" pulse>
          <StatusIndicator />
          <StatusLabel>Deploying</StatusLabel>
        </Status>
        <Status variant="success">
          <StatusIndicator />
          <StatusLabel>Deployed</StatusLabel>
        </Status>
        <Status variant="destructive">
          <StatusIndicator />
          <StatusLabel>Failed</StatusLabel>
        </Status>
        <Status variant="pending">
          <StatusIndicator />
          <StatusLabel>Needs approval</StatusLabel>
        </Status>
        <Status variant="muted">
          <StatusIndicator />
          <StatusLabel>Queued</StatusLabel>
        </Status>
      </div>
    </div>
  )
}
