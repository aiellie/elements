"use client"

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

const PEOPLE: MentionOption[] = [
  { id: "researcher", name: "Researcher", description: "Agent", kind: "agent" },
  { id: "reviewer", name: "Reviewer", description: "Agent", kind: "agent" },
  { id: "ada", name: "Ada", description: "Design" },
  { id: "grace", name: "Grace", description: "Engineering" },
]

export default function MentionsDemo() {
  return (
    <Composer onSubmit={() => {}} className="mt-auto max-w-md">
      <Mentions options={PEOPLE}>
        <ComposerInput placeholder="Type @ to name someone" />
      </Mentions>
      <ComposerFooter>
        <ComposerSubmit />
      </ComposerFooter>
    </Composer>
  )
}
