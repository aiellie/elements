"use client"

import * as React from "react"

import { MODELS } from "@/registry/aiellie/lib/models"
import { ModelSelector } from "@/registry/aiellie/components/model-selector"

export default function ModelSelectorDemo() {
  const [model, setModel] = React.useState("claude-opus")

  return (
    <ModelSelector
      models={MODELS}
      value={model}
      onValueChange={setModel}
      showSearch
    />
  )
}
