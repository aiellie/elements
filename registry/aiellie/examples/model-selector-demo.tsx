"use client"

import * as React from "react"

import { MODELS } from "@/registry/aiellie/lib/models"
import { ModelSelector } from "@/registry/aiellie/components/model-selector"

/**
 * The selector with its search on, which is the part worth pressing: typing
 * narrows the rows by name and drops the headings left with nothing under them.
 *
 * The models are the list in `lib/models`, which is where a project edits them
 * — the element itself holds no catalogue, only whatever it is handed.
 *
 * The choice is held here because the element does not hold one — whatever
 * sends the message reads it, so in a real composer it already lives out here.
 */
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
