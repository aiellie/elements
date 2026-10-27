"use client"

import * as React from "react"

import {
  Composer,
  ComposerFooter,
  ComposerInput,
  ComposerSubmit,
} from "@/registry/aiellie/components/composer"
import {
  Mentions,
  type MentionOption,
} from "@/registry/aiellie/components/mentions"

const OPTIONS: MentionOption[] = [
  { id: "researcher", name: "Researcher", kind: "agent" },
  { id: "ada", name: "Ada" },
  { id: "grace", name: "Grace" },
]

export default function WhoWasNamed() {
  const [named, setNamed] = React.useState<string[]>([])

  return (
    <div className="flex w-full max-w-md flex-col gap-3 pt-24">
      <Composer onSubmit={() => setNamed([])}>
        <Mentions
          options={OPTIONS}
          onMention={(option) =>
            setNamed((all) =>
              all.includes(option.name) ? all : [...all, option.name]
            )
          }
        >
          <ComposerInput placeholder="Type @ to name someone" />
        </Mentions>
        <ComposerFooter>
          <ComposerSubmit />
        </ComposerFooter>
      </Composer>
      <p className="text-xs text-muted-foreground">
        {named.length ? `Named: ${named.join(", ")}` : "No one named yet."}
      </p>
    </div>
  )
}
