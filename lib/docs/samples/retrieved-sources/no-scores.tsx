import { Note01Icon } from "@hugeicons/core-free-icons"

import {
  RetrievedSource,
  RetrievedSources,
} from "@/registry/aiellie/components/retrieved-sources"

export default function NoScores() {
  return (
    <RetrievedSources className="max-w-md">
      <RetrievedSource
        icon={Note01Icon}
        title="Q3 planning notes"
        location="Sep 12"
      >
        Ship the connector to every workspace before GA.
      </RetrievedSource>
      <RetrievedSource
        icon={Note01Icon}
        title="Launch retro"
        location="Oct 2"
      />
    </RetrievedSources>
  )
}
