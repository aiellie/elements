"use client"

import * as React from "react"

import {
  RunBudget,
  type RunBudgetState,
} from "@/registry/aiellie/components/run-budget"

// What the whole task costs, so a $1 cap stops it and a bigger one doesn't.
const TASK_COST = 1.37
const STEP_MS = 450

export default function RunBudgetDemo() {
  const [state, setState] = React.useState<RunBudgetState>("setting")
  const [limit, setLimit] = React.useState(1)
  const [spent, setSpent] = React.useState(0)
  const [turns, setTurns] = React.useState(0)
  const [kept, setKept] = React.useState(false)

  React.useEffect(() => {
    if (state !== "running") return
    const timer = setTimeout(() => {
      const next = Math.min(TASK_COST, spent + 0.04 + Math.random() * 0.05)
      setTurns((count) => count + 1)
      setSpent(next)
      if (next >= TASK_COST) setState("done")
      else if (next >= limit) setState("stopped")
    }, STEP_MS)
    return () => clearTimeout(timer)
  }, [state, limit, spent])

  const reset = () => {
    setState("setting")
    setSpent(0)
    setTurns(0)
    setKept(false)
  }

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-3">
      <RunBudget
        state={state}
        limit={limit}
        spent={spent}
        onLimitChange={setLimit}
        onStart={() => setState("running")}
        turns={turns}
        elapsedSeconds={(turns * STEP_MS) / 1000}
        kept={[
          { label: "Files changed", value: "4" },
          { label: "Tests passing", value: "31 of 33" },
        ]}
        onKeep={kept ? undefined : () => setKept(true)}
        onRaise={
          kept
            ? undefined
            : (next) => {
                setLimit(next)
                setState("running")
              }
        }
      />
      {state === "done" || kept ? (
        <button
          type="button"
          onClick={reset}
          className="cursor-pointer rounded-sm border border-transparent text-xs text-muted-foreground outline-none hover:text-foreground focus-visible:border-ring"
        >
          Run again
        </button>
      ) : null}
    </div>
  )
}
