"use client"

import * as React from "react"

import { ModelSelector } from "@/registry/aiellie/components/model-selector"
import { MODELS } from "@/registry/aiellie/lib/models"
import { Button } from "@/registry/aiellie/ui/button"

export default function Ghost() {
  const [model, setModel] = React.useState("")

  return (
    <ModelSelector
      models={MODELS}
      value={model}
      onValueChange={setModel}
      placeholder="Pick a model"
      render={<Button variant="ghost" size="sm" />}
      side="top"
    />
  )
}
