"use client"

import * as React from "react"

import {
  ModelSelector,
  type ModelOption,
} from "@/registry/aiellie/components/model-selector"

const MODELS: ModelOption[] = [
  {
    id: "anthropic/claude-sonnet-5",
    name: "Claude Sonnet 5",
    vendor: "claude",
  },
  {
    id: "anthropic/claude-opus-5.5",
    name: "Claude Opus 5.5",
    vendor: "claude",
    disabled: true,
  },
  { id: "openai/gpt-6-luna", name: "GPT-6 Luna", vendor: "openai" },
  { id: "google/gemini-3-flash", name: "Gemini 3 Flash", vendor: "gemini" },
]

export default function Availability() {
  const [model, setModel] = React.useState(MODELS[0].id)

  return (
    <ModelSelector models={MODELS} value={model} onValueChange={setModel} />
  )
}
