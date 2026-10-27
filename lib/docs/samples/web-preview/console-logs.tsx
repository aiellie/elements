"use client"

import {
  WebPreview,
  WebPreviewBody,
  WebPreviewConsole,
  WebPreviewNavigation,
  WebPreviewUrl,
} from "@/registry/aiellie/components/web-preview"

const PAGE = `<!doctype html>
<body style="margin:0;display:grid;place-items:center;height:100vh;font:14px system-ui;color:#737373">
  Built in 1.2s
</body>`

const LOGS = [
  { level: "log" as const, message: "ready on :3000", timestamp: new Date() },
  {
    level: "warn" as const,
    message: "Fast Refresh had to do a full reload",
    timestamp: new Date(),
  },
  {
    level: "error" as const,
    message: "Hydration failed: the server rendered 3 items, the client 4",
    timestamp: new Date(),
  },
]

export default function ConsoleLogs() {
  return (
    <WebPreview
      defaultUrl="http://localhost:3000/"
      defaultConsoleOpen
      className="h-80 w-full max-w-xl"
    >
      <WebPreviewNavigation>
        <WebPreviewUrl />
      </WebPreviewNavigation>
      <WebPreviewBody srcDoc={PAGE} />
      <WebPreviewConsole logs={LOGS} />
    </WebPreview>
  )
}
