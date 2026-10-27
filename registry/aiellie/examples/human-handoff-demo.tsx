"use client"

import * as React from "react"

import {
  HumanHandoff,
  type HandoffState,
} from "@/registry/aiellie/components/human-handoff"

const SUMMARY =
  "Charged twice for the March invoice. The assistant confirmed both charges and couldn't refund the second one itself."

const DETAILS = [
  { label: "Invoice", value: "INV-20418" },
  { label: "Tried", value: "Refund through billing, which needs a person" },
]

export default function HumanHandoffDemo() {
  const [state, setState] = React.useState<HandoffState>("offered")
  const [position, setPosition] = React.useState(3)

  React.useEffect(() => {
    if (state !== "connecting") return
    const timer = setTimeout(() => {
      if (position <= 1) setState("connected")
      else setPosition(position - 1)
    }, 1800)
    return () => clearTimeout(timer)
  }, [state, position])

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-3">
      <HumanHandoff
        state={state}
        reason="Refunds need someone from billing"
        summary={SUMMARY}
        details={DETAILS}
        queuePosition={position}
        waitSeconds={position * 50 + 20}
        agent={{ name: "Maya Okafor", role: "Billing support" }}
        hours="Back at 9:00 tomorrow"
        onConnect={() => {
          setPosition(3)
          setState("connecting")
        }}
        onDismiss={() => setState("unavailable")}
        onCancel={() => setState("offered")}
        onLeaveContact={() => {}}
        onEnd={() => setState("ended")}
      />
      {state === "ended" || state === "unavailable" ? (
        <button
          type="button"
          onClick={() => setState("offered")}
          className="cursor-pointer rounded-sm border border-transparent text-xs text-muted-foreground outline-none hover:text-foreground focus-visible:border-ring"
        >
          Start over
        </button>
      ) : null}
    </div>
  )
}
