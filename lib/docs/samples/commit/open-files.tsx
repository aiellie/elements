"use client"

import * as React from "react"

import {
  Commit,
  CommitFiles,
  CommitHash,
  CommitHeader,
} from "@/registry/aiellie/components/commit"

export default function OpenFiles() {
  const [opened, setOpened] = React.useState<string>()

  return (
    <div className="flex w-full max-w-md flex-col gap-2">
      <Commit
        defaultOpen
        files={[
          { path: "README.md", additions: 3, deletions: 1 },
          { path: "docs/install.md", status: "added", additions: 40 },
        ]}
      >
        <CommitHeader message="Document the install steps" time="Yesterday">
          <CommitHash hash="9b1e04c" />
        </CommitHeader>
        <CommitFiles onOpenFile={(file) => setOpened(file.path)} />
      </Commit>
      <p aria-live="polite" className="h-4 text-xs text-muted-foreground">
        {opened ? `Opened ${opened}` : null}
      </p>
    </div>
  )
}
