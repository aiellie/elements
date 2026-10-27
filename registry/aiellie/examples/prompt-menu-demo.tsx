"use client"

import * as React from "react"

import { PromptMenu } from "@/registry/aiellie/components/prompt-menu"

export default function PromptMenuDemo() {
  const [prompt, setPrompt] = React.useState("")

  return <PromptMenu value={prompt} onValueChange={setPrompt} />
}
