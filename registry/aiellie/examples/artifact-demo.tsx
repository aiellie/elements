"use client"

import * as React from "react"
import {
  Copy01Icon,
  Download01Icon,
  FileScriptIcon,
} from "@hugeicons/core-free-icons"

import {
  Artifact,
  ArtifactAction,
  ArtifactActions,
  ArtifactClose,
  ArtifactContent,
  ArtifactHeader,
  ArtifactTitle,
} from "@/registry/aiellie/components/artifact"
import { CodeBlockContent } from "@/registry/aiellie/components/code-block"
import { Button } from "@/registry/aiellie/ui/button"

const CODE = `export function useDebounce<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debounced
}`

export default function ArtifactDemo() {
  const [open, setOpen] = React.useState(true)

  if (!open) {
    return (
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        Open use-debounce.ts
      </Button>
    )
  }

  return (
    <div className="w-full max-w-md px-4">
      <Artifact className="max-h-72">
        <ArtifactHeader>
          <ArtifactTitle
            icon={FileScriptIcon}
            description="TypeScript · 11 lines"
          >
            use-debounce.ts
          </ArtifactTitle>
          <ArtifactActions>
            <ArtifactAction
              tooltip="Copy"
              icon={Copy01Icon}
              onClick={() => navigator.clipboard.writeText(CODE)}
            />
            <ArtifactAction tooltip="Download" icon={Download01Icon} />
            <ArtifactClose onClick={() => setOpen(false)} />
          </ArtifactActions>
        </ArtifactHeader>
        <ArtifactContent>
          <CodeBlockContent code={CODE} language="ts" lineNumbers />
        </ArtifactContent>
      </Artifact>
    </div>
  )
}
