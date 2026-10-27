"use client"

import * as React from "react"

import {
  StackTrace,
  StackTraceCopy,
  StackTraceFrames,
  StackTraceHeader,
} from "@/registry/aiellie/components/stack-trace"

const TRACE = `TypeError: Cannot read properties of undefined (reading 'map')
    at ProjectList (app/projects/project-list.tsx:24:18)
    at renderWithHooks (node_modules/react-dom/cjs/react-dom.development.js:16305:18)
    at mountIndeterminateComponent (node_modules/react-dom/cjs/react-dom.development.js:20074:13)
    at ProjectsPage (app/projects/page.tsx:12:10)
    at processTicksAndRejections (node:internal/process/task_queues:95:5)`

export default function StackTraceDemo() {
  const [opened, setOpened] = React.useState<string>()

  return (
    <div className="flex w-full max-w-md flex-col gap-2 px-4">
      <StackTrace
        trace={TRACE}
        defaultOpen
        onOpenFile={(frame) => setOpened(`${frame.file}:${frame.line}`)}
      >
        <StackTraceHeader>
          <StackTraceCopy />
        </StackTraceHeader>
        <StackTraceFrames />
      </StackTrace>
      <p aria-live="polite" className="h-4 text-xs text-muted-foreground">
        {opened ? `Opened ${opened}` : null}
      </p>
    </div>
  )
}
