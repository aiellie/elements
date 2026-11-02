"use client"

import * as React from "react"

import {
  PlanReview,
  type PlanDecision,
  type PlanReviewState,
} from "@/registry/aiellie/components/plan-review"

const STEPS = [
  { id: "read", label: "Read the agents.md and design.md files" },
  { id: "build", label: "Write the element in the kit registry/aiellie/<slug>.tsx" },
  { id: "tests", label: "Use the test quality skill to test the element" },
  { id: "register", label: "Register it for installation in registry.json" },
  { id: "demo", label: "Add registry/aiellie/examples/<slug-demo>.tsx with realistic standalone data." },
]

export default function PlanReviewDemo() {
  const [state, setState] = React.useState<PlanReviewState>("review")
  const [decision, setDecision] = React.useState<PlanDecision>()
  const [note, setNote] = React.useState("")

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-3">
      <PlanReview
        title="Build an element"
        steps={STEPS}
        state={state}
        decision={decision}
        note={note}
        onApprove={(next) => {
          setDecision(next)
          setState("approved")
        }}
        onRevise={(text, next) => {
          setNote(text)
          setDecision(next)
          setState("revising")
        }}
      />
      {state !== "review" ? (
        <button
          type="button"
          onClick={() => {
            setState("review")
            setDecision(undefined)
          }}
          className="cursor-pointer rounded-sm border border-transparent text-xs text-muted-foreground outline-none hover:text-foreground focus-visible:border-ring"
        >
          Review it again
        </button>
      ) : null}
    </div>
  )
}
