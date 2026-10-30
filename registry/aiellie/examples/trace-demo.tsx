"use client"

import {
  Brain02Icon,
  CommandLineIcon,
  File01Icon,
  Globe02Icon,
  Link01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceDescription,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@/registry/aiellie/ui/trace"

export default function TraceDemo() {
  return (
    <Trace className="max-w-sm">
      <TraceCollapsible>
        <TraceCollapsibleTrigger>
          <TraceLine>
            <TraceIcon>
              <HugeiconsIcon icon={Brain02Icon} />
            </TraceIcon>
            <TraceTitle>Worked for 6s</TraceTitle>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent>
          The layout sets a max width on the main column, so the cards wrap
          early. Checking whether container queries would let each card size to
          its column instead.
        </TraceCollapsibleContent>
      </TraceCollapsible>
      <TraceCollapsible>
        <TraceCollapsibleTrigger>
          <TraceLine>
            <TraceIcon>
              <HugeiconsIcon icon={Globe02Icon} />
            </TraceIcon>
            <TraceTitle>Searched the web</TraceTitle>
            <TraceDescription>“css container queries support”</TraceDescription>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent>
          Container queries | MDN, Can I use
        </TraceCollapsibleContent>
      </TraceCollapsible>
      <div>
        <TraceLine>
          <TraceIcon>
            <HugeiconsIcon icon={File01Icon} />
          </TraceIcon>
          <TraceTitle>Read</TraceTitle>
          <TraceDescription>app/layout.tsx</TraceDescription>
        </TraceLine>
      </div>
      <div>
        <TraceLine status="error">
          <TraceIcon>
            <HugeiconsIcon icon={Link01Icon} />
          </TraceIcon>
          <TraceTitle>Couldn’t open</TraceTitle>
          <TraceDescription>caniuse.com/css-container-queries</TraceDescription>
        </TraceLine>
      </div>
      <div>
        <TraceLine status="running">
          <TraceIcon>
            <HugeiconsIcon icon={CommandLineIcon} />
          </TraceIcon>
          <TraceTitle>Running</TraceTitle>
          <TraceDescription>pnpm test</TraceDescription>
        </TraceLine>
      </div>
    </Trace>
  )
}
