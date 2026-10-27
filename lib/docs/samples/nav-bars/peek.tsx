"use client"

import * as React from "react"

import {
  NavBars,
  useNavBarsInView,
} from "@/registry/aiellie/components/nav-bars"

const SECTIONS = [
  { id: "peek-goal", label: "Goal", description: "What the plan is for." },
  { id: "peek-steps", label: "Steps", description: "What happens, in order." },
  { id: "peek-risks", label: "Risks", description: "What could go wrong." },
  { id: "peek-owners", label: "Owners", description: "Who does each step." },
]

export default function Peek() {
  const scroller = React.useRef<HTMLDivElement>(null)
  const active = useNavBarsInView(
    SECTIONS.map((section) => section.id),
    scroller
  )

  return (
    <div className="flex h-56 w-full max-w-md gap-2 overflow-hidden rounded-xl border py-2 ps-2">
      <NavBars
        variant="peek"
        items={SECTIONS}
        active={active}
        onSelect={(id) => document.getElementById(id)?.scrollIntoView()}
        className="self-center"
      />
      <div
        ref={scroller}
        className="flex min-w-0 flex-1 flex-col gap-8 overflow-y-auto pe-4"
      >
        {SECTIONS.map((section) => (
          <section
            key={section.id}
            id={section.id}
            className="flex flex-col gap-1"
          >
            <h3 className="text-sm font-medium">{section.label}</h3>
            <p className="text-sm text-muted-foreground">
              {section.description} A few lines of the section go here, so there
              is something to scroll past.
            </p>
          </section>
        ))}
        <div className="h-24 shrink-0" />
      </div>
    </div>
  )
}
