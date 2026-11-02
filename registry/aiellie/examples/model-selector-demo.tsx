"use client"

import * as React from "react"

import { ModelSelector } from "@/registry/aiellie/components/model-selector"
import type { Effort, ModelOption } from "@/registry/aiellie/lib/models"

const MODELS: ModelOption[] = [
  {
    id: "anthropic/claude-opus-5.5",
    name: "Claude Opus 5.5",
    efforts: ["low", "medium", "high", "max"],
    contexts: [200_000, 1_000_000],
    fastId: "anthropic/claude-opus-5.5-fast",
  },
  {
    id: "anthropic/claude-sonnet-5",
    name: "Claude Sonnet 5",
    efforts: ["low", "medium", "high"],
  },
  {
    id: "openai/gpt-6-sol",
    name: "GPT-6 Sol",
    efforts: ["minimal", "low", "medium", "high", "xhigh"],
  },
  { id: "google/gemini-3.1-pro-preview", name: "Gemini 3.1 Pro" },
  { id: "deepseek/deepseek-v4.1-flash", name: "DeepSeek V4.1 Flash" },
]

export default function ModelSelectorDemo() {
  const [model, setModel] = React.useState(MODELS[0].id)
  const [effort, setEffort] = React.useState<Effort>("medium")
  const [context, setContext] = React.useState(1_000_000)
  const [fast, setFast] = React.useState(false)
  const option = MODELS.find((candidate) => candidate.id === model)

  return (
    <ModelSelector
      models={MODELS}
      value={model}
      onValueChange={setModel}
      effort={option?.efforts?.includes(effort) ? effort : option?.efforts?.[0]}
      onEffortChange={setEffort}
      context={option?.contexts ? context : undefined}
      onContextChange={setContext}
      fast={fast && option?.fastId !== undefined}
      onFastChange={setFast}
    />
  )
}
