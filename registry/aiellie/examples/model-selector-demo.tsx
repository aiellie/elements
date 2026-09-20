"use client"

import * as React from "react"

import {
  ModelSelector,
  type ModelOption,
} from "@/registry/aiellie/components/model-selector"

/**
 * A model from every vendor the marks cover, in the order a product might have
 * added them rather than sorted by vendor: Claude Haiku comes after Grok and
 * still lists under Anthropic, because a group sits where its first model was.
 * Mistral Large is the one the plan leaves out.
 */
const MODELS: ModelOption[] = [
  { id: "claude-opus", name: "Claude Opus", vendor: "claude" },
  { id: "claude-sonnet", name: "Claude Sonnet", vendor: "claude" },
  { id: "gpt", name: "GPT", vendor: "openai" },
  { id: "gemini-pro", name: "Gemini Pro", vendor: "gemini" },
  { id: "grok", name: "Grok", vendor: "grok" },
  { id: "claude-haiku", name: "Claude Haiku", vendor: "claude" },
  { id: "deepseek-chat", name: "DeepSeek Chat", vendor: "deepseek" },
  {
    id: "mistral-large",
    name: "Mistral Large",
    vendor: "mistral",
    disabled: true,
  },
  { id: "v0-md", name: "v0 md", vendor: "v0" },
]

/**
 * The selector with its search on, which is the part worth pressing: typing
 * narrows the rows by name and drops the headings left with nothing under them.
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
