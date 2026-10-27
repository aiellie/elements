"use client"

import * as React from "react"

import {
  SandboxCodeEditor,
  SandboxPreview,
  SandboxProvider,
  SandboxTabs,
  SandboxTabsContent,
} from "@/registry/aiellie/components/sandbox"

const FILES = {
  "/App.js": `export default function App() {
  return <h1>Edit me, then save</h1>
}
`,
}

export default function Composed() {
  const [savedAt, setSavedAt] = React.useState<string | null>(null)

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="h-80 overflow-hidden rounded-xl border border-border/60">
        <SandboxProvider template="react" files={FILES}>
          <SandboxTabs
            defaultValue="code"
            title="Heading"
            showSaveReset
            onSave={() => setSavedAt(new Date().toLocaleTimeString())}
          >
            <SandboxTabsContent value="preview">
              <SandboxPreview />
            </SandboxTabsContent>
            <SandboxTabsContent value="code">
              <SandboxCodeEditor showFileTree={false} />
            </SandboxTabsContent>
            <SandboxTabsContent value="console" />
          </SandboxTabs>
        </SandboxProvider>
      </div>
      <p className="text-xs text-muted-foreground">
        {savedAt ? `Saved at ${savedAt}` : "Not saved yet"}
      </p>
    </div>
  )
}
