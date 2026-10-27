"use client"

import * as React from "react"
import {
  Baby01Icon,
  Briefcase01Icon,
  SmileIcon,
} from "@hugeicons/core-free-icons"

import {
  PromptMenu,
  type Prompt,
  type PromptGroup,
} from "@/registry/aiellie/components/prompt-menu"

const GROUPS: PromptGroup[] = [{ id: "tone", name: "Tone", icon: SmileIcon }]

const PROMPTS: Prompt[] = [
  {
    id: "plain",
    name: "Plain words",
    group: "tone",
    description: "Explains it the way you would to a ten-year-old.",
    prompt: "Use short sentences and everyday words.",
    icon: Baby01Icon,
  },
  {
    id: "business",
    name: "Business",
    group: "tone",
    description: "Ready to paste into an email to a client.",
    prompt: "Write as you would to a client: polite, brief and clear.",
    icon: Briefcase01Icon,
  },
]

export default function YourPrompts() {
  const [prompt, setPrompt] = React.useState("plain")

  return (
    <PromptMenu
      prompts={PROMPTS}
      groups={GROUPS}
      value={prompt}
      onValueChange={setPrompt}
      label="Tone"
    />
  )
}
