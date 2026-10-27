"use client"

import * as React from "react"
import {
  File01Icon,
  Globe02Icon,
  PencilEdit02Icon,
} from "@hugeicons/core-free-icons"

import {
  AgentStep,
  AgentStepDetail,
  AgentStepResult,
  AgentStepResults,
  AgentSteps,
  AgentStepsContent,
  AgentStepsTrigger,
  type AgentStepStatus,
} from "@/registry/aiellie/components/agent-steps"
import { Button } from "@/registry/aiellie/ui/button"

const STEPS = [
  {
    icon: Globe02Icon,
    label: "Searched for container query support",
    results: ["MDN", "Can I use", "web.dev"],
  },
  {
    icon: File01Icon,
    label: "Read app/components/chart.tsx",
    detail: "The chart is fixed at 640px wide.",
  },
  {
    icon: PencilEdit02Icon,
    label: "Sized the chart from its container",
    detail: "Two lines changed in chart.tsx.",
  },
]

const STEP_DELAY = 1400

export default function AgentStepsDemo() {
  const [run, setRun] = React.useState(0)
  const [done, setDone] = React.useState(0)
  const streaming = done < STEPS.length

  React.useEffect(() => {
    let count = 0
    const timer = setInterval(() => {
      count += 1
      setDone(count)
      if (count >= STEPS.length) clearInterval(timer)
    }, STEP_DELAY)
    return () => clearInterval(timer)
  }, [run])

  const statusOf = (index: number): AgentStepStatus =>
    index < done ? "done" : index === done ? "active" : "pending"

  return (
    <div className="flex w-full max-w-md flex-col items-start gap-6 px-4">
      <AgentSteps
        key={run}
        streaming={streaming}
        duration={(STEPS.length * STEP_DELAY) / 1000}
      >
        <AgentStepsTrigger />
        <AgentStepsContent>
          {STEPS.map((step, index) => (
            <AgentStep
              key={step.label}
              status={statusOf(index)}
              icon={step.icon}
              label={step.label}
            >
              {step.results && index < done ? (
                <AgentStepResults>
                  {step.results.map((result) => (
                    <AgentStepResult key={result}>{result}</AgentStepResult>
                  ))}
                </AgentStepResults>
              ) : null}
              {step.detail && index < done ? (
                <AgentStepDetail>{step.detail}</AgentStepDetail>
              ) : null}
            </AgentStep>
          ))}
        </AgentStepsContent>
      </AgentSteps>
      <Button
        variant="outline"
        size="sm"
        disabled={streaming}
        onClick={() => {
          setDone(0)
          setRun((current) => current + 1)
        }}
      >
        Run again
      </Button>
    </div>
  )
}
