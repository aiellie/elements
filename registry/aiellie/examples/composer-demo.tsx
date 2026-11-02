"use client"

import * as React from "react"
import { GlobalSearchIcon } from "@hugeicons/core-free-icons"

import {
  Composer,
  ComposerAddFiles,
  ComposerAddFolder,
  ComposerAddMenu,
  ComposerAddScreenshot,
  ComposerDictate,
  ComposerEmoji,
  ComposerFooter,
  ComposerInput,
  ComposerSubmit,
  ComposerToggle,
  type ComposerStatus,
} from "@/registry/aiellie/components/composer"
import { ModelSelector } from "@/registry/aiellie/components/model-selector"
import type { Effort, ModelOption } from "@/registry/aiellie/lib/models"

const MODELS: ModelOption[] = [
  {
    id: "anthropic/claude-opus-5.5",
    name: "Claude Opus 5.5",
    efforts: ["low", "medium", "high", "max"],
  },
  { id: "openai/gpt-6-sol", name: "GPT-6 Sol", efforts: ["low", "medium", "high"] },
  { id: "google/gemini-3.1-pro-preview", name: "Gemini 3.1 Pro" },
]

export default function ComposerDemo() {
  const [status, setStatus] = React.useState<ComposerStatus>("ready")
  const [search, setSearch] = React.useState(false)
  const [model, setModel] = React.useState(MODELS[0].id)
  const [effort, setEffort] = React.useState<Effort>("medium")
  const timer = React.useRef<ReturnType<typeof setTimeout>>(undefined)

  React.useEffect(() => () => clearTimeout(timer.current), [])

  return (
    <div className="w-full max-w-xl px-4">
      <Composer
        status={status}
        onSubmit={() => {
          setStatus("streaming")
          timer.current = setTimeout(() => setStatus("ready"), 2400)
        }}
        onStop={() => {
          clearTimeout(timer.current)
          setStatus("ready")
        }}
      >
        <ComposerInput placeholder="Ask anything" />
        <ComposerFooter>
          <ComposerAddMenu>
            <ComposerAddFiles />
            <ComposerAddFolder />
            <ComposerAddScreenshot />
          </ComposerAddMenu>
          <ComposerEmoji />
          <ComposerToggle
            pressed={search}
            onPressedChange={setSearch}
            icon={GlobalSearchIcon}
            label="Search"
            tooltip="Search the web"
          />
          <ModelSelector
            models={MODELS}
            value={model}
            onValueChange={setModel}
            effort={MODELS.find((option) => option.id === model)?.efforts ? effort : undefined}
            onEffortChange={setEffort}
          />
          <div className="flex-1" />
          <ComposerDictate />
          <ComposerSubmit />
        </ComposerFooter>
      </Composer>
    </div>
  )
}
